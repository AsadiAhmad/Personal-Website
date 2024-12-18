document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;

    const navLinks = document.querySelectorAll('ul.nav li a');
    const currentPageIndex = Array.from(navLinks).findIndex(link => link.href === window.location.href);

    window.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    window.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                if (currentPageIndex > 0) {
                    window.location.href = navLinks[currentPageIndex - 1].href;
                }
            } else {
                if (currentPageIndex < navLinks.length - 1) {
                    window.location.href = navLinks[currentPageIndex + 1].href;
                }
            }
        }
    }
});