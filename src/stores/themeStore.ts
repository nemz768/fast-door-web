import { makeAutoObservable } from "mobx";

class ThemeStore {
    isDark: boolean = false;

    constructor() {
        makeAutoObservable(this);
        if (typeof window !== 'undefined') {
            this.initTheme();
        }
    }

    initTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDark = true;
            document.documentElement.classList.add('dark');
        } else if (savedTheme === 'light') {
            this.isDark = false;
            document.documentElement.classList.remove('dark');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.isDark = prefersDark;
            if (prefersDark) {
                document.documentElement.classList.add('dark');
            }
        }
    }

    toggleTheme = () => {
        this.isDark = !this.isDark;
        
        if (this.isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }

    setTheme = (isDark: boolean) => {
        this.isDark = isDark;
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }
}

export const themeStore = new ThemeStore();