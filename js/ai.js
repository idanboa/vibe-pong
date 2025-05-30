// AI System for Vibe Pong

class AIOpponent {
    constructor() {
        this.targetY = 0;
        this.reactionTime = 0;
        this.lastUpdate = 0;
        this.missChance = 0;
        this.speed = 1;
        this.prediction = 0;
        this.errorMargin = 0;
        this.difficulty = 'medium';
    }
    
    configure(difficulty) {
        this.difficulty = difficulty;
        
        switch (difficulty) {
            case 'easy':
                this.reactionTime = 300; // 300ms delay
                this.missChance = 0.15; // 15% miss rate
                this.speed = 0.6; // 60% of normal speed
                this.prediction = 0; // No prediction
                this.errorMargin = 40; // Large error margin
                break;
            case 'medium':
                this.reactionTime = 150; // 150ms delay
                this.missChance = 0.05; // 5% miss rate
                this.speed = 0.8; // 80% speed
                this.prediction = 0.3; // Some prediction
                this.errorMargin = 20; // Medium error margin
                break;
            case 'hard':
                this.reactionTime = 50; // 50ms delay
                this.missChance = 0.02; // 2% miss rate
                this.speed = 1.0; // Full speed
                this.prediction = 0.7; // Strong prediction
                this.errorMargin = 5; // Small error margin
                break;
        }
    }
    
    update(ball, paddle, canvasHeight) {
        const currentTime = Date.now();
        
        // Only update AI decision based on reaction time
        if (currentTime - this.lastUpdate > this.reactionTime) {
            this.lastUpdate = currentTime;
            
            // Calculate target position
            let targetY = ball.y;
            
            // Add prediction based on difficulty
            if (this.prediction > 0) {
                const futureTime = this.prediction * 100; // Look ahead
                const futureY = ball.y + (ball.vy * futureTime);
                targetY = ball.y + ((futureY - ball.y) * this.prediction);
            }
            
            // Add error margin for realism
            const error = (Math.random() - 0.5) * this.errorMargin;
            targetY += error;
            
            // Intentional miss chance
            if (Math.random() < this.missChance) {
                targetY += (Math.random() - 0.5) * 200; // Random miss
            }
            
            // Center target on paddle
            this.targetY = targetY - (paddle.height / 2);
        }
        
        // Move AI paddle toward target
        const paddleCenter = paddle.y + (paddle.height / 2);
        const targetCenter = this.targetY + (paddle.height / 2);
        const distance = targetCenter - paddleCenter;
        
        if (Math.abs(distance) > 5) { // Dead zone to prevent jittering
            const moveSpeed = paddle.speed * this.speed;
            if (distance > 0) {
                // Move down
                paddle.y = Math.min(
                    paddle.y + moveSpeed,
                    canvasHeight - paddle.height
                );
            } else {
                // Move up
                paddle.y = Math.max(
                    paddle.y - moveSpeed,
                    0
                );
            }
        }
    }
} 