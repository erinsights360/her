/**
 * app.js - High-Performance Canvas Particle System
 * RESEARCH: Implements requestAnimationFrame and Canvas API for 60fps particle generation, 
 * ensuring a premium, non-lagging animation that feels smooth and cinematic.
 */

// Global DOM references
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const heartContainer = document.getElementById('heartContainer');
const mainContainer = document.getElementById('mainContainer');
const surpriseBtn = document.getElementById('surpriseBtn');

let heartCenter = { x: 0, y: 0 };
let particles = [];
let animationFrameId = null;
let heartActive = false;

// --- Particle Class ---
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 0.5; // Tiny, elegant sparkle size
        this.color = color;
        this.alpha = 1;
        this.speed = Math.random() * 0.4 + 0.1; 
        
        // Random outward angle
        const angle = Math.random() * Math.PI * 2;
        
        // Outward velocity: subtle spread
        this.velocity = {
            x: Math.cos(angle) * this.speed * 2,
            y: Math.sin(angle) * this.speed * 2
        };
        
        this.gravity = 0.003; // Extremely subtle rise/fall
        this.drag = 0.99; // Subtle drag for smooth deceleration
    }

    update() {
        // Apply drag and subtle gravity for organic float
        this.velocity.x *= this.drag;
        this.velocity.y *= this.drag;
        this.velocity.y += this.gravity;
        
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        
        // Cinematic fade effect
        this.alpha -= 0.005; // Slow, elegant fade over time
        this.size *= 0.995; // Subtly shrinks
    }

    draw() {
        // Save and restore context for individual particle alpha control
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        
        // Create a soft glow for each particle
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// --- Core Animation Loop ---
function animateParticles() {
    // RESEARCH: requestAnimationFrame is the gold standard for smooth, optimized animation
    animationFrameId = requestAnimationFrame(animateParticles);

    // Subtle clear: Using a transparent background for a short trail effect (streaks)
    ctx.fillStyle = 'rgba(28, 28, 60, 0.05)'; // Matches dark background with high transparency
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    if (heartActive) {
        // Continuous, subtle particle generation from the heart
        if (Math.random() < 0.6) { 
            const particleColor = Math.random() < 0.9 ? 'rgba(255, 107, 157, 1)' : 'rgba(255, 215, 0, 1)'; // Rose/Gold ratio
            const newParticle = new Particle(heartCenter.x, heartCenter.y, particleColor);
            particles.push(newParticle);
        }

        // Update and draw all active particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.update();
            p.draw();

            // Cleanup: remove particles that are invisible or too small
            if (p.alpha <= 0 || p.size <= 0.1) {
                particles.splice(i, 1);
            }
        }
    } else {
        // Quick fade out existing particles when heart is deactivated
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].alpha -= 0.01; 
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    }
}

// --- Utility Functions ---

// Resize handler for responsiveness
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Scale canvas for high-DPI (Retina) displays (Source 1.1)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Set CSS size (drawn size)
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    // Calculate the precise screen coordinates of the heart center
    const heartRect = heartContainer.getBoundingClientRect();
    heartCenter.x = heartRect.left + heartRect.width / 2;
    heartCenter.y = heartRect.top + heartRect.height / 2;
}

// --- The Cinematic Activation ---
function activateHeart() {
    if (!heartActive) {
        heartActive = true;
        
        // 1. Initial State Transition
        heartContainer.classList.add('heart-active');
        surpriseBtn.textContent = '💖 The Heart Beats for You! 💖';
        
        // 2. Recalculate position for accuracy (Staging Principle)
        resizeCanvas(); 
        
        // 3. Initial Burst: Explosion on click (Source 2.3 - Straight ahead/Pose to Pose)
        for (let i = 0; i < 80; i++) {
            const particleColor = Math.random() < 0.7 ? 'rgba(255, 107, 157, 1)' : 'rgba(255, 215, 0, 1)';
            particles.push(new Particle(heartCenter.x, heartCenter.y, particleColor));
        }

        // 4. Update Button Text after the initial animation settles
        setTimeout(() => {
            surpriseBtn.textContent = 'Click to Hide The Magic';
            surpriseBtn.style.background = 'linear-gradient(45deg, #cc4477, #aa2255)';
            surpriseBtn.style.boxShadow = '0 10px 30px rgba(170, 34, 85, 0.5)';
        }, 3000);
        
    } else {
        // Deactivation
        heartActive = false;
        heartContainer.classList.remove('heart-active');
        surpriseBtn.textContent = '✨ Reveal The Heart of The Message ✨';
        surpriseBtn.style.background = 'linear-gradient(45deg, #a77dff, #6236ff)';
        surpriseBtn.style.boxShadow = '0 10px 30px rgba(98, 54, 255, 0.5)';
    }
}


// --- Initialization ---

window.addEventListener('load', () => {
    resizeCanvas();
    animateParticles(); 

    // Remove Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        mainContainer.classList.add('fade-in');
        
        // RESEARCH: Ensure elements are removed after transition to prevent memory leak (Source 1.1)
        setTimeout(() => loadingScreen.remove(), 1000); 
    }, 2000); 
});

// Update canvas size and heart position on device/window change
window.addEventListener('resize', resizeCanvas);