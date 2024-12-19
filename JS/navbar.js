document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('ul.nav li');
    const navAnchors = document.querySelectorAll('ul.nav li a');
    const animationDiv = document.querySelector('ul.nav .animation');

    let activeLink = null;

    function updatePointer(target) {
        animationDiv.style.width = target.offsetWidth + 4 + 'px';
        animationDiv.style.left = target.offsetLeft - 2 + 'px';
    }

    function resetActiveState() {
        navLinks.forEach((link) => link.classList.remove('active', 'hover'));
    }

    navAnchors.forEach((anchor) => {
        if (anchor.href === window.location.href) {
            activeLink = anchor.parentElement;
            activeLink.classList.add('active');
        }
    });

    if (!activeLink) {
        activeLink = navLinks[0];
        activeLink.classList.add('active');
    }

    updatePointer(activeLink);

    navLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            resetActiveState();
            link.classList.add('hover');
            updatePointer(link);
        });

        link.addEventListener('mouseleave', () => {
            link.classList.remove('hover');
            activeLink.classList.add('active');
            updatePointer(activeLink);
        });

        link.addEventListener('click', () => {
            resetActiveState();
            link.classList.add('active');
            activeLink = link;
            updatePointer(activeLink);
        });
    });
});