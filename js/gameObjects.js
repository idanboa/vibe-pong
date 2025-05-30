// Game Objects for Vibe Pong

class Paddle {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.score = 0;
    }
    
    moveUp() {
        if (this.y > 0) {
            this.y -= this.speed;
        }
    }
    
    moveDown(canvasHeight) {
        if (this.y < canvasHeight - this.height) {
            this.y += this.speed;
        }
    }
    
    reset(centerY) {
        this.y = centerY - this.height / 2;
        this.score = 0;
    }
    
    render(ctx, color) {
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 15;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Ball {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = speed;
        this.vy = speed * 0.6;
        this.speed = speed;
        this.maxSpeed = 15;
        this.trail = [];
    }
    
    update() {
        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
            this.trail.shift();
        }
        
        // Move ball
        this.x += this.vx;
        this.y += this.vy;
    }
    
    reset(centerX, centerY, initialSpeed) {
        this.x = centerX;
        this.y = centerY;
        this.speed = initialSpeed;
        
        // Random direction
        const angle = (Math.random() - 0.5) * Math.PI / 3; // ±30 degrees
        const direction = Math.random() < 0.5 ? 1 : -1;
        
        this.vx = Math.cos(angle) * this.speed * direction;
        this.vy = Math.sin(angle) * this.speed;
        
        this.trail = [];
    }
    
    bounceY() {
        this.vy = -this.vy;
    }
    
    handlePaddleCollision(paddle, colors, audioSystem, particleSystem) {
        if (this.x - this.radius < paddle.x + paddle.width &&
            this.x + this.radius > paddle.x &&
            this.y - this.radius < paddle.y + paddle.height &&
            this.y + this.radius > paddle.y) {
            
            // Calculate hit position on paddle (-1 to 1)
            const hitPos = ((this.y - paddle.y) / paddle.height) * 2 - 1;
            
            // Calculate new angle based on hit position
            const maxAngle = Math.PI / 3; // 60 degrees
            const angle = hitPos * maxAngle;
            
            // Calculate new speed based on angle (steeper = faster)
            const speedMultiplier = 1 + Math.abs(hitPos) * 0.5;
            const newSpeed = Math.min(this.speed * speedMultiplier, this.maxSpeed);
            
            // Determine direction based on which paddle
            const isLeftPaddle = paddle.x < 100; // Approximate left side
            const direction = isLeftPaddle ? 1 : -1;
            
            // Set new velocity
            this.vx = Math.cos(angle) * newSpeed * direction;
            this.vy = Math.sin(angle) * newSpeed;
            
            // Move ball away from paddle to prevent sticking
            if (isLeftPaddle) {
                this.x = paddle.x + paddle.width + this.radius;
            } else {
                this.x = paddle.x - this.radius;
            }
            
            // Increase ball speed slightly for rally progression
            this.speed = Math.min(this.speed + 0.2, this.maxSpeed);
            
            // Play sound and create particles
            audioSystem.playSound('paddleHit');
            const particleColor = isLeftPaddle ? colors.primary : colors.secondary;
            particleSystem.createParticles(this.x, this.y, particleColor, 8);
            
            return true;
        }
        return false;
    }
    
    render(ctx, color) {
        // Draw ball trail
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = (i + 1) / this.trail.length * 0.5;
            const radius = this.radius * alpha;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10 * alpha;
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw ball
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
} 