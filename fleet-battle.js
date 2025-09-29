// Fleet Battle Game Engine
// Interactive space combat with pixelart spaceships

class FleetBattleGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.selectedFleet = 'balanced';
        this.score = 0;
        this.wave = 1;
        this.playerShips = [];
        this.enemyShips = [];
        this.projectiles = [];
        this.explosions = [];
        this.particles = [];
        this.stars = [];
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        
        // Game settings
        this.playerHull = 100;
        this.playerShield = 100;
        this.lastShot = 0;
        this.shotCooldown = 250;
        
        // Audio system
        this.audioEnabled = true;
        this.setupAudio();
        
        // Asset loading
        this.images = {};
        this.loadAssets();
        
        this.init();
    }
    
    async loadAssets() {
        const assetPaths = {
            // Player ships
            'fighter': 'fighter.png',
            'frigate': 'frigate.png',
            'scout': 'scout.png',
            
            // Enemy ships from Kla'ed fleet
            'enemy-fighter': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Fighter - Base.png",
            'enemy-bomber': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Bomber - Base.png",
            'enemy-scout': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Scout - Base.png",
            'enemy-frigate': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Frigate - Base.png",
            'enemy-battlecruiser': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Battlecruiser - Base.png",
            'enemy-dreadnought': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Dreadnought - Base.png",
            'enemy-support': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Support ship - Base.png",
            'enemy-torpedo': "Foozle_2DS0012_Void_EnemyFleet_1/Kla'ed/Base/PNGs/Kla'ed - Torpedo Ship - Base.png",
            
            // Effects
            'bullet': 'bullet.png',
            'ray': 'ray.png',
            'explosion': 'fighter-explosion.png'
        };
        
        const loadPromises = Object.entries(assetPaths).map(([key, path]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    console.warn(`Failed to load image: ${path}`);
                    // Create a placeholder colored rectangle
                    const canvas = document.createElement('canvas');
                    canvas.width = 32;
                    canvas.height = 32;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = key.includes('enemy') ? '#ff4444' : '#4444ff';
                    ctx.fillRect(0, 0, 32, 32);
                    this.images[key] = canvas;
                    resolve();
                };
                img.src = path;
            });
        });
        
        await Promise.all(loadPromises);
        console.log('Assets loaded successfully');
    }
    
    setupAudio() {
        // Create simple audio context for sound effects
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio not supported');
            this.audioEnabled = false;
        }
    }
    
    playSound(frequency, duration, type = 'sine') {
        if (!this.audioEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    toggleMute() {
        this.audioEnabled = !this.audioEnabled;
        const muteButton = document.getElementById('muteButton');
        if (this.audioEnabled) {
            muteButton.textContent = '🔊';
            muteButton.classList.remove('muted');
        } else {
            muteButton.textContent = '🔇';
            muteButton.classList.add('muted');
        }
    }
    
    init() {
        this.setupEventListeners();
        this.generateStars();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') {
                e.preventDefault();
                this.specialAttack();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse input
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            if (this.gameState === 'playing') {
                this.shoot();
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
        
        // UI buttons
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });
        
        // Mute button
        document.getElementById('muteButton').addEventListener('click', () => {
            this.toggleMute();
        });
        
        // Fleet selection
        document.querySelectorAll('.fleet-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.fleet-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedFleet = option.dataset.fleet;
            });
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    generateStars() {
        this.stars = [];
        for (let i = 0; i < 300; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 0.5,
                speed: Math.random() * 1.5 + 0.2,
                opacity: Math.random() * 0.9 + 0.1,
                color: Math.random() > 0.8 ? `hsl(${Math.random() * 60 + 180}, 70%, 70%)` : 'white'
            });
        }
    }
    
    startGame() {
        document.getElementById('startScreen').style.display = 'none';
        this.gameState = 'playing';
        this.score = 0;
        this.wave = 1;
        this.playerHull = 100;
        this.playerShield = 100;
        
        this.createPlayerFleet();
        this.spawnEnemyWave();
        this.updateUI();
    }
    
    restartGame() {
        document.getElementById('gameOver').style.display = 'none';
        this.playerShips = [];
        this.enemyShips = [];
        this.projectiles = [];
        this.explosions = [];
        this.particles = [];
        this.startGame();
    }
    
    createPlayerFleet() {
        this.playerShips = [];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height * 0.8;
        
        switch (this.selectedFleet) {
            case 'balanced':
                this.playerShips.push(new Ship('fighter', centerX, centerY, 'player'));
                this.playerShips.push(new Ship('frigate', centerX - 60, centerY + 40, 'player'));
                this.playerShips.push(new Ship('scout', centerX + 60, centerY + 40, 'player'));
                break;
            case 'heavy':
                this.playerShips.push(new Ship('frigate', centerX, centerY, 'player'));
                this.playerShips.push(new Ship('fighter', centerX - 80, centerY + 50, 'player'));
                this.playerShips.push(new Ship('scout', centerX + 80, centerY + 50, 'player'));
                break;
            case 'fast':
                this.playerShips.push(new Ship('fighter', centerX, centerY, 'player'));
                this.playerShips.push(new Ship('fighter', centerX - 50, centerY + 30, 'player'));
                this.playerShips.push(new Ship('fighter', centerX + 50, centerY + 30, 'player'));
                this.playerShips.push(new Ship('scout', centerX, centerY + 60, 'player'));
                break;
        }
    }
    
    spawnEnemyWave() {
        this.enemyShips = [];
        const enemyTypes = ['enemy-fighter', 'enemy-bomber', 'enemy-scout', 'enemy-frigate'];
        const bossTypes = ['enemy-battlecruiser', 'enemy-dreadnought', 'enemy-support', 'enemy-torpedo'];
        
        // Regular enemies
        const enemyCount = Math.min(3 + this.wave, 8);
        for (let i = 0; i < enemyCount; i++) {
            const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
            const x = Math.random() * (this.canvas.width - 100) + 50;
            const y = Math.random() * 200 + 50;
            this.enemyShips.push(new Ship(type, x, y, 'enemy'));
        }
        
        // Boss every 3 waves
        if (this.wave % 3 === 0) {
            const bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
            this.enemyShips.push(new Ship(bossType, this.canvas.width / 2, 100, 'enemy', true));
        }
        
        document.getElementById('enemyCount').textContent = this.enemyShips.length;
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.shotCooldown) return;
        
        this.lastShot = now;
        
        // Shoot from all player ships
        this.playerShips.forEach(ship => {
            if (ship.hull > 0) {
                const angle = Math.atan2(this.mouse.y - ship.y, this.mouse.x - ship.x);
                this.projectiles.push(new Projectile(
                    ship.x, ship.y, angle, 'player', 'bullet'
                ));
            }
        });
        
        // Play shoot sound
        this.playSound(800, 0.1, 'square');
    }
    
    specialAttack() {
        if (this.gameState !== 'playing') return;
        
        // Ray attack from all player ships
        this.playerShips.forEach(ship => {
            if (ship.hull > 0) {
                const angle = Math.atan2(this.mouse.y - ship.y, this.mouse.x - ship.x);
                this.projectiles.push(new Projectile(
                    ship.x, ship.y, angle, 'player', 'ray'
                ));
            }
        });
        
        // Play special attack sound
        this.playSound(400, 0.3, 'sawtooth');
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Update stars
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        // Update player ships
        this.updatePlayerMovement();
        this.playerShips.forEach(ship => ship.update());
        
        // Update enemy ships
        this.enemyShips.forEach(ship => {
            ship.update();
            ship.aiUpdate(this.playerShips, this.projectiles);
        });
        
        // Update projectiles
        this.projectiles.forEach(projectile => projectile.update());
        
        // Update explosions
        this.explosions.forEach(explosion => explosion.update());
        
        // Update particles
        this.particles.forEach(particle => particle.update());
        
        // Handle collisions
        this.handleCollisions();
        
        // Clean up dead objects
        this.cleanup();
        
        // Enemy AI shooting
        this.enemyAI();
        
        // Check win/lose conditions
        this.checkGameState();
    }
    
    updatePlayerMovement() {
        if (this.playerShips.length === 0) return;
        
        const flagship = this.playerShips[0];
        const speed = 3;
        
        let dx = 0, dy = 0;
        
        if (this.keys['KeyW'] || this.keys['ArrowUp']) dy -= speed;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) dy += speed;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) dx -= speed;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) dx += speed;
        
        // Move all player ships in formation
        this.playerShips.forEach((ship, index) => {
            if (ship.hull > 0) {
                ship.x = Math.max(20, Math.min(this.canvas.width - 20, ship.x + dx));
                ship.y = Math.max(20, Math.min(this.canvas.height - 20, ship.y + dy));
                
                // Face towards mouse
                ship.angle = Math.atan2(this.mouse.y - ship.y, this.mouse.x - ship.x);
            }
        });
    }
    
    enemyAI() {
        this.enemyShips.forEach(ship => {
            if (ship.hull <= 0) return;
            
            // Random shooting
            if (Math.random() < 0.02) {
                const target = this.playerShips.find(p => p.hull > 0);
                if (target) {
                    const angle = Math.atan2(target.y - ship.y, target.x - ship.x);
                    this.projectiles.push(new Projectile(
                        ship.x, ship.y, angle, 'enemy', 'bullet'
                    ));
                    this.playSound(600, 0.08, 'square'); // Enemy shoot sound
                }
            }
        });
    }
    
    handleCollisions() {
        // Projectile vs ship collisions
        this.projectiles.forEach(projectile => {
            if (projectile.owner === 'player') {
                this.enemyShips.forEach(ship => {
                    if (ship.hull > 0 && this.checkCollision(projectile, ship)) {
                        ship.takeDamage(projectile.damage);
                        this.createExplosion(ship.x, ship.y, 'small');
                        projectile.active = false;
                        
                        if (ship.hull <= 0) {
                            this.score += ship.scoreValue;
                            this.createExplosion(ship.x, ship.y, 'large');
                            this.playSound(200, 0.5, 'triangle'); // Explosion sound
                        }
                    }
                });
            } else {
                this.playerShips.forEach(ship => {
                    if (ship.hull > 0 && this.checkCollision(projectile, ship)) {
                        ship.takeDamage(projectile.damage);
                        this.createExplosion(ship.x, ship.y, 'small');
                        projectile.active = false;
                        
                        if (ship.hull <= 0) {
                            this.createExplosion(ship.x, ship.y, 'large');
                        }
                    }
                });
            }
        });
        
        // Ship vs ship collisions
        this.playerShips.forEach(playerShip => {
            this.enemyShips.forEach(enemyShip => {
                if (playerShip.hull > 0 && enemyShip.hull > 0 && 
                    this.checkCollision(playerShip, enemyShip)) {
                    playerShip.takeDamage(20);
                    enemyShip.takeDamage(20);
                    this.createExplosion(playerShip.x, playerShip.y, 'medium');
                    this.createExplosion(enemyShip.x, enemyShip.y, 'medium');
                }
            });
        });
    }
    
    checkCollision(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.radius + obj2.radius);
    }
    
    createExplosion(x, y, size) {
        this.explosions.push(new Explosion(x, y, size));
        
        // Create particles
        const particleCount = size === 'large' ? 15 : size === 'medium' ? 10 : 5;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(x, y));
        }
    }
    
    cleanup() {
        this.projectiles = this.projectiles.filter(p => p.active);
        this.explosions = this.explosions.filter(e => e.active);
        this.particles = this.particles.filter(p => p.active);
        this.enemyShips = this.enemyShips.filter(s => s.hull > 0);
    }
    
    checkGameState() {
        // Update player health
        const alivePlayerShips = this.playerShips.filter(s => s.hull > 0);
        if (alivePlayerShips.length > 0) {
            this.playerHull = Math.round(alivePlayerShips.reduce((sum, ship) => sum + ship.hull, 0) / alivePlayerShips.length);
        } else {
            this.playerHull = 0;
        }
        
        // Check lose condition
        if (this.playerHull <= 0) {
            this.gameOver(false);
            return;
        }
        
        // Check wave completion
        if (this.enemyShips.length === 0) {
            this.wave++;
            this.score += 1000 * this.wave;
            setTimeout(() => {
                this.spawnEnemyWave();
            }, 2000);
        }
        
        this.updateUI();
    }
    
    gameOver(victory) {
        this.gameState = 'gameOver';
        const gameOverScreen = document.getElementById('gameOver');
        const title = document.getElementById('gameOverTitle');
        const text = document.getElementById('gameOverText');
        
        if (victory) {
            title.textContent = 'VICTORY!';
            title.className = 'victory';
            text.textContent = 'You have proven your tactical superiority!';
        } else {
            title.textContent = 'DEFEAT!';
            title.className = 'defeat';
            text.textContent = 'Your fleet has been destroyed...';
        }
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalWave').textContent = this.wave - 1;
        gameOverScreen.style.display = 'flex';
    }
    
    updateUI() {
        document.getElementById('playerHull').textContent = this.playerHull;
        document.getElementById('playerShield').textContent = 100; // Placeholder
        document.getElementById('enemyCount').textContent = this.enemyShips.length;
        document.getElementById('score').textContent = this.score;
        document.getElementById('wave').textContent = this.wave;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw nebula background
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, this.canvas.width
        );
        gradient.addColorStop(0, 'rgba(64, 32, 128, 0.1)');
        gradient.addColorStop(0.5, 'rgba(32, 16, 64, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.stars.forEach(star => {
            this.ctx.globalAlpha = star.opacity;
            this.ctx.fillStyle = star.color;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw game objects
        this.particles.forEach(particle => particle.render(this.ctx));
        this.explosions.forEach(explosion => explosion.render(this.ctx));
        this.projectiles.forEach(projectile => projectile.render(this.ctx));
        this.playerShips.forEach(ship => ship.render(this.ctx, this.images));
        this.enemyShips.forEach(ship => ship.render(this.ctx, this.images));
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Ship class
class Ship {
    constructor(type, x, y, owner, isBoss = false) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.isBoss = isBoss;
        this.angle = 0;
        this.radius = isBoss ? 40 : 20;
        
        // Ship stats based on type
        this.setStats();
        
        this.maxHull = this.hull;
        this.scoreValue = isBoss ? 500 : 100;
    }
    
    setStats() {
        const stats = {
            'fighter': { hull: 60, speed: 4, damage: 15 },
            'frigate': { hull: 120, speed: 2, damage: 25 },
            'scout': { hull: 40, speed: 6, damage: 10 },
            'enemy-fighter': { hull: 40, speed: 3, damage: 12 },
            'enemy-bomber': { hull: 80, speed: 2, damage: 20 },
            'enemy-scout': { hull: 30, speed: 5, damage: 8 },
            'enemy-frigate': { hull: 100, speed: 2, damage: 18 },
            'enemy-battlecruiser': { hull: 200, speed: 1, damage: 35 },
            'enemy-dreadnought': { hull: 300, speed: 1, damage: 40 },
            'enemy-support': { hull: 150, speed: 2, damage: 15 },
            'enemy-torpedo': { hull: 60, speed: 3, damage: 30 }
        };
        
        const stat = stats[this.type] || { hull: 50, speed: 3, damage: 15 };
        this.hull = stat.hull * (this.isBoss ? 2 : 1);
        this.speed = stat.speed;
        this.damage = stat.damage;
    }
    
    update() {
        // Basic movement for enemy ships
        if (this.owner === 'enemy') {
            this.y += 0.5;
            this.x += Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.5;
        }
    }
    
    aiUpdate(playerShips, projectiles) {
        if (this.owner !== 'enemy' || this.hull <= 0) return;
        
        // Simple AI: move towards player ships
        const target = playerShips.find(ship => ship.hull > 0);
        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 100) {
                this.x += (dx / distance) * this.speed * 0.5;
                this.y += (dy / distance) * this.speed * 0.5;
            }
            
            this.angle = Math.atan2(dy, dx);
        }
    }
    
    takeDamage(damage) {
        this.hull = Math.max(0, this.hull - damage);
    }
    
    render(ctx, images) {
        if (this.hull <= 0) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);
        
        const image = images[this.type];
        if (image) {
            const size = this.isBoss ? 64 : 32;
            ctx.drawImage(image, -size/2, -size/2, size, size);
        } else {
            // Fallback rectangle
            ctx.fillStyle = this.owner === 'player' ? '#4444ff' : '#ff4444';
            ctx.fillRect(-this.radius/2, -this.radius/2, this.radius, this.radius);
        }
        
        ctx.restore();
        
        // Health bar
        if (this.hull < this.maxHull) {
            const barWidth = this.radius * 2;
            const barHeight = 4;
            const healthPercent = this.hull / this.maxHull;
            
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x - barWidth/2, this.y - this.radius - 10, barWidth, barHeight);
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x - barWidth/2, this.y - this.radius - 10, barWidth * healthPercent, barHeight);
        }
    }
}

