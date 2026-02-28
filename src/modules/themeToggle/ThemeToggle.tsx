import { themeStore } from "@/stores/themeStore";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

const ThemeToggle = observer(() => {
    const { isDark, toggleTheme } = themeStore;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null; 
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center p-2 rounded-full transition-colors duration-300"
            aria-label="Toggle theme"
        >
            <div className={`
                w-10 h-6 rounded-full transition-colors duration-300
                ${isDark ? 'bg-indigo-600' : 'bg-gray-300'}
            `}>
                <div className={`
                    w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300
                    ${isDark ? 'translate-x-4' : 'translate-x-0.5'}
                    mt-0.5 ml-0.5
                `} />
            </div>
            <span className="ml-2 text-sm">
                {isDark ? ' Темная' : ' Светлая'}
            </span>
        </button>
    );
});

export default ThemeToggle;