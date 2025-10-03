// Retro Future Website - Interactive Elements
// ES6 JavaScript for enhanced user experience

class RetroFutureWebsite {
    constructor() {
        this.spaceCanvas = null;
        this.spaceCtx = null;
        this.blueFleet = [];
        this.redFleet = [];
        this.projectiles = [];
        this.explosions = [];
        this.particles = [];
        this.images = {};
        this.lastUpdate = 0;
        
        // Game state
        this.selectedShipIndex = 0;
        this.lastShot = 0;
        this.shotCooldown = 200; // 0.2 second cooldown - very intense
        this.lastAIShot = 0;
        this.aiShotCooldown = 300; // 0.3 second AI cooldown - extremely intense
        
        // Input
        this.keys = {};
        this.lastKeyPress = 0;
        this.keyDelay = 200; // Prevent rapid key cycling
        
        this.init();
    }

    addCenterExoplanet() {
        const spaceBackground = document.querySelector('.space-background');
        if (!spaceBackground) return;
        // Avoid duplicates
        if (spaceBackground.querySelector('.exoplanet-center')) return;

        const element = document.createElement('div');
        element.className = 'space-object exoplanet-center';
        element.style.position = 'fixed';
        element.style.width = '140px';
        element.style.height = '140px';
        element.style.left = '50%';
        element.style.top = '50%';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.backgroundImage = 'url(exoplanet.gif)';
        element.style.backgroundSize = 'contain';
        element.style.backgroundRepeat = 'no-repeat';
        element.style.backgroundPosition = 'center';
        element.style.opacity = '0.8';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '2';

        spaceBackground.appendChild(element);
    }

    init() {
        this.setupEventListeners();
        this.setupTypingEffect();
        this.enhanceSpaceAnimations();
        this.initSpaceBattle();
        this.installPageShowReset();
        console.log('🚀 Welcome to the digital frontier, space cowboy...');
    }

