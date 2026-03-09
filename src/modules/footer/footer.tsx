'use client';

import { useEffect, useState } from 'react';
import './footer.scss';

export default function Footer() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let ticking = false;

        const checkBottom = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollPosition >= pageHeight - 2) {
                setVisible(true);
            } else {
                setVisible(false);
            }

            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(checkBottom);
                ticking = true;
            }
        };

        // ждём пока DOM стабилизируется
        const timer = setTimeout(() => {
            window.addEventListener('scroll', handleScroll);
            checkBottom();
        }, 300);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <footer className={`app-footer ${visible ? 'show' : ''}`}>
            <h2 className="app-footer-title">
                Контактная информация: info@doorscompany.com
            </h2>

            <div className="app-footer-block">
                <span className="app-footer-links">
                    <a href="#">Политика конфиденциальности</a>|
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