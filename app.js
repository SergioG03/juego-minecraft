const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/miapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true
}));

// Middleware para guardar mensajes de error en la sesión
app.use((req, res, next) => {
    res.locals.error_msg = req.session.error_msg || null; // Guardar el mensaje de error en la vista
    req.session.error_msg = null; // Limpiar el mensaje de error en la sesión
    next();
});

// Rutas
app.use('/', authRoutes);

// Rutas relacionadas con el juego (sin modificaciones)
app.get('/choose-character', (req, res) => {
    if (!req.session.userId) {
        req.session.error_msg = 'Por favor, inicia sesión primero'; // Guardar mensaje de error en la sesión
        return res.redirect('/login');
    }

    const characters = [
        { name: 'Zombie', health: 100, stamina: 50, energy: 30 },
        { name: 'Creeper', health: 120, stamina: 40, energy: 60 },
        { name: 'Archer', health: 80, stamina: 60, energy: 40 }
    ];
    res.render('choose-character', { characters });
});

// Ruta para main
app.get('/main', (req, res) => {
    res.render('main');
});

// Ruta para jugar
app.get('/play', (req, res) => {
    if (!req.session.userId) {
        req.session.error_msg = 'Por favor, inicia sesión primero'; // Guardar mensaje de error en la sesión
        return res.redirect('/login');
    }
    res.render('play');
});

// Ruta para la tienda
app.get('/shop', (req, res) => {
    if (!req.session.userId) {
        req.session.error_msg = 'Por favor, inicia sesión primero'; // Guardar mensaje de error en la sesión
        return res.redirect('/login');
    }

    const creatures = [
        { name: 'Enderman', price: 50 },
        { name: 'Esqueleto', price: 80 },
        { name: 'Araña', price: 100 }
    ];
    res.render('shop', { creatures });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