    setupEventListeners() {
        // Contact button interactions
        const contactButtons = document.querySelectorAll('.contact-buttons .nes-btn');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleContactClick(e.target);
            });
            
            button.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });

        // Project item hover effects
        const projectItems = document.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.addGlitchEffect(item);
            });
            
            item.addEventListener('mouseleave', () => {
                this.removeGlitchEffect(item);
            });
        });

        // Smooth scrolling for better UX
        this.setupSmoothScrolling();

        // Blog button navigation with cinematic zoom
        const blogBtn = document.getElementById('blogButton');
        if (blogBtn) {
            blogBtn.addEventListener('click', (e) => {
                e.preventDefault();
                blogBtn.disabled = true;
                this.navigateToBlogWithZoom();
            });
        }
    }

    handleContactClick(button) {
        const buttonText = button.textContent.toLowerCase();
        
        switch(buttonText) {
            case 'email':
                this.showMessage('📧 Initiating quantum entanglement via email...');
                // In a real implementation, you'd open mailto: or show contact form
                break;
            case 'github':
                this.showMessage('🐙 Accessing the code repository matrix...');
                // window.open('https://github.com/yourusername', '_blank');
                break;
            case 'linkedin':
                this.showMessage('💼 Connecting to professional network grid...');
                // window.open('https://linkedin.com/in/yourprofile', '_blank');
                break;
        }
    }

    showMessage(message) {
        // Create a temporary message overlay
        const messageDiv = document.createElement('div');
        messageDiv.className = 'nes-container is-dark message-overlay';
        messageDiv.innerHTML = `<p>${message}</p>`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1000;
            padding: 20px;
            text-align: center;
            animation: fadeInOut 3s ease-in-out;
        `;

        document.body.appendChild(messageDiv);

        // Remove message after animation
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 3000);
    }

    addGlitchEffect(element) {
        element.style.animation = 'glitch 0.3s ease-in-out infinite';
    }

    removeGlitchEffect(element) {
        element.style.animation = '';
    }

    playHoverSound() {
        // In a real implementation, you could add retro sound effects
        // For now, we'll just add a visual feedback
        console.log('🔊 *retro beep sound*');
    }

    enhanceSpaceAnimations() {
        // Add rotating galaxy GIF to background
        this.addRotatingGalaxy();
        
        // Add all the new animated space objects
        this.addAnimatedSpaceObjects();
        // Add permanent centered exoplanet target
        this.addCenterExoplanet();
        
        // Add random delays to spaceships for more natural movement
        const spaceships = document.querySelectorAll('.spaceship');
        spaceships.forEach((ship, index) => {
            const randomDelay = Math.random() * 5;
            ship.style.animationDelay = `-${randomDelay}s`;
        });

        // Add click effects to galaxies
        const galaxies = document.querySelectorAll('.galaxy');
        galaxies.forEach(galaxy => {
            galaxy.addEventListener('click', () => {
                galaxy.style.animation = 'rotate 2s linear, pulse 1s ease-in-out';
                setTimeout(() => {
                    galaxy.style.animation = '';
                }, 2000);
            });
        });
    }

    addRotatingGalaxy() {
        // Create galaxy element using the GIF
        const galaxy = document.createElement('div');
        galaxy.className = 'rotating-galaxy';
        galaxy.style.position = 'fixed';
        galaxy.style.top = '20%';
        galaxy.style.right = '15%';
        galaxy.style.width = '300px';
        galaxy.style.height = '300px';
        galaxy.style.backgroundImage = 'url(2713614202.gif)';
        galaxy.style.backgroundSize = 'contain';
        galaxy.style.backgroundRepeat = 'no-repeat';
        galaxy.style.backgroundPosition = 'center';
        galaxy.style.opacity = '0.7';
        galaxy.style.pointerEvents = 'none';
        galaxy.style.zIndex = '0'; // Behind the space canvas
        
        // Add to space background
        const spaceBackground = document.querySelector('.space-background');
        if (spaceBackground) {
            spaceBackground.appendChild(galaxy);
        }
    }

    addAnimatedSpaceObjects() {
        const spaceBackground = document.querySelector('.space-background');
        if (!spaceBackground) return;

        // Define space objects with their properties
        const spaceObjects = [
            {
                name: 'earth',
                src: 'earth.gif',
                size: '110px',
                top: '10%',
                left: '22%',
                opacity: '0.8'
            },
            {
                name: 'exoplanet',
                src: 'bigplanet.gif',
                size: '1000px',
                bottom: '-500px',
                left: '-300px',
                opacity: '0.85'
            },
            {
                name: 'black-hole',
                src: 'black_hole.gif',
                size: '150px',
                top: '40%',
                right: '8%',
                opacity: '0.6'
            },
            {
                name: 'gas-giant-1',
                src: 'gasgiant1.gif',
                size: '140px',
                top: '70%',
                right: '25%',
                opacity: '0.75'
            },
            {
                name: 'gas-giant-2',
                src: 'gasgiant2.gif',
                size: '120px',
                top: '18%',
                right: '15%',
                opacity: '0.7'
            },
            {
                name: 'asteroids',
                src: 'asteroids.png',
                size: '90px',
                top: '78%',
                left: '55%',
                opacity: '0.6'
            }
        ];

        // Create each space object
        spaceObjects.forEach(obj => {
            const element = document.createElement('div');
            element.className = `space-object ${obj.name}`;
            element.style.position = 'fixed';
            element.style.width = obj.size;
            element.style.height = obj.size;
            element.style.backgroundImage = `url(${obj.src})`;
            element.style.backgroundSize = 'contain';
            element.style.backgroundRepeat = 'no-repeat';
            element.style.backgroundPosition = 'center';
            element.style.opacity = obj.opacity;
            element.style.pointerEvents = 'none';
            element.style.zIndex = '0'; // Behind the space canvas
            
            // Set position
            if (obj.top) element.style.top = obj.top;
            if (obj.bottom) element.style.bottom = obj.bottom;
            if (obj.left) element.style.left = obj.left;
            if (obj.right) element.style.right = obj.right;
            
            // Add hover effects for interactivity
            if (obj.name !== 'exoplanet') {
                element.style.pointerEvents = 'auto';
                element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                element.style.cursor = 'pointer';
                element.addEventListener('mouseenter', () => {
                    element.style.transform = 'scale(1.1)';
                    element.style.opacity = '1';
                });
                element.addEventListener('mouseleave', () => {
                    element.style.transform = 'scale(1)';
                    element.style.opacity = obj.opacity;
                });
            }
            
            spaceBackground.appendChild(element);
        });
    }

    setupTypingEffect() {
        // Add typing effect to the main title
        const title = document.querySelector('header h1');
        if (title) {
            const originalText = title.textContent;
            title.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < originalText.length) {
                    title.textContent += originalText.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Add blinking cursor effect
                    title.innerHTML += '<span class="cursor">|</span>';
                }
            };
            
            // Start typing effect after a short delay
            setTimeout(typeWriter, 1000);
        }
    }

    setupSmoothScrolling() {
        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    navigateToBlogWithZoom() {
        // Fade out UI, then slow zoom to center planet, then navigate
        const uiSelectors = ['.main-container', '#gameUI', '.game-controls'];
        const fadeDuration = 900;
        uiSelectors.forEach(sel => {
            const el = document.querySelector(sel);
            if (el) {
                el.style.transition = `opacity ${fadeDuration}ms ease`;
                el.style.opacity = '0';
            }
        });

        setTimeout(() => {
            this.startCenterZoom(() => {
                window.location.href = 'blog/index.html';
            });
        }, fadeDuration);
    }

    startHyperspace(onComplete, duration = 900) {
        // Inject hyperspace CSS if needed
        if (!document.getElementById('hyperspace-style')) {
            const hsStyle = document.createElement('style');
            hsStyle.id = 'hyperspace-style';
            hsStyle.textContent = `
                .hyperspace-overlay { position: fixed; inset: 0; z-index: 10000; pointer-events: none; overflow: hidden; }
                .hyperspace-flash { position:absolute; inset:0; background:#fff; opacity:0; animation: hs-flash ${duration}ms ease forwards; }
                .hyperspace-streaks { position:absolute; inset:-50% 0 -50% 0; background: repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0px, rgba(255,255,255,0.0) 6px, rgba(255,255,255,0.9) 7px, rgba(255,255,255,0.0) 10px); filter: blur(1px) brightness(1.2); transform: perspective(600px) rotateX(10deg) translateZ(0); opacity:0.85; animation: hs-warp ${duration}ms cubic-bezier(0.16,1,0.3,1) forwards; }
                .hyperspace-vignette { position:absolute; inset:0; background: radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%); opacity:0; animation: hs-vig ${duration}ms ease forwards; }
                @keyframes hs-flash { 0%{opacity:0;} 10%{opacity:1;} 30%{opacity:0.2;} 100%{opacity:0.9;} }
                @keyframes hs-warp { 0%{opacity:0; transform: translateZ(0) skewX(0deg);} 10%{opacity:0.9;} 100%{opacity:1; transform: translateX(-2000px) skewX(-25deg);} }
                @keyframes hs-vig { 0%{opacity:0;} 100%{opacity:1;} }
            `;
            document.head.appendChild(hsStyle);
        }

        const overlay = document.createElement('div');
        overlay.className = 'hyperspace-overlay';
        const flash = document.createElement('div');
        flash.className = 'hyperspace-flash';
        const streaks = document.createElement('div');
        streaks.className = 'hyperspace-streaks';
        const vig = document.createElement('div');
        vig.className = 'hyperspace-vignette';
        overlay.appendChild(streaks);
        overlay.appendChild(vig);
        overlay.appendChild(flash);
        document.body.appendChild(overlay);

        // Cleanup after duration in case of SPA-like return
        setTimeout(() => {
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            onComplete && onComplete();
        }, duration);
    }

    startCenterZoom(onComplete, duration = 1600) {
        const spaceBg = document.querySelector('.space-background');
        // Subtle dark overlay during zoom
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0,0,0,0)';
        overlay.style.transition = `background ${duration}ms ease`;
        overlay.style.zIndex = '9998';
        overlay.style.pointerEvents = 'none';
        document.body.appendChild(overlay);

        if (!spaceBg) {
            // Fallback to simple fade
            void overlay.offsetHeight;
            overlay.style.background = 'rgba(0,0,0,1)';
            setTimeout(() => onComplete && onComplete(), duration);
            return;
        }

        // Raise background above content so zoom is visible
        spaceBg.dataset.prevZ = spaceBg.style.zIndex || '';
        spaceBg.style.zIndex = '5';
        spaceBg.style.willChange = 'transform';
        spaceBg.style.transformOrigin = '50% 50%';
        spaceBg.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;

        // Trigger transitions
        void spaceBg.offsetHeight;
        overlay.style.background = 'rgba(0,0,0,0.5)';
        spaceBg.style.transform = 'scale(8)';

        setTimeout(() => {
            onComplete && onComplete();
        }, duration + 40);
    }

    installPageShowReset() {
        const reset = () => {
            const spaceBg = document.querySelector('.space-background');
            if (spaceBg) {
                spaceBg.style.transform = '';
                spaceBg.style.transition = '';
                spaceBg.style.willChange = '';
                // restore z-index if it was elevated
                if (spaceBg.dataset && 'prevZ' in spaceBg.dataset) {
                    spaceBg.style.zIndex = spaceBg.dataset.prevZ;
                    delete spaceBg.dataset.prevZ;
                } else {
                    // default from CSS
                    spaceBg.style.zIndex = '-1';
                }
            }
            ['.main-container', '#gameUI', '.game-controls'].forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    el.style.opacity = '';
                    el.style.transition = '';
                }
            });
        };
        window.addEventListener('pageshow', reset);
    }

    async initSpaceBattle() {
        this.spaceCanvas = document.getElementById('spaceCanvas');
        if (!this.spaceCanvas) return;

        this.spaceCtx = this.spaceCanvas.getContext('2d');
        this.spaceCanvas.width = window.innerWidth;
        this.spaceCanvas.height = window.innerHeight;

        // Load spaceship images
        await this.loadSpaceAssets();
        
        // Setup input handlers
        this.setupGameInput();
        
        // Create initial fleets
        this.createFleets();
        
        // Start animation loop
        this.animateSpaceBattle();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.spaceCanvas.width = window.innerWidth;
            this.spaceCanvas.height = window.innerHeight;
        });
    }

    async loadSpaceAssets() {
        const assetPaths = {
            // Player ships - now from main folder
            'player-fighter': 'Kla\'ed - Fighter - Base.png',
            'player-frigate': 'Kla\'ed - Frigate - Base.png',
            'player-scout': 'Kla\'ed - Scout - Base.png',
            'player-battlecruiser': 'Kla\'ed - Battlecruiser - Base.png',
            'player-bomber': 'Kla\'ed - Bomber - Base.png',
            'player-dreadnought': 'Kla\'ed - Dreadnought - Base.png',
            'player-support': 'Kla\'ed - Support ship - Base.png',
            'player-torpedo': 'Kla\'ed - Torpedo Ship - Base.png',
            // Enemy ships - same assets, different faction
            'enemy-fighter': 'Kla\'ed - Fighter - Base.png',
            'enemy-bomber': 'Kla\'ed - Bomber - Base.png',
            'enemy-scout': 'Kla\'ed - Scout - Base.png',
            'enemy-frigate': 'Kla\'ed - Frigate - Base.png',
            'enemy-battlecruiser': 'Kla\'ed - Battlecruiser - Base.png',
            'enemy-dreadnought': 'Kla\'ed - Dreadnought - Base.png',
            'enemy-support': 'Kla\'ed - Support ship - Base.png',
            'enemy-torpedo': 'Kla\'ed - Torpedo Ship - Base.png'
        };

        const loadPromises = Object.entries(assetPaths).map(([key, path]) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.images[key] = img;
                    resolve();
                };
                img.onerror = () => {
                    // Create colored placeholder
                    const canvas = document.createElement('canvas');
                    canvas.width = 64;
                    canvas.height = 64;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = key.includes('enemy') ? '#ff4444' : '#4444ff';
                    ctx.fillRect(0, 0, 64, 64);
                    this.images[key] = canvas;
                    resolve();
                };
                img.src = path;
            });
        });

        await Promise.all(loadPromises);
    }

    setupGameInput() {
        // Keyboard input
        window.addEventListener('keydown', (e) => {
            const now = Date.now();
            if (now - this.lastKeyPress < this.keyDelay) return;
            
            if (e.code === 'KeyW') {
                e.preventDefault();
                this.cycleShip(-1);
                this.lastKeyPress = now;
            } else if (e.code === 'KeyS') {
                e.preventDefault();
                this.cycleShip(1);
                this.lastKeyPress = now;
            } else if (e.code === 'Space') {
                e.preventDefault();
                this.shootMissile();
            }
        });
    }
    createFleets() {
        this.blueFleet = [];
        this.redFleet = [];
        
        // All available ship types for both fleets
        const allShipTypes = [
            'fighter', 'bomber', 'scout', 'frigate', 
            'battlecruiser', 'dreadnought', 'support', 'torpedo'
        ];
        
        // Ship categories for tactical formations
        const capitalShips = ['dreadnought', 'battlecruiser'];
        const mediumShips = ['frigate', 'bomber', 'support'];
        const smallShips = ['fighter', 'scout', 'torpedo'];
        
        // Create blue fleet (left side) with natural tactical formations - much closer to UI
        this.createTacticalFleet('player', 200, 'blue');
        
        // Create red fleet (right side) with natural tactical formations - much closer to UI
        this.createTacticalFleet('enemy', this.spaceCanvas.width - 200, 'red');
        
        this.updateUI();
    }
    
    createTacticalFleet(prefix, baseX, faction) {
        const fleet = faction === 'blue' ? this.blueFleet : this.redFleet;
        const screenHeight = this.spaceCanvas.height;
        const usableHeight = screenHeight - 50; // Leave margins
        
        if (faction === 'blue') {
            // Blue Fleet: Defensive Formation - Tight Groups
            
            // Formation 1: Command cluster (top)
            fleet.push(new FleetShip(`${prefix}-dreadnought`, baseX + 20, 70, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-support`, baseX - 30, 90, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-fighter`, baseX + 70, 50, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-scout`, baseX - 10, 130, faction, fleet.length));
            
            // Formation 2: Heavy battle line (upper middle)
            const midY1 = usableHeight * 0.25;
            fleet.push(new FleetShip(`${prefix}-battlecruiser`, baseX, midY1, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-frigate`, baseX - 80, midY1 + 20, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-frigate`, baseX + 60, midY1 + 30, faction, fleet.length));
            
            // Formation 3: Lone wolf patrol (middle)
            const midY2 = usableHeight * 0.45;
            fleet.push(new FleetShip(`${prefix}-torpedo`, baseX + 40, midY2, faction, fleet.length));
            
            // Formation 4: Fighter screen (lower middle)
            const midY3 = usableHeight * 0.65;
            fleet.push(new FleetShip(`${prefix}-fighter`, baseX - 50, midY3, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-fighter`, baseX + 10, midY3 - 25, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-scout`, baseX - 20, midY3 + 40, faction, fleet.length));
            
            // Formation 5: Support wing (bottom)
            const bottomY = usableHeight * 0.8;
            fleet.push(new FleetShip(`${prefix}-bomber`, baseX + 30, bottomY, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-support`, baseX - 40, bottomY + 30, faction, fleet.length));
            
            // Formation 6: Rear scouts (very bottom)
            const veryBottomY = usableHeight * 0.95;
            fleet.push(new FleetShip(`${prefix}-scout`, baseX, veryBottomY, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-torpedo`, baseX + 80, veryBottomY - 20, faction, fleet.length));
            
        } else {
            // Red Fleet: Aggressive Formation - Spread Out & Individual Ships
            
            // Formation 1: Forward spearhead (top)
            fleet.push(new FleetShip(`${prefix}-battlecruiser`, baseX - 40, 60, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-torpedo`, baseX + 30, 80, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-fighter`, baseX - 90, 100, faction, fleet.length));
            
            // Formation 2: Lone hunter (upper middle)
            const midY1 = usableHeight * 0.2;
            fleet.push(new FleetShip(`${prefix}-scout`, baseX + 60, midY1, faction, fleet.length));
            
            // Formation 3: Heavy assault group (middle)
            const midY2 = usableHeight * 0.4;
            fleet.push(new FleetShip(`${prefix}-dreadnought`, baseX, midY2, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-bomber`, baseX - 70, midY2 - 30, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-frigate`, baseX + 50, midY2 + 40, faction, fleet.length));
            
            // Formation 4: Scattered raiders (lower middle)
            const midY3 = usableHeight * 0.6;
            fleet.push(new FleetShip(`${prefix}-torpedo`, baseX - 30, midY3, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-fighter`, baseX + 80, midY3 - 40, faction, fleet.length));
            
            // Formation 5: Support cluster (bottom)
            const bottomY = usableHeight * 0.75;
            fleet.push(new FleetShip(`${prefix}-support`, baseX - 20, bottomY, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-frigate`, baseX - 60, bottomY + 35, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-scout`, baseX + 40, bottomY + 20, faction, fleet.length));
            
            // Formation 6: Rear interceptors (very bottom)
            const veryBottomY = usableHeight * 0.9;
            fleet.push(new FleetShip(`${prefix}-fighter`, baseX + 20, veryBottomY, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-bomber`, baseX - 80, veryBottomY - 15, faction, fleet.length));
            fleet.push(new FleetShip(`${prefix}-scout`, baseX + 70, veryBottomY + 25, faction, fleet.length));
        }
    }
    
    cycleShip(direction) {
        const aliveBlueShips = this.blueFleet.filter(ship => ship.alive);
        if (aliveBlueShips.length === 0) return;
        
        this.selectedShipIndex = (this.selectedShipIndex + direction + aliveBlueShips.length) % aliveBlueShips.length;
    }
    
    shootMissile() {
        const now = Date.now();
        if (now - this.lastShot < this.shotCooldown) return;
        
        const aliveBlueShips = this.blueFleet.filter(ship => ship.alive);
        if (aliveBlueShips.length === 0) return;
        
        const selectedShip = aliveBlueShips[this.selectedShipIndex];
        if (!selectedShip) return;
        
        // Find closest red ship as target
        const aliveRedShips = this.redFleet.filter(ship => ship.alive);
        if (aliveRedShips.length === 0) return;
        
        let closestTarget = aliveRedShips[0];
        let closestDistance = this.getDistance(selectedShip, closestTarget);
        
        aliveRedShips.forEach(ship => {
            const distance = this.getDistance(selectedShip, ship);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = ship;
            }
        });
        
        const angle = Math.atan2(closestTarget.y - selectedShip.y, closestTarget.x - selectedShip.x);
        this.projectiles.push(new FleetProjectile(
            selectedShip.x, selectedShip.y, angle, 'blue', selectedShip.bulletType
        ));
        
        this.lastShot = now;
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.shotCooldown) return;
        
        this.lastShot = now;
        
        this.playerShips.forEach(ship => {
            if (ship.hull > 0) {
                const angle = Math.atan2(this.mouse.y - ship.y, this.mouse.x - ship.x);
                this.projectiles.push(new GameProjectile(
                    ship.x, ship.y, angle, 'player', 'bullet'
                ));
            }
        });
    }
    
    specialAttack() {
        this.playerShips.forEach(ship => {
            if (ship.hull > 0) {
                const angle = Math.atan2(this.mouse.y - ship.y, this.mouse.x - ship.x);
                this.projectiles.push(new GameProjectile(
                    ship.x, ship.y, angle, 'player', 'ray'
                ));
            }
        });
    }

    animateSpaceBattle() {
        // Clear canvas completely
        this.spaceCtx.clearRect(0, 0, this.spaceCanvas.width, this.spaceCanvas.height);

        // Update ships with floating animation
        this.blueFleet.forEach(ship => ship.update());
        this.redFleet.forEach(ship => ship.update());
        
        // Update projectiles
        this.projectiles.forEach(projectile => projectile.update());
        
        // Update explosions
        this.explosions.forEach(explosion => explosion.update());
        
        // Update particles
        this.particles.forEach(particle => particle.update());
        
        // Handle collisions
        this.handleCollisions();
        
        // Clean up
        this.cleanup();
        
        // AI attacks
        this.handleAI();
        
        // Render everything
        this.render();

        requestAnimationFrame(() => this.animateSpaceBattle());
    }
    
    getDistance(ship1, ship2) {
        const dx = ship1.x - ship2.x;
        const dy = ship1.y - ship2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    handleAI() {
        const now = Date.now();
        if (now - this.lastAIShot < this.aiShotCooldown) return;
        
        // Random AI shooting from both fleets
        const allShips = [...this.blueFleet, ...this.redFleet].filter(ship => ship.alive);
        
        if (Math.random() < 0.3 && allShips.length > 0) {
            const shooter = allShips[Math.floor(Math.random() * allShips.length)];
            const enemyFleet = shooter.faction === 'blue' ? this.redFleet : this.blueFleet;
            const targets = enemyFleet.filter(ship => ship.alive);
            
            if (targets.length > 0) {
                const target = targets[Math.floor(Math.random() * targets.length)];
                const angle = Math.atan2(target.y - shooter.y, target.x - shooter.x);
                
                this.projectiles.push(new FleetProjectile(
                    shooter.x, shooter.y, angle, shooter.faction, shooter.bulletType
                ));
                
                this.lastAIShot = now;
            }
        }
    }
    
    handleCollisions() {
        this.projectiles.forEach(projectile => {
            const targetFleet = projectile.faction === 'blue' ? this.redFleet : this.blueFleet;
            
            targetFleet.forEach(ship => {
                if (ship.alive && this.checkCollision(projectile, ship)) {
                    // Always create a hit explosion
                    this.createExplosion(ship.x, ship.y, 'small');
                    projectile.active = false;
                    
                    // 20% chance to destroy the ship
                    if (Math.random() < 0.2) {
                        ship.destroy();
                        this.createExplosion(ship.x, ship.y, 'large');
                    }
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
        this.explosions.push(new GameExplosion(x, y, size));
        
        const particleCount = size === 'large' ? 15 : 5;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new GameParticle(x, y));
        }
    }
    
    cleanup() {
        this.projectiles = this.projectiles.filter(p => p.active);
        this.explosions = this.explosions.filter(e => e.active);
        this.particles = this.particles.filter(p => p.active);
    }
    
    render() {
        // Render particles and explosions first
        this.particles.forEach(particle => particle.render(this.spaceCtx));
        this.explosions.forEach(explosion => explosion.render(this.spaceCtx));
        
        // Render projectiles
        this.projectiles.forEach(projectile => projectile.render(this.spaceCtx));
        
        // Render fleets
        const aliveBlueShips = this.blueFleet.filter(s => s.alive);
        this.blueFleet.forEach((ship, index) => {
            const isSelected = aliveBlueShips.indexOf(ship) === this.selectedShipIndex;
            ship.render(this.spaceCtx, this.images, isSelected);
        });
        
        this.redFleet.forEach(ship => {
            ship.render(this.spaceCtx, this.images, false);
        });
    }
    
    updateUI() {
        const aliveBlue = this.blueFleet.filter(s => s.alive).length;
        const aliveRed = this.redFleet.filter(s => s.alive).length;
        const selectedShip = this.blueFleet.filter(s => s.alive)[this.selectedShipIndex];
        
        document.getElementById('gameScore').textContent = `Blue: ${aliveBlue} | Red: ${aliveRed}`;
        document.getElementById('gameWave').textContent = selectedShip ? selectedShip.type.split('-')[1] : 'None';
        document.getElementById('gameHull').textContent = selectedShip ? 'ACTIVE' : 'NONE';
    }

}

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes glitch {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
    }
    
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    .cursor {
        animation: blink 1s infinite;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RetroFutureWebsite();
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.length === konamiSequence.length && 
        konamiCode.every((code, index) => code === konamiSequence[index])) {
        
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s ease-in-out infinite';
        console.log('🌈 KONAMI CODE ACTIVATED! You are truly a space cowboy!');
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
    }
});

// Rainbow animation for easter egg
const rainbowStyle = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;

const rainbowStyleSheet = document.createElement('style');
rainbowStyleSheet.textContent = rainbowStyle;
document.head.appendChild(rainbowStyleSheet);

// Fleet Battle Classes
class FleetShip {
    constructor(type, x, y, faction, id) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.faction = faction; // 'blue' or 'red'
        this.id = id;
        
        // Fix ship orientations - blue faces right, red faces left
        this.angle = faction === 'blue' ? Math.PI / 2 : -Math.PI / 2;
        this.radius = 40;
        this.size = 80; // Much bigger ships to match background style
        
        // Ship type specific stats
        this.setShipStats();
        this.maxHull = this.hull;
    }
    
    setShipStats() {
        const shipStats = {
            // Player ships - all types available
            'player-fighter': { fireRate: 0.8, bulletType: 'laser', size: 70 },
            'player-frigate': { fireRate: 0.4, bulletType: 'plasma', size: 85 },
            'player-scout': { fireRate: 1.2, bulletType: 'rapid', size: 65 },
            'player-battlecruiser': { fireRate: 0.2, bulletType: 'heavy', size: 100 },
            'player-bomber': { fireRate: 0.3, bulletType: 'missile', size: 80 },
            'player-dreadnought': { fireRate: 0.15, bulletType: 'heavy', size: 120 },
            'player-support': { fireRate: 0.6, bulletType: 'plasma', size: 75 },
            'player-torpedo': { fireRate: 0.4, bulletType: 'missile', size: 70 },
            // Enemy ships - same stats but enemy faction
            'enemy-fighter': { fireRate: 0.7, bulletType: 'laser', size: 70 },
            'enemy-bomber': { fireRate: 0.3, bulletType: 'missile', size: 80 },
            'enemy-scout': { fireRate: 1.0, bulletType: 'rapid', size: 65 },
            'enemy-frigate': { fireRate: 0.5, bulletType: 'plasma', size: 85 },
            'enemy-battlecruiser': { fireRate: 0.2, bulletType: 'heavy', size: 100 },
            'enemy-dreadnought': { fireRate: 0.15, bulletType: 'heavy', size: 120 },
            'enemy-support': { fireRate: 0.6, bulletType: 'plasma', size: 75 },
            'enemy-torpedo': { fireRate: 0.4, bulletType: 'missile', size: 70 }
        };
        
        const stats = shipStats[this.type] || { fireRate: 0.5, bulletType: 'laser', size: 80 };
        this.fireRate = stats.fireRate;
        this.bulletType = stats.bulletType;
        this.size = stats.size; // Variable ship sizes based on type
        this.alive = true; // Simple alive/dead state
    }
    
    update() {
        // Ships are now stationary - no floating animation
        // Only slight idle rotation
        this.angle += Math.sin(Date.now() * 0.0005) * 0.005;
    }
    
    destroy() {
        this.alive = false;
    }
    
    render(ctx, images, isSelected = false) {
        if (!this.alive) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Subtle selection highlight - just a slight glow increase
        if (isSelected) {
            ctx.shadowBlur = 25;
            ctx.shadowColor = this.faction === 'blue' ? '#6666ff' : '#ff6666';
        } else {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.faction === 'blue' ? '#4444ff' : '#ff4444';
        }
        
        const image = images[this.type];
        if (image) {
            ctx.drawImage(image, -this.size/2, -this.size/2, this.size, this.size);
        } else {
            ctx.fillStyle = this.faction === 'blue' ? '#4444ff' : '#ff4444';
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        }
        
        ctx.restore();
    }
}

