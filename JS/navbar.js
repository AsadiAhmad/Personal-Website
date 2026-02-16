document.addEventListener('DOMContentLoaded', () => {
    const navElement = document.querySelector('nav.parent-nav');
    const navList = document.querySelector('ul.nav');

    if (!navElement || !navList) return;

    const navLinks = navList.querySelectorAll('li');
    const navAnchors = navList.querySelectorAll('li a');
    const animationDiv = navList.querySelector('.animation');
    const mobileBreakpoint = 650;

    let activeLink = null;

    const mobileToggle = document.createElement('button');
    mobileToggle.type = 'button';
    mobileToggle.className = 'nav-mobile-toggle';
    mobileToggle.classList.add(
        document.body.getAttribute('data-theme') === 'light' ? 'dark-shadow' : 'light-shadow'
    );
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navElement.insertBefore(mobileToggle, navList);

    function isMobile() {
        return window.innerWidth <= mobileBreakpoint;
    }

    function updateToggleLabel() {
        if (!activeLink) return;
        const activeAnchor = activeLink.querySelector('a');
        if (activeAnchor) {
            mobileToggle.textContent = activeAnchor.textContent.trim();
        }
    }

    function closeMobileMenu() {
        navElement.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }

    function updatePointer(target) {
        if (!animationDiv || isMobile()) return;
        animationDiv.style.width = target.offsetWidth + 4 + 'px';
        animationDiv.style.left = target.offsetLeft - 2 + 'px';
    }

    function resetActiveState() {
        navLinks.forEach((link) => link.classList.remove('active', 'hover'));
    }

    function normalizePath(path) {
        if (!path) return '/';
        let normalized = path.toLowerCase().replace(/\/+$/, '');
        if (normalized === '') normalized = '/';
        if (normalized.endsWith('/index.html')) normalized = normalized.slice(0, -'/index.html'.length) || '/';
        return normalized;
    }

    const currentPath = normalizePath(window.location.pathname);

    navAnchors.forEach((anchor) => {
        const anchorPath = normalizePath(anchor.pathname);
        if (anchorPath === currentPath) {
            activeLink = anchor.parentElement;
            activeLink.classList.add('active');
        }
    });

    if (!activeLink) {
        activeLink = navLinks[0];
        activeLink.classList.add('active');
    }

    updateToggleLabel();
    updatePointer(activeLink);

    navLinks.forEach((link) => {
        link.addEventListener('mouseenter', () => {
            // if (isMobile()) return;
            resetActiveState();
            link.classList.add('hover');
            updatePointer(link);
        });

        link.addEventListener('mouseleave', () => {
            // if (isMobile()) return;
            link.classList.remove('hover');
            activeLink.classList.add('active');
            updatePointer(activeLink);
        });

        link.addEventListener('click', () => {
            resetActiveState();
            link.classList.add('active');
            activeLink = link;
            updateToggleLabel();
            updatePointer(activeLink);

            if (isMobile()) {
                closeMobileMenu();
            }
        });
    });

    mobileToggle.addEventListener('click', () => {
        const isOpen = navElement.classList.toggle('mobile-open');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
        if (!isMobile()) return;
        if (!navElement.contains(event.target)) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (!isMobile()) {
            closeMobileMenu();
            updatePointer(activeLink);
        }
    });
});
