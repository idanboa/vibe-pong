# Pong Game - Product Requirements Document (PRD)

## 1. Project Overview

**Project Name:** Vibe Pong  
**Platform:** Web Browser (JavaScript/HTML5 Canvas)  
**Target Audience:** Personal project for you and friends  
**Development Timeline:** 2 Days Sprint

## 2. Game Concept

Classic Pong reimagined with modern web technologies and neon aesthetics. A two-player paddle game where players control paddles to bounce a ball back and forth, scoring points when the opponent misses. Features multiple control schemes and game modes. Open for evolution and improvements.

## 3. Core Requirements

### 3.1 Gameplay Mechanics
- [ ] Two paddles (left and right side of screen) - **Fixed size**
- [ ] **Physics-based ball speed** with realistic bouncing and acceleration
- [ ] **Advanced ball physics**: Bounce angle based on paddle hit position
  - Steeper angles = faster ball speed
  - Shallow angles = slower ball speed
  - Dynamic speed adjustment during rallies
- [ ] Score tracking for both players
- [ ] **Dual game modes**: 
  - Score-based: **First to 10 points**
  - Time-based: **2-minute matches**
- [ ] Game over conditions for both modes

### 3.2 Controls & Menu System
- [ ] **Main menu with control scheme selection**
- [ ] **Multiple control schemes**:
  - Classic: Player 1 (W/S), Player 2 (↑/↓)
  - Spaced: Player 1 (A/Z), Player 2 (K/M)
  - Same-side: Player 1 (Q/A), Player 2 (P/L)
  - Custom mapping option
- [ ] Game mode selection (Score vs Time)
- [ ] Pause/Resume functionality (Spacebar)
- [ ] Reset game functionality (R key)

### 3.3 Visual Design - **NEON THEME**
- [ ] **Canvas**: Responsive design (base 1024x768, scales to window)
- [ ] **Color Scheme**:
  - Primary: **Bright cyan/teal (#00FFFF)**
  - Secondary: **Hot pink/magenta (#FF0080)**
  - Background: **Deep dark navy (#0A0A0F)**
  - Accents: **Electric blue (#0066FF)**
- [ ] **Glowing neon elements** with cyberpunk aesthetic
- [ ] **Dark background** with bright neon paddles and ball
- [ ] **Neon trail effects** for ball movement
- [ ] **Glowing UI elements** and score display
- [ ] **Pulsing/breathing effects** on menu items
- [ ] Responsive design for different screen sizes
- [ ] Smooth animations with glow effects

### 3.4 Audio (Optional - Phase 2)
- [ ] Synthetic/electronic sound effects
- [ ] Neon-themed audio feedback

## 4. Technical Requirements

### 4.1 Core Technologies
- [ ] HTML5 Canvas for game rendering
- [ ] Vanilla JavaScript (ES6+)
- [ ] CSS3 for styling and neon effects
- [ ] No external game frameworks

### 4.2 Performance
- [ ] 60 FPS gameplay
- [ ] **Advanced collision detection** with angle-based physics
- [ ] **Dynamic ball speed calculation** based on bounce angles
- [ ] Optimized rendering with glow effects
- [ ] **Maximum ball speed cap** to maintain playability

### 4.3 Browser Compatibility
- [ ] Modern browsers (Chrome, Firefox, Safari, Edge)
- [ ] CSS filter support for glow effects

## 5. Development Checkpoints

### Day 1: Core Foundation & Gameplay
**Morning (3-4 hours):**
- [ ] Set up project structure (HTML, CSS, JS files)
- [ ] Create HTML canvas with neon styling base
- [ ] Implement paddle rendering with glow effects
- [ ] Ball rendering with neon styling and basic physics

**Afternoon (3-4 hours):**
- [ ] Multiple control scheme implementation
- [ ] Ball-paddle collision detection with physics
- [ ] Ball-wall collision detection
- [ ] Basic score tracking system

### Day 2: Menu System & Polish
**Morning (3-4 hours):**
- [ ] **Main menu system** with control scheme selection
- [ ] **Game mode selection** (Score vs Time)
- [ ] Game states (menu, playing, paused, game over)
- [ ] Win conditions for both game modes

**Afternoon (3-4 hours):**
- [ ] **Neon visual polish**: trails, glows, animations
- [ ] Menu animations and transitions
- [ ] Code cleanup and optimization
- [ ] Testing all control schemes and game modes

## 6. User Stories

As a player, I want to:
- [ ] **Choose my preferred control scheme** from a menu
- [ ] **Select between score-based (first to 10) or time-based (2 min) gameplay**
- [ ] Control my paddle smoothly using my chosen controls
- [ ] Experience **realistic, physics-based ball movement** with angle-dependent speeds
- [ ] Enjoy a **visually stunning cyan and pink neon aesthetic**
- [ ] See the current score/time clearly displayed with glowing effects
- [ ] Be able to pause and resume the game
- [ ] Have a **smooth, glowing UI experience**
- [ ] Feel the **satisfying physics** where steep angle shots are faster

## 7. Success Criteria

- [ ] Game runs smoothly at 60 FPS with advanced physics
- [ ] All control schemes work flawlessly
- [ ] **Both game modes (10-point and 2-minute)** are engaging
- [ ] **Neon visual effects** are stunning and performant
- [ ] **Physics feel realistic** with angle-based speed variations
- [ ] Game works across target browsers
- [ ] Code is clean, well-documented, and maintainable

## 8. Technical Specifications

### 8.1 Canvas & Rendering
- **Base Resolution**: 1024x768 pixels
- **Scaling**: Responsive, maintains aspect ratio
- **Render Pipeline**: Canvas 2D with CSS filters for glow effects

### 8.2 Physics Engine
- **Ball Speed Range**: 200-800 pixels/second
- **Angle Calculation**: Hit position on paddle determines bounce angle (-60° to +60°)
- **Speed Formula**: `speed = baseSpeed + (abs(angle) * speedMultiplier)`
- **Collision Detection**: AABB with sub-pixel precision

### 8.3 Neon Effects Implementation
- **Glow**: CSS `filter: drop-shadow()` and `box-shadow`
- **Trails**: Canvas path rendering with alpha decay
- **Pulsing**: CSS animations with `filter: brightness()`
- **Performance**: Optimized redraw regions

## 9. Development Workflow & Git Rules

### 9.1 Git Commit Strategy
- **Commit Frequency**: After each significant milestone or feature completion
- **Commit Trigger Points**:
  - ✅ Each checkbox completion in development checkpoints
  - ✅ Working feature implementations (even if basic)
  - ✅ Major bug fixes or refactoring
  - ✅ End of each development session
  - ✅ Before implementing risky changes

### 9.2 Commit Message Format
```
[FEATURE/FIX/REFACTOR]: Brief description

- Detailed changes
- What was implemented/fixed
- Any notes for future reference
```

### 9.3 AI Assistant Prompt Rule
🤖 **AI ASSISTANT MUST**: Prompt for git commit after completing any of the trigger points above, suggesting appropriate commit message based on changes made.

---

## Next Steps

This PRD will guide our development process. Git repository initialized and ready for version control! 🚀 