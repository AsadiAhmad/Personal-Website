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
    }

    function toggleTheme() {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
    }

    applyTheme(getPreferredTheme());

    toggleButton.addEventListener('click', toggleTheme);
})();
