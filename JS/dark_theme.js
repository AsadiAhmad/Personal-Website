(function () {
    const THEME_KEY = 'site-theme';
    const root = document.body;
    const toggleButton = document.querySelector('.theme-toggle');

    if (!root || !toggleButton) return;

    function getPreferredTheme() {
        const stored = localStorage.getItem(THEME_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (toggleButton) {
            toggleButton.setAttribute(
                'aria-label',
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
            toggleButton.setAttribute('title', theme === 'dark' ? 'Light mode' : 'Dark mode');
        }
        const addShadowClass = theme === 'dark' ? 'light-shadow' : 'dark-shadow';
        const removeShadowClass = theme === 'dark' ? 'dark-shadow' : 'light-shadow';
        document
            .querySelectorAll('.theme-toggle, .hero-btn, .nav-mobile-toggle')
            .forEach((element) => {
                element.classList.remove(removeShadowClass);
                element.classList.add(addShadowClass);
            });
    }

    function toggleTheme() {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    applyTheme(getPreferredTheme());

    toggleButton.addEventListener('click', toggleTheme);
})();