class FleetProjectile {
    constructor(x, y, angle, faction, bulletType = 'laser') {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.faction = faction;
        this.bulletType = bulletType;
        this.active = true;
        
        // Set bullet properties based on type
        this.setBulletProperties();
        this.maxLife = this.life;
    }
    
    setBulletProperties() {
        const bulletProps = {
            'laser': { speed: 15, radius: 3, life: 300, damage: 15, color: '#00ffff' },
            'plasma': { speed: 12, radius: 6, life: 350, damage: 25, color: '#ff00ff' },
            'rapid': { speed: 18, radius: 2, life: 250, damage: 10, color: '#ffff00' },
            'missile': { speed: 10, radius: 8, life: 400, damage: 30, color: '#ff4400' },
            'heavy': { speed: 8, radius: 10, life: 450, damage: 40, color: '#ff0000' }
        };
        
        const props = bulletProps[this.bulletType] || bulletProps['laser'];
        this.speed = props.speed;
        this.radius = props.radius;
        this.life = props.life; // Much longer life so bullets can cross the screen
        this.damage = props.damage;
        this.color = props.color;
        this.trail = []; // Add trail effect for cooler animation
    }
    
    update() {
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) {
            this.trail.shift(); // Keep trail length manageable
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        this.life--;
        if (this.life <= 0 || this.x < -50 || this.x > window.innerWidth + 50 || 
            this.y < -50 || this.y > window.innerHeight + 50) {
            this.active = false;
        }
    }
    
