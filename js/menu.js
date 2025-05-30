// Menu Manager for Vibe Pong

class MenuManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.setupMenuHandlers();
    }
    
    setupMenuHandlers() {
        // Player mode selection
        document.querySelectorAll('[data-player-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.game.audioSystem.playSound('menuClick');
                document.querySelectorAll('[data-player-mode]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.game.playerMode = e.target.dataset.playerMode;
                this.toggleMenuSections();
            });
        });

        // AI difficulty selection
        document.querySelectorAll('[data-ai-difficulty]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.game.audioSystem.playSound('menuClick');
                document.querySelectorAll('[data-ai-difficulty]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.game.aiDifficulty = e.target.dataset.aiDifficulty;
            });
        });
        
        // Control scheme selection
        document.querySelectorAll('[data-controls]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.game.audioSystem.playSound('menuClick');
                document.querySelectorAll('[data-controls]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.game.controlScheme = e.target.dataset.controls;
                this.updateControlsDisplay();
            });
        });
        
        // Game mode selection
        document.querySelectorAll('[data-mode]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.game.audioSystem.playSound('menuClick');
                document.querySelectorAll('[data-mode]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.game.gameMode = e.target.dataset.mode;
            });
        });
        
        // Audio toggle selection
        document.querySelectorAll('[data-audio]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.game.audioSystem.playSound('menuClick');
                document.querySelectorAll('[data-audio]').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.game.audioSystem.setSoundsEnabled(e.target.dataset.audio === 'on');
            });
        });
        
        // Start game button
        document.getElementById('playBtn').addEventListener('click', () => {
            this.game.audioSystem.playSound('menuClick');
            this.game.startGame();
        });
        
        // Set defaults
        this.setDefaults();
    }
    
    setDefaults() {
        document.querySelector('[data-player-mode="twoPlayer"]').classList.add('selected');
        document.querySelector('[data-ai-difficulty="medium"]').classList.add('selected');
        document.querySelector('[data-controls="classic"]').classList.add('selected');
        document.querySelector('[data-mode="score"]').classList.add('selected');
        document.querySelector('[data-audio="on"]').classList.add('selected');
    }
    
    toggleMenuSections() {
        const aiDifficultySection = document.getElementById('aiDifficultySection');
        const controlSchemeSection = document.getElementById('controlSchemeSection');
        const twoPlayerControls = document.getElementById('twoPlayerControls');
        const singlePlayerControls = document.getElementById('singlePlayerControls');
        
        if (this.game.playerMode === 'singlePlayer') {
            aiDifficultySection.style.display = 'block';
            controlSchemeSection.querySelector('h2').textContent = 'Player Controls';
            twoPlayerControls.style.display = 'none';
            singlePlayerControls.style.display = 'flex';
            
            // Set default single player control
            document.querySelectorAll('[data-controls]').forEach(b => b.classList.remove('selected'));
            document.querySelector('[data-controls="arrows"]').classList.add('selected');
            this.game.controlScheme = 'arrows';
        } else {
            aiDifficultySection.style.display = 'none';
            controlSchemeSection.querySelector('h2').textContent = 'Control Scheme';
            twoPlayerControls.style.display = 'flex';
            singlePlayerControls.style.display = 'none';
            
            // Set default two player control
            document.querySelectorAll('[data-controls]').forEach(b => b.classList.remove('selected'));
            document.querySelector('[data-controls="classic"]').classList.add('selected');
            this.game.controlScheme = 'classic';
        }
    }
    
    updateControlsDisplay() {
        const scheme = this.game.controls[this.game.controlScheme];
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
    
    showMenu() {
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('gameContainer').classList.add('hidden');
        document.getElementById('pauseOverlay').classList.add('hidden');
        document.getElementById('gameOverOverlay').classList.add('hidden');
    }
} 