const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Function to set the theme
function setTheme(isDark) {
    if (isDark) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
    updateIcon(isDark);
    localStorage.setItem('darkMode', isDark);
}

// Function to update the icon
function updateIcon(isDark) {
    themeToggle.innerHTML = isDark
        ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>';
}

// Function to get system preference
function getSystemPreference() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Function to set initial theme
function setInitialTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
        setTheme(JSON.parse(savedTheme));
    } else {
        setTheme(getSystemPreference());
    }
}

// Toggle theme when button is clicked
themeToggle.addEventListener('click', () => {
    const isDark = !html.classList.contains('dark');
    setTheme(isDark);
});

// Listen for system preference changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
        setTheme(e.matches);
    }
});

// Set initial theme
setInitialTheme();

tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: "#0a0a0a",
                light: "#fcfbf7",
            },
        },
    },
}