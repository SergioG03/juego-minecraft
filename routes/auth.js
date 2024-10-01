const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Ruta para la página de inicio
router.get('/', (req, res) => {
    res.redirect('/login'); // Redirige a la página de inicio de sesión
});

// Registro
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    
    try {
        await user.save();
        res.redirect('/login');
    } catch (error) {
        res.status(400).send('Error al registrar el usuario');
    }
});

// Inicio de sesión
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } else {
        res.status(400).send('Credenciales inválidas');
    }
});

// Ruta para el dashboard
router.get('/dashboard', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    try {
        // Buscar el usuario en la base de datos usando el ID de la sesión
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.redirect('/login');
        }
        // Renderizar la vista y pasar el nombre de usuario
        res.render('dashboard', { username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener el usuario');
    }
});

module.exports = router;
