// Audio System for Vibe Pong

class AudioSystem {
    constructor() {
        this.audioContext = null;
        this.audioEnabled = true;
        this.soundsOn = true;
        this.sounds = {
            paddleHit: null,
            wallBounce: null,
            score: null,
            menuClick: null,
            gameOver: null
        };
        
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Audio not supported');
            this.audioEnabled = false;
        }
    }
    
    createSounds() {
        // Create synthetic cyberpunk sounds using oscillators
        this.sounds.paddleHit = () => this.createSyntheticSound(220, 0.1, 'square');
        this.sounds.wallBounce = () => this.createSyntheticSound(150, 0.15, 'triangle');
        this.sounds.score = () => this.createSyntheticSound(440, 0.3, 'sawtooth');
        this.sounds.menuClick = () => this.createSyntheticSound(330, 0.1, 'sine');
        this.sounds.gameOver = () => this.createGameOverSound();
    }
    
    createSyntheticSound(frequency, duration, waveType = 'sine') {
        if (!this.audioEnabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = waveType;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    createGameOverSound() {
        if (!this.audioEnabled || !this.audioContext) return;
        
        // Multi-tone game over sound
        const frequencies = [220, 185, 165, 147];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.createSyntheticSound(freq, 0.4, 'square');
            }, index * 100);
        });
    }
    
    playSound(soundName) {
        if (!this.audioEnabled || !this.soundsOn || !this.sounds[soundName]) return;
        
        // Resume audio context if suspended (browser policy)
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.sounds[soundName]();
    }
    
    setSoundsEnabled(enabled) {
        this.soundsOn = enabled;
    }
} 