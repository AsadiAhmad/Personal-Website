(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        // Lower = smoother but slower to catch up (0.05-0.15 is good)
        lerp: 0.1,
        // Multiplier for mouse wheel speed (1 = normal)
        wheelMultiplier: 0.5,
        // Multiplier for touch devices (1 = normal)
        touchMultiplier: 2,
        // Maximum scroll velocity for momentum
        maxVelocity: 10,
        // How much momentum friction to apply (0.9-0.99)
        momentumFriction: 0.95,
    };

    // --- DOM References ---
    const container = document.getElementById('scrollContainer');
    const html = document.documentElement;

    // --- State ---
    let currentScroll = 0; // The animated scroll position
    let targetScroll = 0; // The target position we're animating toward
    let velocity = 0; // Current velocity for momentum
    let isScrolling = false;
    let isStopped = false;

    // --- Dimensions ---
    let viewportHeight = 0;
    let contentHeight = 0;
    let maxScroll = 0;

    // --- Track whether user is using touch ---
    let isTouchDevice = false;

    // --- Custom scrollbar ---
    let track = null;
    let thumb = null;
    let thumbHeight = 0;

    // 
    // 3.1: Calculate dimensions
    // 
    function updateDimensions() {
        viewportHeight = window.innerHeight;
        // fractional height, not the rounded offsetHeight
        contentHeight = container.getBoundingClientRect().height;

        // Floor the content and ceil the viewport so we can never scroll past the real bottom
        maxScroll = Math.max(0, Math.floor(contentHeight) - Math.ceil(viewportHeight));

        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        currentScroll = Math.max(0, Math.min(currentScroll, maxScroll));

        updateScrollbar();
    }

    // 
    // 3.2: Apply the scroll position to the DOM
    // 
    function applyScroll(scrollValue) {
        const clamped = Math.max(0, Math.min(scrollValue, maxScroll));

        // Snap to whole device pixels so there is no sub-pixel blur and no final "tick"
        const dpr = window.devicePixelRatio || 1;
        const y = Math.round(clamped * dpr) / dpr;

        container.style.transform = `translate3d(0, ${-y}px, 0)`;
        container.dataset.scroll = Math.round(clamped);
        updateScrollbar(clamped);
    }

    function updateScrollbar(scrollValue = currentScroll) {
        if (!track || !thumb) return;

        if (maxScroll <= 0) {
            track.classList.add('is-hidden');
            return;
        }
        track.classList.remove('is-hidden');

        const trackHeight = track.clientHeight;
        thumbHeight = Math.max(30, trackHeight * (viewportHeight / contentHeight));
        const travel = trackHeight - thumbHeight;
        const y = (scrollValue / maxScroll) * travel;

        thumb.style.height = thumbHeight + 'px';
        thumb.style.transform = `translateY(${y}px)`;
    }

    function createScrollbar() {
        track = document.createElement('div');
        track.className = 'smooth-scrollbar';
        thumb = document.createElement('div');
        thumb.className = 'smooth-scrollbar-thumb';
        track.appendChild(thumb);
        document.documentElement.appendChild(track);

        // Drag the thumb
        let dragStartY = 0;
        let dragStartScroll = 0;

        thumb.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            thumb.setPointerCapture(e.pointerId);
            thumb.classList.add('is-dragging');
            dragStartY = e.clientY;
            dragStartScroll = targetScroll;
            velocity = 0;
        });

        thumb.addEventListener('pointermove', (e) => {
            if (!thumb.hasPointerCapture(e.pointerId)) return;
            const travel = track.clientHeight - thumbHeight;
            if (travel <= 0) return;
            const dy = e.clientY - dragStartY;
            targetScroll = dragStartScroll + dy * (maxScroll / travel);
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
            velocity = 0;
        });

        const endDrag = (e) => {
            thumb.classList.remove('is-dragging');
            if (thumb.hasPointerCapture(e.pointerId)) {
                thumb.releasePointerCapture(e.pointerId);
            }
        };
        thumb.addEventListener('pointerup', endDrag);
        thumb.addEventListener('pointercancel', endDrag);

        // Click on the track to jump
        track.addEventListener('pointerdown', (e) => {
            if (e.target !== track) return;
            const rect = track.getBoundingClientRect();
            const ratio = (e.clientY - rect.top - thumbHeight / 2) / (rect.height - thumbHeight);
            targetScroll = Math.max(0, Math.min(ratio * maxScroll, maxScroll));
            velocity = 0;
        });
    }

    // 
    // 3.3: The animation loop (called every frame)
    // 
    function updateScroll(time) {
        if (isStopped) {
            requestAnimationFrame(updateScroll);
            return;
        }

        // Apply momentum: velocity decays over time
        velocity *= CONFIG.momentumFriction;

        // If there's significant velocity, add it to target
        if (Math.abs(velocity) > 0.01) {
            targetScroll += velocity;
            // Clamp target to bounds
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        }

        // Calculate the difference between current and target
        const diff = targetScroll - currentScroll;
        
        // If we're close enough, snap to target to avoid micro-jitter
        if (Math.abs(diff) < 0.01) {
            currentScroll = targetScroll;
        } else {
            // Apply lerp (linear interpolation) for smooth easing
            currentScroll += diff * CONFIG.lerp;
        }

        // Apply the scroll position
        applyScroll(currentScroll);

        // Fire a custom event for other scripts (like parallax, etc.)
        const scrollEvent = new CustomEvent('smooth-scroll', {
            detail: {
                scroll: currentScroll,
                target: targetScroll,
                velocity: velocity,
                progress: maxScroll > 0 ? currentScroll / maxScroll : 0,
            }
        });
        document.dispatchEvent(scrollEvent);

        // Continue the loop
        requestAnimationFrame(updateScroll);
    }

    // 
    // 3.4: Handle scroll input from wheel/trackpad
    // 
    function handleWheel(e) {
        if (isStopped) return;

        // Check if we should prevent smooth scroll (nested scrollable elements)
        const target = e.target;
        if (shouldPreventSmooth(target)) {
            return; // Let native scroll handle it
        }

        e.preventDefault();

        // Determine delta
        let delta = e.deltaY;
        
        // Handle horizontal scrolling (deltaX)
        if (e.deltaX !== 0 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            // For simplicity, we only handle vertical in this demo
            // But you could add horizontal support here
            delta = e.deltaX;
        }

        // Apply multiplier
        delta *= CONFIG.wheelMultiplier;

        // Add delta to target and velocity
        targetScroll += delta;
        velocity += delta * 0.3; // Add some momentum

        // Clamp target
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        // Limit velocity
        velocity = Math.max(-CONFIG.maxVelocity, Math.min(CONFIG.maxVelocity, velocity));

        // Mark that we're scrolling
        isScrolling = true;
        clearTimeout(window._scrollTimeout);
        window._scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 500);
    }

    // 
    // 3.5: Handle touch events (for mobile)
    // 
    let touchStartY = 0;
    let touchStartScroll = 0;
    let lastTouchY = 0;
    let touchVelocity = 0;

    function handleTouchStart(e) {
        if (isStopped) return;
        
        const target = e.target;
        if (shouldPreventSmooth(target)) {
            return;
        }

        isTouchDevice = true;
        const touch = e.touches[0];
        touchStartY = touch.clientY;
        lastTouchY = touchStartY;
        touchStartScroll = targetScroll;
        touchVelocity = 0;
    }

    function handleTouchMove(e) {
        if (isStopped) return;
        
        const target = e.target;
        if (shouldPreventSmooth(target)) {
            return;
        }

        e.preventDefault();

        const touch = e.touches[0];
        const currentY = touch.clientY;
        const deltaY = (touchStartY - currentY) * CONFIG.touchMultiplier;

        // Calculate velocity based on recent movement
        const recentDelta = lastTouchY - currentY;
        touchVelocity = recentDelta * 0.5;

        // Update target scroll based on touch movement
        targetScroll = touchStartScroll + deltaY;
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        lastTouchY = currentY;
    }

    function handleTouchEnd(e) {
        if (isStopped) return;
        
        // Apply touch velocity as momentum
        if (Math.abs(touchVelocity) > 0.5) {
            velocity += touchVelocity;
            velocity = Math.max(-CONFIG.maxVelocity, Math.min(CONFIG.maxVelocity, velocity));
            
            // Add the velocity to target gradually
            targetScroll += velocity;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
        }
    }

    // 
    // 3.6: Helper to check if element should prevent smooth scroll
    // 
    function shouldPreventSmooth(element) {
        // Check if element or any parent has data-prevent-smooth
        let current = element;
        while (current && current !== document.body) {
            if (current.hasAttribute && current.hasAttribute('data-prevent-smooth')) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }

    // 
    // 3.7: Public API methods
    // 
    const SmoothScroll = {
        // Scroll to a specific position
        scrollTo(target, options = {}) {
            const {
                offset = 0,
                duration = 1000,
                easing = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t, // easeInOutQuad
            } = options;

            // Resolve target
            let targetPosition = target;
            if (typeof target === 'string') {
                if (target === 'top' || target === 'start') {
                    targetPosition = 0;
                } else if (target === 'bottom' || target === 'end') {
                    targetPosition = maxScroll;
                } else {
                    // Try to find element by selector
                    const el = document.querySelector(target);
                    if (el) {
                        targetPosition = el.offsetTop - offset;
                    }
                }
            } else if (typeof target === 'number') {
                targetPosition = target - offset;
            } else if (target instanceof HTMLElement) {
                targetPosition = target.offsetTop - offset;
            }

            // Clamp target
            targetPosition = Math.max(0, Math.min(targetPosition, maxScroll));

            // Animate to target using duration-based easing
            const startScroll = currentScroll;
            const startTime = performance.now();
            const diff = targetPosition - startScroll;

            // Stop any ongoing momentum
            velocity = 0;

            function animateScroll(time) {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easing(progress);
                
                currentScroll = startScroll + diff * easedProgress;
                applyScroll(currentScroll);
                targetScroll = currentScroll;

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                } else {
                    currentScroll = targetPosition;
                    applyScroll(currentScroll);
                    if (options.onComplete) {
                        options.onComplete();
                    }
                }
            }

            requestAnimationFrame(animateScroll);
        },

        // Stop the scroll (disable user scrolling)
        stop() {
            isStopped = true;
            html.classList.add('smooth-scroll-stopped');
        },

        // Start the scroll (enable user scrolling)
        start() {
            isStopped = false;
            html.classList.remove('smooth-scroll-stopped');
        },

        // Update dimensions (call on resize)
        resize() {
            updateDimensions();
            applyScroll(currentScroll);
        },

        // Get current scroll position
        getScroll() {
            return currentScroll;
        },

        // Get max scroll
        getMaxScroll() {
            return maxScroll;
        },
    };

    // 
    // 3.8: Initialize everything
    // 
    function init() {
        // Add smooth-scroll class to html
        html.classList.add('smooth-scroll');
        createScrollbar();          // <-- NEW
        // Initial dimension calculation
        updateDimensions();

        // Apply initial scroll (0)
        applyScroll(0);

        // Add event listeners
        // Wheel events (desktop)
        document.addEventListener('wheel', handleWheel, { passive: false });

        // Touch events (mobile)
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                SmoothScroll.resize();
            }, 100);
        });

        // Start the animation loop
        requestAnimationFrame(updateScroll);

        console.log('🚀 Smooth Scroll initialized!');
        console.log('📦 API available: window.SmoothScroll');
    }

    // Expose the API globally
    window.SmoothScroll = SmoothScroll;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();