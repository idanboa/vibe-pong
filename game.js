// Vibe Pong - Neon Edition Game Engine

class VibePong {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.gameMode = 'score'; // score, time
        this.controlScheme = 'classic';
        this.playerMode = 'twoPlayer'; // twoPlayer, singlePlayer
        this.aiDifficulty = 'medium'; // easy, medium, hard
        
        // Canvas dimensions
        this.width = 1280;
        this.height = 768;
        
        // Game settings
        this.targetScore = 10;
        this.gameTime = 120; // 2 minutes in seconds
        this.currentTime = this.gameTime;
        
        // Colors (matching CSS variables)
        this.colors = {
            primary: '#00FFFF',
            secondary: '#FF0080',
            background: '#0A0A0F',
            accent: '#0066FF',
            white: '#FFFFFF'
        };
        
        // Initialize systems
        this.audioSystem = new AudioSystem();
        this.particleSystem = new ParticleSystem();
        this.ai = new AIOpponent();
        this.menuManager = new MenuManager(this);
        
        // Game objects
        this.paddle1 = new Paddle(50, this.height / 2 - 60, 15, 120, 8);
        this.paddle2 = new Paddle(this.width - 65, this.height / 2 - 60, 15, 120, 8);
        this.ball = new Ball(this.width / 2, this.height / 2, 8, 4);
        
        // Control schemes
        this.controls = {
            classic: {
                p1Up: 'KeyW', p1Down: 'KeyS',
                p2Up: 'ArrowUp', p2Down: 'ArrowDown'
            },
            spaced: {
                p1Up: 'KeyA', p1Down: 'KeyZ',
                p2Up: 'KeyK', p2Down: 'KeyM'
            },
            sameside: {
                p1Up: 'KeyQ', p1Down: 'KeyA',
                p2Up: 'KeyP', p2Down: 'KeyL'
            },
            arrows: {
                p1Up: 'ArrowUp', p1Down: 'ArrowDown',
                p2Up: null, p2Down: null
            },
            wasd: {
                p1Up: 'KeyW', p1Down: 'KeyS',
                p2Up: null, p2Down: null
            }
        };
        
        // Input state
        this.keys = {};
        