// Projectile class
class Projectile {
    constructor(x, y, angle, owner, type) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.owner = owner;
        this.type = type;
        this.speed = type === 'ray' ? 12 : 8;
        this.damage = type === 'ray' ? 30 : 15;
        this.radius = type === 'ray' ? 8 : 4;
        this.active = true;
        this.life = type === 'ray' ? 60 : 120;
    }
    
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        this.life--;
        if (this.life <= 0 || this.x < 0 || this.x > window.innerWidth || 
            this.y < 0 || this.y > window.innerHeight) {
            this.active = false;
        }
    }
    
    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        if (this.type === 'ray') {
            ctx.fillStyle = this.owner === 'player' ? '#00ffff' : '#ff0000';
            ctx.fillRect(-this.radius, -2, this.radius * 2, 4);
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
        } else {
            ctx.fillStyle = this.owner === 'player' ? '#ffff00' : '#ff4444';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Explosion class
class Explosion {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.frame = 0;
        this.maxFrames = size === 'large' ? 20 : size === 'medium' ? 15 : 10;
        this.active = true;
    }
    
    update() {
        this.frame++;
        if (this.frame >= this.maxFrames) {
            this.active = false;
        }
    }
    
    render(ctx) {
        const progress = this.frame / this.maxFrames;
        const radius = (this.size === 'large' ? 40 : this.size === 'medium' ? 25 : 15) * progress;
        
        ctx.save();
        ctx.globalAlpha = 1 - progress;
        
        // Outer explosion
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner explosion
        ctx.fillStyle = '#ffff44';
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Particle class
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 30;
        this.maxLife = this.life;
        this.active = true;
        this.color = `hsl(${Math.random() * 60 + 15}, 100%, 50%)`;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life--;
        
        if (this.life <= 0) {
            this.active = false;
        }
    }
    
    render(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new FleetBattleGame();
});
