const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuration
canvas.width = 800;
canvas.height = 500;

const spritesPath = 'sprites/'; // Folder where images are kept
const spriteFiles = {
    idle: 'idle.jpg',
    stance: 'stance.jpg',
    punch: 'punch.jpg',
    kick: 'kick.jpg',
    jump: 'jump.jpg'
};

// State handling
const images = {};
let imagesLoaded = 0;
const totalImages = Object.keys(spriteFiles).length;

// Load images
for (let key in spriteFiles) {
    images[key] = new Image();
    images[key].src = spritesPath + spriteFiles[key];
    images[key].onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            requestAnimationFrame(gameLoop);
        }
    };
}

const player = {
    x: canvas.width / 2 - 100,
    y: canvas.height - 350,
    width: 200,
    height: 250,
    state: 'idle',
    velocityY: 0,
    isGrounded: true,
    gravity: 0.8,
    jumpForce: -15,
    actionTimer: 0 // Duration for punch/kick/stance
};

const keys = {};

// Input Listeners
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

function update() {
    // Reset state to idle by default if no action is happening
    if (player.isGrounded && player.actionTimer <= 0) {
        player.state = 'idle';
    }

    // Prioritize Actions
    if (player.actionTimer > 0) {
        player.actionTimer--;
    } else {
        if (keys['Space'] && player.isGrounded) {
            player.state = 'jump';
            player.velocityY = player.jumpForce;
            player.isGrounded = false;
        } else if (keys['KeyJ']) {
            player.state = 'punch';
            player.actionTimer = 15; // frames
        } else if (keys['KeyK']) {
            player.state = 'kick';
            player.actionTimer = 20; // frames
        } else if (keys['KeyS']) {
            player.state = 'stance';
        }
    }

    // Apply Physics for Jumping
    if (!player.isGrounded) {
        player.y += player.velocityY;
        player.velocityY += player.gravity;
        player.state = 'jump';

        // Check floor collision
        if (player.y >= canvas.height - 350) {
            player.y = canvas.height - 350;
            player.isGrounded = true;
            player.velocityY = 0;
            player.state = 'idle';
        }
    }
}

function drawBackground() {
    // Simple Rooftop/Arena background
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Floor
    ctx.fillStyle = '#1a252f';
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // Distant "City" lights
    ctx.fillStyle = '#f1c40f';
    for(let i=0; i < 5; i++) {
        ctx.fillRect(100 + (i*150), 300, 30, 100);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();

    // Draw Character Sprite
    const currentImg = images[player.state];
    if (currentImg) {
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(player.x + 100, canvas.height - 100, 60, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.drawImage(currentImg, player.x, player.y, player.width, player.height);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
