// Create animated twinkling stars for night sky
function createStars() {
    const starsContainer = document.querySelector('.stars-container');
    const starSizes = ['small', 'medium', 'large', 'extra-large'];
    const twinkleSpeeds = ['twinkle-slow', 'twinkle-medium', 'twinkle-fast'];
    const numStars = 150; // Many stars for a beautiful night sky
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random star size
        const size = starSizes[Math.floor(Math.random() * starSizes.length)];
        star.classList.add(size);
        
        // Random twinkle speed
        const speed = twinkleSpeeds[Math.floor(Math.random() * twinkleSpeeds.length)];
        star.classList.add(speed);
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random animation delay for variety
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starsContainer.appendChild(star);
    }
}

// Message fade animations
function showMessages() {
    const message1 = document.getElementById('message1');
    const message2 = document.getElementById('message2');
    
    // Timeline:
    // 0-1s: Wait
    // 1-2s: Message 1 fades in (1s)
    // 2-5s: Message 1 holds (3s)
    // 5-6s: Message 1 fades out (1s)
    // 6-7s: Gap (1s)
    // 7-8s: Message 2 fades in (1s)
    // 8-11s: Message 2 holds (3s)
    // 11-12s: Message 2 fades out (1s)
    // 12s: Content appears
    
    // Wait 1 second, then start message 1
    setTimeout(() => {
        // Message 1: Fade in (1s)
        message1.style.animation = 'fadeIn 1s ease-in forwards';
        
        // After 1s fade in + 3s hold = 4s, start fade out
        setTimeout(() => {
            message1.style.animation = 'fadeOut 1s ease-out forwards';
        }, 4000);
        
        // Message 2: Start after message 1 completes (5s) + gap (1s) = 6s
        setTimeout(() => {
            message2.style.animation = 'fadeIn 1s ease-in forwards';
            
            // After 1s fade in + 3s hold = 4s, start fade out
            setTimeout(() => {
                message2.style.animation = 'fadeOut 1s ease-out forwards';
            }, 4000);
        }, 6000); // 5s (message1) + 1s (gap)
    }, 1000);
}

// Add fade animations to CSS dynamically
function addFadeAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -50%);
            }
        }
    `;
    document.head.appendChild(style);
}

// Audio handling with user interaction
function setupAudio() {
    const audio = document.getElementById('backgroundMusic');
    let hasInteracted = false;
    
    // Try to play on any user interaction
    const playAudio = () => {
        if (!hasInteracted) {
            hasInteracted = true;
            audio.play().catch(err => {
                console.log('Audio play failed:', err);
            });
        }
    };
    
    // Listen for various user interactions
    const events = ['click', 'touchstart', 'keydown', 'scroll'];
    events.forEach(event => {
        document.addEventListener(event, playAudio, { once: true });
    });
    
    // Also try to play when page loads (some browsers allow this)
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (!hasInteracted) {
                audio.play().catch(() => {
                    // Will wait for user interaction
                });
            }
        }, 500);
    });
    
    // Loop the audio
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play();
    });
}

// Initialize everything when page loads
window.addEventListener('DOMContentLoaded', () => {
    createStars();
    addFadeAnimations();
    showMessages();
    setupAudio();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Add some sparkle effects on click
document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.width = '10px';
    sparkle.style.height = '10px';
    sparkle.style.background = 'radial-gradient(circle, #ffebee, #ff69b4)';
    sparkle.style.borderRadius = '50%';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.boxShadow = '0 0 10px rgba(255, 192, 203, 0.8)';
    sparkle.style.animation = 'sparkleFade 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleFade {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2) translateY(-20px);
        }
    }
`;
document.head.appendChild(sparkleStyle);
