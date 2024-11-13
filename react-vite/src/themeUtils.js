
export const toggleTheme = () => {
    const isDarkMode = document.documentElement.classList.contains('dark-mode');
    if (isDarkMode) {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
};

export const loadTheme = () => {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }
};
