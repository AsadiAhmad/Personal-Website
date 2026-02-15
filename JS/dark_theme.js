(function () {
    const THEME_KEY = 'site-theme';
    const root = document.body;
    const nav = document.querySelector('nav.parent-nav');

    if (!root || !nav) return;

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

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'theme-toggle';
    toggleButton.innerHTML = [
        '<span class="icon icon-sun" aria-hidden="true">&#9728;</span>',
        '<span class="icon icon-moon" aria-hidden="true">&#9789;</span>',
        '<span class="sr-only">Toggle theme</span>'
    ].join('');

    nav.insertAdjacentElement('afterend', toggleButton);
    applyTheme(getPreferredTheme());

    toggleButton.addEventListener('click', toggleTheme);
})();

