const express = require('express');
const app = express();
const path = require('path');

// Configurar el motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

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