        // Animation
        this.lastTime = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showMenu();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyPress(e.code);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Prevent arrow keys from scrolling
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }
    
    updatePlayerTitles() {
        const player1Title = document.getElementById('player1Title');
        const player2Title = document.getElementById('player2Title');
        
        if (this.playerMode === 'singlePlayer') {
            player1Title.textContent = 'PLAYER';
            player2Title.textContent = `COMPUTER (${this.aiDifficulty.toUpperCase()})`;
        } else {
            player1Title.textContent = 'PLAYER 1';
            player2Title.textContent = 'PLAYER 2';
        }
    }
    
    handleKeyPress(keyCode) {
        if (this.gameState === 'playing') {
            if (keyCode === 'Space') {
                this.pauseGame();
            } else if (keyCode === 'KeyR') {
                this.resetGame();
            } else if (keyCode === 'Escape') {
                this.quitToMenu();
            }
        } else if (this.gameState === 'paused') {
            if (keyCode === 'Space') {
                this.resumeGame();
            } else if (keyCode === 'Escape') {
                this.quitToMenu();
            }
        }
    }
    
    showMenu() {
        this.gameState = 'menu';
        this.menuManager.showMenu();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('gameContainer').classList.remove('hidden');
        
        // Show/hide timer based on game mode
        const timer = document.getElementById('gameTimer');
        if (this.gameMode === 'time') {
            timer.classList.remove('hidden');
            this.currentTime = this.gameTime;
        } else {
            timer.classList.add('hidden');
        }
        
        this.resetGameObjects();
        this.updatePlayerTitles();
        this.ai.configure(this.aiDifficulty);
        this.gameLoop();
    }
    
    resetGameObjects() {
        // Reset paddles
        this.paddle1.reset(this.height / 2);
        this.paddle2.reset(this.height / 2);
        
        // Reset ball
        this.ball.reset(this.width / 2, this.height / 2, 4);
        
        // Update displays
        this.updateScore();
    }
    
    pauseGame() {
        this.gameState = 'paused';
        document.getElementById('pauseOverlay').classList.remove('hidden');
    }
    
    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pauseOverlay').classList.add('hidden');
        this.gameLoop();
    }
    
    resetGame() {
        this.resetGameObjects();
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.updatePaddles();
        this.updateBall(deltaTime);
        this.updateTimer(deltaTime);
        this.particleSystem.updateParticles();
        this.checkWinConditions();
    }
    
    updatePaddles() {
        const scheme = this.controls[this.controlScheme];
        
        // Player 1 controls (always human)
        if (this.keys[scheme.p1Up]) {
            this.paddle1.moveUp();
        }
        if (this.keys[scheme.p1Down]) {
            this.paddle1.moveDown(this.height);
        }
        
        // Player 2 controls (human or AI)
        if (this.playerMode === 'singlePlayer') {
            this.ai.update(this.ball, this.paddle2, this.height);
        } else {
            if (this.keys[scheme.p2Up]) {
                this.paddle2.moveUp();
            }
            if (this.keys[scheme.p2Down]) {
                this.paddle2.moveDown(this.height);
            }
        }
    }
    
    updateBall(deltaTime) {
        this.ball.update();
        
        // Top and bottom wall collision
        if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.height) {
            this.ball.bounceY();
            this.ball.y = Math.max(this.ball.radius, Math.min(this.height - this.ball.radius, this.ball.y));
            this.audioSystem.playSound('wallBounce');
            this.particleSystem.createParticles(this.ball.x, this.ball.y, this.colors.accent, 4);
        }
        
        // Paddle collisions
        this.ball.handlePaddleCollision(this.paddle1, this.colors, this.audioSystem, this.particleSystem);
        this.ball.handlePaddleCollision(this.paddle2, this.colors, this.audioSystem, this.particleSystem);
        
        // Score zones
        if (this.ball.x < 0) {
            this.paddle2.score++;
            this.updateScore();
            this.audioSystem.playSound('score');
            this.particleSystem.createParticles(this.ball.x, this.ball.y, this.colors.secondary, 12);
            this.ball.reset(this.width / 2, this.height / 2, 4);
        } else if (this.ball.x > this.width) {
            this.paddle1.score++;
            this.updateScore();
            this.audioSystem.playSound('score');
            this.particleSystem.createParticles(this.ball.x, this.ball.y, this.colors.primary, 12);
            this.ball.reset(this.width / 2, this.height / 2, 4);
        }
    }
    
    updateTimer(deltaTime) {
        if (this.gameMode === 'time') {
            this.currentTime -= deltaTime / 1000;
            if (this.currentTime <= 0) {
                this.currentTime = 0;
            }
            
            const minutes = Math.floor(this.currentTime / 60);
            const seconds = Math.floor(this.currentTime % 60);
            document.getElementById('gameTimer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    checkWinConditions() {
        let gameOver = false;
        let winner = null;
        let message = '';
        
        if (this.gameMode === 'score') {
            if (this.paddle1.score >= this.targetScore) {
                gameOver = true;
                winner = 'Player 1';
                message = `Player 1 wins ${this.paddle1.score}-${this.paddle2.score}!`;
            } else if (this.paddle2.score >= this.targetScore) {
                gameOver = true;
                winner = 'Player 2';
                message = `Player 2 wins ${this.paddle2.score}-${this.paddle1.score}!`;
            }
        } else if (this.gameMode === 'time' && this.currentTime <= 0) {
            gameOver = true;
            if (this.paddle1.score > this.paddle2.score) {
                winner = 'Player 1';
                message = `Player 1 wins ${this.paddle1.score}-${this.paddle2.score}!`;
            } else if (this.paddle2.score > this.paddle1.score) {
                winner = 'Player 2';
                message = `Player 2 wins ${this.paddle2.score}-${this.paddle1.score}!`;
            } else {
                winner = 'Tie';
                message = `It's a tie! ${this.paddle1.score}-${this.paddle2.score}`;
            }
        }
        
        if (gameOver) {
            this.gameOver(winner, message);
        }
    }
    
    gameOver(winner, message) {
        this.gameState = 'gameOver';
        document.getElementById('gameOverTitle').textContent = winner === 'Tie' ? 'TIE GAME!' : `${winner} WINS!`;
        document.getElementById('gameOverMessage').textContent = message;
        document.getElementById('gameOverOverlay').classList.remove('hidden');
        this.audioSystem.playSound('gameOver');
    }
    
    updateScore() {
        document.getElementById('player1Score').textContent = this.paddle1.score;
        document.getElementById('player2Score').textContent = this.paddle2.score;
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Setup glow effect
        this.ctx.shadowBlur = 20;
        
        // Draw center line
        this.ctx.strokeStyle = this.colors.accent;
        this.ctx.shadowColor = this.colors.accent;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 10]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw game objects
        this.ball.render(this.ctx, this.colors.white);
        this.paddle1.render(this.ctx, this.colors.primary);
        this.paddle2.render(this.ctx, this.colors.secondary);
        
        // Draw particles
        this.particleSystem.renderParticles(this.ctx);
        
        // Reset shadow for clean rendering
        this.ctx.shadowBlur = 0;
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    quitToMenu() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.showMenu();
    }
}

// Global function for menu button
function showMenu() {
    if (window.game) {
        window.game.showMenu();
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new VibePong();
}); 