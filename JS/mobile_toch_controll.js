document.addEventListener('DOMContentLoaded', () => {
    let touchStartX = 0;
    let touchEndX = 0;

    let touchStartY = 0;
    let touchEndY = 0;

    const navLinks = Array.from(
        document.querySelectorAll('ul.nav li a'),
        link => link.getAttribute('href')
    );
    const cleanLinks = navLinks.map(link => {
        const clean = link.split('?')[0];
        if (clean === "" || clean === "/" || clean === "index.html") {
            return "/";
        }
        return "/" + clean.replace(/^\/+/, "");
    });
    const currentPageIndex = cleanLinks.findIndex(link => link === window.location.pathname);

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

        const isRight = angleDegrees >= 135 && angleDegrees < 225;
        const isLeft = angleDegrees >= 315 || angleDegrees < 45;

        const swipeDistance = touchEndX - touchStartX;
        const swipeThreshold = 50;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (isRight & !isLeft) { //going right
                if (currentPageIndex < navLinks.length - 1) {
                    window.location.href = cleanLinks[currentPageIndex + 1] + "?direction=right";
                }       
            } else if (!isRight & isLeft) { // going left
                if (currentPageIndex > 0) {
                    window.location.href = cleanLinks[currentPageIndex - 1] + "?direction=left";
                }
            }
        }
    }
});