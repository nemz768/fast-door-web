'use client';
import { useEffect, useState } from 'react';
import './footer.scss';

export default function Footer() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const checkBottom = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            setVisible(scrollPosition >= pageHeight - 2);
        };

        let stabilizeTimer: ReturnType<typeof setTimeout>;

        const mutationObserver = new MutationObserver(() => {
            clearTimeout(stabilizeTimer);
            stabilizeTimer = setTimeout(checkBottom, 150);
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
        });

        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    checkBottom();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Начальная проверка — на случай если DOM уже готов
        stabilizeTimer = setTimeout(checkBottom, 150);

        return () => {
            clearTimeout(stabilizeTimer);
            window.removeEventListener('scroll', handleScroll);
            mutationObserver.disconnect();
        };
    }, []);

    return (
        <footer className={`app-footer ${visible ? 'show' : ''}`}>
            <h2 className="app-footer-title">
                Контактная информация: info@doorscompany.com
            </h2>
            <div className="app-footer-block">
                <span className="app-footer-links">
                    <a href="#">Политика конфиденциальности</a>
                    <span className="app-footer-divider">|</span>
                    <a href="#">Условия использования</a>
                </span>
                <span className="app-footer-links">
                    <a href="#">Каталог</a>
                    <a href="#">Twitter</a>
                </span>
            </div>
        </footer>
    );
}