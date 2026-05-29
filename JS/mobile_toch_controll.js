document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;

    let touchStartY = 0;
    let touchEndY = 0;

    const navLinks = document.querySelectorAll('ul.nav li a');
    const currentPageIndex = Array.from(navLinks).findIndex(link => link.href === window.location.href);

    window.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    window.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        const angleRadians = Math.atan2(deltaY, deltaX);
        let angleDegrees = angleRadians * (180 / Math.PI);

        if (angleDegrees < 0) {
            angleDegrees += 360;
        }

        const isRight = angleDegrees >= 315 || angleDegrees < 45;
        const isLeft = angleDegrees >= 135 && angleDegrees < 225;

        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (isRight & !isLeft) {
                if (currentPageIndex > 0) {
                    window.location.href = navLinks[currentPageIndex - 1].href;
                }       
            } else if (!isRight & isLeft) {
                if (currentPageIndex < navLinks.length - 1) {
                    window.location.href = navLinks[currentPageIndex + 1].href;
                }
            }
        }
    }
});