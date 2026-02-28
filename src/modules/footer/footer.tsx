'use client';

import './footer.scss';

export default function Footer() {
    return (
        <footer className="app-footer">
            <h2 className="app-footer-title">Контактная информация: info@doorscompany.com</h2>
            <div className="app-footer-block">
                <span className="app-footer-links">
                    <a href="#">Политика конфиденциальности</a>|<a href="#">Условия использования</a>
                </span>
                <span className="app-footer-links">
                    <a href="#">Каталог</a><a href="#">Twitter</a>
                </span>
            </div>
        </footer>
    );
}