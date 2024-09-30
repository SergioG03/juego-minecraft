const express = require('express');
<<<<<<< Updated upstream
const path = require('path');
const multer = require('multer');
=======
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

>>>>>>> Stashed changes
const app = express();
const PORT = 3000;

<<<<<<< Updated upstream
// Configurar el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear datos del formulario
app.use(express.urlencoded({ extended: true }));

// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada imagen
    }
});

const upload = multer({ storage: storage });

// Redirigir la ruta principal a "Elegir Personaje"
app.get('/', (req, res) => {
    res.redirect('/choose-character');
});

// Ruta para elegir personaje
app.get('/choose-character', (req, res) => {
=======
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

>>>>>>> Stashed changes
    const characters = [
        { name: 'Zombie', health: 100, stamina: 50, energy: 30 },
        { name: 'Creeper', health: 120, stamina: 40, energy: 60 },
        { name: 'Archer', health: 80, stamina: 60, energy: 40 }
    ];
    res.render('choose-character', { characters });
});

// Ruta para jugar
app.get('/play', (req, res) => {
<<<<<<< Updated upstream
=======
    if (!req.session.userId) {
        req.session.error_msg = 'Por favor, inicia sesión primero'; // Guardar mensaje de error en la sesión
        return res.redirect('/login');
    }
>>>>>>> Stashed changes
    res.render('play');
});

// Ruta para crear personaje
app.get('/create', (req, res) => {
    res.render('create');
});

// Ruta para manejar la creación de personajes
app.post('/api/create-character', upload.single('image'), (req, res) => {
    const { name, health, stamina, energy } = req.body;
    const imagePath = req.file.path; // Ruta de la imagen subida

    // Guardar personaje en localStorage simulado (en memoria)
    let characters = JSON.parse(localStorage.getItem('characters')) || [];
    characters.push({
        name,
        health: parseInt(health),
        stamina: parseInt(stamina),
        energy: parseInt(energy),
        imagePath
    });

    // Guardar la lista actualizada de personajes en localStorage simulado
    localStorage.setItem('characters', JSON.stringify(characters));

    res.json({ message: 'Personaje creado con éxito', character: { name, health, stamina, energy, imagePath } });
});

// Ruta para la tienda
app.get('/shop', (req, res) => {
<<<<<<< Updated upstream
=======
    if (!req.session.userId) {
        req.session.error_msg = 'Por favor, inicia sesión primero'; // Guardar mensaje de error en la sesión
        return res.redirect('/login');
    }

>>>>>>> Stashed changes
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