    render(ctx) {
        const alpha = Math.min(1, this.life / (this.maxLife * 0.1)); // Much slower fade
        
        // Draw trail first
        this.trail.forEach((point, index) => {
            const trailAlpha = (index / this.trail.length) * alpha * 0.5;
            ctx.save();
            ctx.globalAlpha = trailAlpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Enhanced rendering with pulsing effects
        const pulse = 1 + Math.sin(Date.now() * 0.01) * 0.2;
        
        switch(this.bulletType) {
            case 'laser':
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15 * pulse;
                ctx.shadowColor = this.color;
                ctx.fillRect(-8, -1, 16, 2);
                // Add core
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-6, -0.5, 12, 1);
                break;
                
            case 'plasma':
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 20 * pulse;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, this.radius * pulse, 0, Math.PI * 2);
                ctx.fill();
                // Add inner glow
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'rapid':
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8 * pulse;
                ctx.shadowColor = this.color;
                ctx.fillRect(-6, -0.5, 12, 1);
                break;
                
            case 'missile':
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15 * pulse;
                ctx.shadowColor = this.color;
                ctx.fillRect(-12, -2, 24, 4);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(10, -1, 4, 2);
                // Add exhaust
                ctx.fillStyle = '#ffaa00';
                ctx.fillRect(-15, -1, 6, 2);
                break;
                
            case 'heavy':
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 25 * pulse;
                ctx.shadowColor = this.color;
                ctx.fillRect(-15, -3, 30, 6);
                ctx.fillStyle = '#ffff00';
                ctx.fillRect(-12, -2, 24, 4);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-8, -1, 16, 2);
                break;
        }
        
        ctx.restore();
    }
}

class GameExplosion {
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
        
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffff44';
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class GameParticle {
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
