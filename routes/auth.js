const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('models/User');

const router = express.Router();

// GET página de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// POST registro de usuario
router.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;
    let errors = [];

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
        res.render('register', { errors });
    } else {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            errors.push({ msg: 'El usuario ya está registrado' });
            res.render('register', { errors });
        } else {
            const newUser = new User({ username, password });
            await newUser.save();
            req.flash('success_msg', 'Registro exitoso, ahora puedes iniciar sesión');
            res.redirect('/login');
        }
    }
});

// GET página de inicio de sesión
router.get('/login', (req, res) => {
    res.render('login');
});

// POST inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        req.flash('error_msg', 'Usuario no encontrado');
        return res.redirect('/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        req.session.user = user;
        res.redirect('/');
    } else {
        req.flash('error_msg', 'Contraseña incorrecta');
        res.redirect('/login');
    }
});

// GET cerrar sesión
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// GET página principal solo si está autenticado
router.get('/', (req, res) => {
    if (req.session.user) {
        res.render('index', { user: req.session.user });
    } else {
        req.flash('error_msg', 'Por favor, inicia sesión para acceder');
        res.redirect('/login');
    }
});

module.exports = router;
