const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const argon2 = require('argon2'); // Importar argon2
const mongoose = require('mongoose');
const User = require('./models/User'); // Asegúrate de tener el modelo User

const app = express();

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost/minecraft-portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log(err));

// Configurar el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: 'secreto-super-seguro',
    resave: false,
    saveUninitialized: true
}));

// Flash para mensajes de éxito/error
app.use(flash());

// Variables globales para mensajes flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Ruta principal - Página principal que redirige a elegir personaje (si el usuario está logueado)
app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('main', { user: req.session.user });
    } else {
        req.flash('error_msg', 'Por favor, inicia sesión para acceder');
        res.redirect('/login');
    }
});

// Ruta de registro
app.get('/register', (req, res) => {
    res.render('register', { errors: [] });
});

// Procesar el registro
app.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;
    let errors = [];

    // Validación básica
    if (!username || !password || !password2) {
        errors.push({ msg: 'Por favor, completa todos los campos' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Las contraseñas no coinciden' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    if (errors.length > 0) {
        return res.render('register', { errors });
    }

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            errors.push({ msg: 'El nombre de usuario ya está registrado' });
            return res.render('register', { errors });
        }

        // Crear y guardar el nuevo usuario con la contraseña encriptada
        const hashedPassword = await argon2.hash(password); // Encriptar la contraseña

        const newUser = new User({
            username,
            password: hashedPassword // Guardar la contraseña encriptada
        });

        await newUser.save();

        req.flash('success_msg', 'Te has registrado, ahora puedes iniciar sesión');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('register', { errors: [{ msg: 'Hubo un error con el registro' }] });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Encuentra todos los usuarios
        res.json(users); // Muestra los usuarios en formato JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener usuarios');
    }
});

// Ruta de inicio de sesión
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    let errors = [];

    // Verifica si se completaron ambos campos
    if (!username || !password) {
        errors.push({ msg: 'Por favor completa todos los campos' });
        req.flash('error_msg', 'Por favor completa todos los campos');
        return res.redirect('/login');
    }

    try {
        console.log("Buscando usuario: ", username);

        // Encuentra el usuario por nombre de usuario
        const user = await User.findOne({ username });

        if (!user) {
            // Si no se encuentra el usuario, muestra un error
            req.flash('error_msg', 'Usuario no encontrado');
            return res.redirect('/login');
        }

        // Comparar la contraseña
        const isMatch = await argon2.verify(user.password, password);

        if (isMatch) {
            // Si coincide, iniciar sesión
            req.session.user = user;
            req.flash('success_msg', 'Inicio de sesión exitoso');
            return res.redirect('/');
        } else {
            req.flash('error_msg', 'Contraseña incorrecta');
            return res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Hubo un error al iniciar sesión');
        return res.redirect('/login');
    }
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Rutas relacionadas con el juego (sin modificaciones)
app.get('/choose-character', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Por favor, inicia sesión primero');
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
    if (!req.session.user) {
        req.flash('error_msg', 'Por favor, inicia sesión primero');
        return res.redirect('/login');
    }
    res.render('play');
});

// Ruta para la tienda
app.get('/shop', (req, res) => {
    if (!req.session.user) {
        req.flash('error_msg', 'Por favor, inicia sesión primero');
        return res.redirect('/login');
    }

    const creatures = [
        { name: 'Enderman', price: 50 },
        { name: 'Esqueleto', price: 80 },
        { name: 'Araña', price: 100 }
    ];
    res.render('shop', { creatures });
});

// Escucha del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
