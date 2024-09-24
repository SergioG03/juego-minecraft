let selectedCharacter = null;
let coins = 0;
let stats = {
    health: 100,
    stamina: 50,
    energy: 30
};

// Función para seleccionar un personaje y redirigir
function selectCharacter(name) {
    selectedCharacter = name;
    window.location.href = `/play/${name}`;
}

// Función para subir de nivel y aumentar las estadísticas
function levelUp() {
    if (!selectedCharacter) {
        alert('Primero selecciona un personaje');
        return;
    }
    stats.health += 10;
    stats.stamina += 5;
    stats.energy += 3;
    coins += 10;  // Ganas 10 monedas al subir de nivel
    document.getElementById('stats').textContent = `Estadísticas del Personaje: Vida: ${stats.health}, Estamina: ${stats.stamina}, Energía: ${stats.energy}`;
    document.getElementById('coins').textContent = `Monedas: ${coins}`;
}

// Función para desbloquear criaturas en la tienda
function unlockCreature(creatureName, price) {
    if (coins >= price) {
        coins -= price;
        alert(`¡Has desbloqueado a ${creatureName}!`);
        document.getElementById('available-coins').textContent = `Monedas disponibles: ${coins}`;
    } else {
        alert('No tienes suficientes monedas para desbloquear este personaje.');
    }
}
