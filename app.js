const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();

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
    const characters = [
        { name: 'Zombie', health: 100, stamina: 50, energy: 30 },
        { name: 'Creeper', health: 120, stamina: 40, energy: 60 },
        { name: 'Archer', health: 80, stamina: 60, energy: 40 }
    ];
    res.render('choose-character', { characters });
});

// Ruta para jugar
app.get('/play', (req, res) => {
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
