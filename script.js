// Create animated twinkling stars for night sky
function createStars() {
    const starsContainer = document.querySelector('.stars-container');
    const starSizes = ['small', 'medium', 'large', 'extra-large'];
    const twinkleSpeeds = ['twinkle-slow', 'twinkle-medium', 'twinkle-fast'];
    const numStars = 150;
    
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        const size = starSizes[Math.floor(Math.random() * starSizes.length)];
        star.classList.add(size);
        
        const speed = twinkleSpeeds[Math.floor(Math.random() * twinkleSpeeds.length)];
        star.classList.add(speed);
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        starsContainer.appendChild(star);
    }
}

// Message fade animations
function showMessages() {
    const message1 = document.getElementById('message1');
    const message2 = document.getElementById('message2');
    
    setTimeout(() => {
        message1.style.animation = 'fadeIn 1s ease-in forwards';
        
        setTimeout(() => {
            message1.style.animation = 'fadeOut 1s ease-out forwards';
        }, 4000);
        
        setTimeout(() => {
            message2.style.animation = 'fadeIn 1s ease-in forwards';
            
            setTimeout(() => {
                message2.style.animation = 'fadeOut 1s ease-out forwards';
            }, 4000);
        }, 6000);
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

// ============================================
// BULLETPROOF AUDIO - Works on Chrome Android
// ============================================
function setupAudio() {
    const audio = document.getElementById('backgroundMusic');
    let isUnlocked = false;
    let playAttempted = false;
    
    // Set initial properties
    audio.loop = true;
    audio.volume = 0.7;
    audio.preload = 'auto';
    
    // Function to unlock and play audio
    const unlockAudio = function() {
        if (isUnlocked) return;
        
        console.log('🎵 Attempting to unlock audio...');
        
        // Create a temporary silent audio context to unlock
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            const buffer = ctx.createBuffer(1, 1, 22050);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            if (source.start) {
                source.start(0);
            } else if (source.noteOn) {
                source.noteOn(0);
            }
        }
        
        // Force load and play the audio
        audio.load();
        
        // Use a promise to handle play
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    isUnlocked = true;
                    playAttempted = true;
                    console.log('✅ Audio unlocked and playing!');
                    
                    // Remove all event listeners after successful unlock
                    removeAllListeners();
                })
                .catch((error) => {
                    console.log('❌ Play failed:', error.name, error.message);
                    
                    // If it failed, keep trying on next interaction
                    if (error.name === 'NotAllowedError') {
                        console.log('⏳ User interaction required. Waiting for tap/click...');
                    }
                });
        }
    };
    
    // Remove all event listeners after audio starts
    const removeAllListeners = function() {
        const allEvents = [
            'touchstart', 'touchend', 'touchmove',
            'click', 'mousedown', 'mouseup',
            'keydown', 'scroll'
        ];
        
        allEvents.forEach(event => {
            document.removeEventListener(event, unlockAudio);
            document.body.removeEventListener(event, unlockAudio);
            window.removeEventListener(event, unlockAudio);
        });
    };
    
    // Add event listeners - AGGRESSIVE approach for Chrome
    const allEvents = [
        'touchstart',   // Primary for mobile
        'touchend',     // Secondary for mobile
        'touchmove',    // For swipe gestures
        'click',        // For mouse clicks
        'mousedown',    // For mouse press
        'mouseup',      // For mouse release
        'keydown',      // For keyboard
        'scroll'        // For scroll interaction
    ];
    
    // Add listeners to multiple targets
    allEvents.forEach(event => {
        document.addEventListener(event, unlockAudio, { passive: true });
        document.body.addEventListener(event, unlockAudio, { passive: true });
        window.addEventListener(event, unlockAudio, { passive: true });
    });
    
    // Handle audio end event for looping
    audio.addEventListener('ended', function() {
        if (isUnlocked) {
            audio.currentTime = 0;
            audio.play().catch(err => {
                console.log('Loop play failed:', err);
            });
        }
    });
    
    // Additional attempt when page becomes visible (for tab switching)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden && !isUnlocked && playAttempted) {
            unlockAudio();
        }
    });
    
    // Try to autoplay after a short delay (works on some browsers)
    setTimeout(() => {
        if (!isUnlocked) {
            unlockAudio();
        }
    }, 500);
    
    console.log('🎵 Audio setup complete. Tap anywhere to start music!');
}

// Initialize everything
window.addEventListener('DOMContentLoaded', () => {
    createStars();
    addFadeAnimations();
    showMessages();
    setupAudio();
    
    document.documentElement.style.scrollBehavior = 'smooth';
});

// Sparkle effects on click/touch
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, #ffebee, #ff69b4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        box-shadow: 0 0 10px rgba(255, 192, 203, 0.8);
        animation: sparkleFade 1s ease-out forwards;
    `;
    
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
}

// Listen for both click and touch
document.addEventListener('click', (e) => {
    createSparkle(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
    if (e.touches[0]) {
        createSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

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