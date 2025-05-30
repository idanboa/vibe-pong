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
        
        // Game objects
        this.paddle1 = {
            x: 50,
            y: this.height / 2 - 60,
            width: 15,
            height: 120,
            speed: 8,
            score: 0
        };
        
        this.paddle2 = {
            x: this.width - 65,
            y: this.height / 2 - 60,
            width: 15,
            height: 120,
            speed: 8,
            score: 0
        };
        
        this.ball = {
            x: this.width / 2,
            y: this.height / 2,
            radius: 8,
            vx: 5,
            vy: 3,
            speed: 4,
            maxSpeed: 15,
            trail: []
        };
        
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
        this.setupMenuHandlers();
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
    
    setupMenuHandlers() {
        // Player mode selection
        document.querySelectorAll('[data-player-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-player-mode]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.playerMode = e.target.dataset.playerMode;
                this.toggleMenuSections();
            });
        });

        // AI difficulty selection
        document.querySelectorAll('[data-ai-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-ai-difficulty]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.aiDifficulty = e.target.dataset.aiDifficulty;
            });
        });
        
        // Control scheme selection
        document.querySelectorAll('[data-controls]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-controls]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.controlScheme = e.target.dataset.controls;
                this.updateControlsDisplay();
            });
        });
        
        // Game mode selection
        document.querySelectorAll('[data-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.gameMode = e.target.dataset.mode;
            });
        });
        
        // Start game button
        document.getElementById('playBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Set defaults
        document.querySelector('[data-player-mode="twoPlayer"]').classList.add('selected');
        document.querySelector('[data-ai-difficulty="medium"]').classList.add('selected');
        document.querySelector('[data-controls="classic"]').classList.add('selected');
        document.querySelector('[data-mode="score"]').classList.add('selected');
    }
    
    toggleMenuSections() {
        const aiDifficultySection = document.getElementById('aiDifficultySection');
        const controlSchemeSection = document.getElementById('controlSchemeSection');
        
        if (this.playerMode === 'singlePlayer') {
            aiDifficultySection.style.display = 'block';
            controlSchemeSection.querySelector('h2').textContent = 'Player Controls';
        } else {
            aiDifficultySection.style.display = 'none';
            controlSchemeSection.querySelector('h2').textContent = 'Control Scheme';
        }
    }
    
    updateControlsDisplay() {
        const scheme = this.controls[this.controlScheme];
        const p1Display = document.getElementById('p1Controls');
        const p2Display = document.getElementById('p2Controls');
        
        const keyMap = {
            'KeyW': 'W', 'KeyS': 'S', 'KeyA': 'A', 'KeyZ': 'Z',
            'KeyQ': 'Q', 'KeyK': 'K', 'KeyM': 'M', 'KeyP': 'P', 'KeyL': 'L',
            'ArrowUp': '↑', 'ArrowDown': '↓'
        };
        
        p1Display.textContent = `${keyMap[scheme.p1Up]}/${keyMap[scheme.p1Down]}`;
        p2Display.textContent = `${keyMap[scheme.p2Up]}/${keyMap[scheme.p2Down]}`;
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
            }
        } else if (this.gameState === 'paused') {
            if (keyCode === 'Space') {
                this.resumeGame();
            }
        }
    }
    
    showMenu() {
        this.gameState = 'menu';
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('gameContainer').classList.add('hidden');
        document.getElementById('pauseOverlay').classList.add('hidden');
        document.getElementById('gameOverOverlay').classList.add('hidden');
        
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
        this.updateControlsDisplay();
        this.updatePlayerTitles();
        this.gameLoop();
    }
    
    resetGameObjects() {
        // Reset paddles
        this.paddle1.y = this.height / 2 - 60;
        this.paddle2.y = this.height / 2 - 60;
        this.paddle1.score = 0;
        this.paddle2.score = 0;
        
        // Reset ball
        this.resetBall();
        
        // Update displays
        this.updateScore();
    }
    
    resetBall() {
        this.ball.x = this.width / 2;
        this.ball.y = this.height / 2;
        this.ball.speed = 4;
        
        // Random direction
        const angle = (Math.random() - 0.5) * Math.PI / 3; // ±30 degrees
        const direction = Math.random() < 0.5 ? 1 : -1;
        
        this.ball.vx = Math.cos(angle) * this.ball.speed * direction;
        this.ball.vy = Math.sin(angle) * this.ball.speed;
        
        this.ball.trail = [];
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
        this.checkWinConditions();
    }
    
    updatePaddles() {
        const scheme = this.controls[this.controlScheme];
        
        // Player 1 controls
        if (this.keys[scheme.p1Up] && this.paddle1.y > 0) {
            this.paddle1.y -= this.paddle1.speed;
        }
        if (this.keys[scheme.p1Down] && this.paddle1.y < this.height - this.paddle1.height) {
            this.paddle1.y += this.paddle1.speed;
        }
        
        // Player 2 controls
        if (this.keys[scheme.p2Up] && this.paddle2.y > 0) {
            this.paddle2.y -= this.paddle2.speed;
        }
        if (this.keys[scheme.p2Down] && this.paddle2.y < this.height - this.paddle2.height) {
            this.paddle2.y += this.paddle2.speed;
        }
    }
    
    updateBall(deltaTime) {
        // Add current position to trail
        this.ball.trail.push({ x: this.ball.x, y: this.ball.y });
        if (this.ball.trail.length > 10) {
            this.ball.trail.shift();
        }
        
        // Move ball
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        
        // Top and bottom wall collision
        if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.height) {
            this.ball.vy = -this.ball.vy;
            this.ball.y = Math.max(this.ball.radius, Math.min(this.height - this.ball.radius, this.ball.y));
        }
        
        // Paddle collisions
        this.checkPaddleCollision(this.paddle1);
        this.checkPaddleCollision(this.paddle2);
        
        // Score zones
        if (this.ball.x < 0) {
            this.paddle2.score++;
            this.updateScore();
            this.resetBall();
        } else if (this.ball.x > this.width) {
            this.paddle1.score++;
            this.updateScore();
            this.resetBall();
        }
    }
    
    checkPaddleCollision(paddle) {
        if (this.ball.x - this.ball.radius < paddle.x + paddle.width &&
            this.ball.x + this.ball.radius > paddle.x &&
            this.ball.y - this.ball.radius < paddle.y + paddle.height &&
            this.ball.y + this.ball.radius > paddle.y) {
            
            // Calculate hit position on paddle (-1 to 1)
            const hitPos = ((this.ball.y - paddle.y) / paddle.height) * 2 - 1;
            
            // Calculate new angle based on hit position
            const maxAngle = Math.PI / 3; // 60 degrees
            const angle = hitPos * maxAngle;
            
            // Calculate new speed based on angle (steeper = faster)
            const speedMultiplier = 1 + Math.abs(hitPos) * 0.5;
            const newSpeed = Math.min(this.ball.speed * speedMultiplier, this.ball.maxSpeed);
            
            // Set new velocity
            const direction = paddle === this.paddle1 ? 1 : -1;
            this.ball.vx = Math.cos(angle) * newSpeed * direction;
            this.ball.vy = Math.sin(angle) * newSpeed;
            
            // Move ball away from paddle to prevent sticking
            if (paddle === this.paddle1) {
                this.ball.x = paddle.x + paddle.width + this.ball.radius;
            } else {
                this.ball.x = paddle.x - this.ball.radius;
            }
            
            // Increase ball speed slightly for rally progression
            this.ball.speed = Math.min(this.ball.speed + 0.2, this.ball.maxSpeed);
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
        
        // Draw ball trail
        this.drawBallTrail();
        
        // Draw ball
        this.drawBall();
        
        // Draw paddles
        this.drawPaddle(this.paddle1, this.colors.primary);
        this.drawPaddle(this.paddle2, this.colors.secondary);
        
        // Reset shadow for clean rendering
        this.ctx.shadowBlur = 0;
    }
    
    drawPaddle(paddle, color) {
        this.ctx.fillStyle = color;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 15;
        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    
    drawBall() {
        this.ctx.fillStyle = this.colors.white;
        this.ctx.shadowColor = this.colors.white;
        this.ctx.shadowBlur = 20;
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawBallTrail() {
        for (let i = 0; i < this.ball.trail.length; i++) {
            const alpha = (i + 1) / this.ball.trail.length * 0.5;
            const radius = this.ball.radius * alpha;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.shadowColor = this.colors.white;
            this.ctx.shadowBlur = 10 * alpha;
            this.ctx.beginPath();
            this.ctx.arc(this.ball.trail[i].x, this.ball.trail[i].y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
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