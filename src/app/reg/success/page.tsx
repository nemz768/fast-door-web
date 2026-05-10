'use client'

// import { useEffect } from 'react'
import './success.scss'
import successW from '@/assets/images/successW.png'
// import { openApp } from '@/lib/openApp'
export default function Success() {

    // useEffect(() => {
    //     openApp()
    // }, [])

    return (
        <div className="success-page">
            <div className="success-page-block">
                <img className="success-page-block-img" src={successW.src} alt="success" />
                <h2 className="success-page-block-title">Регистрация прошла успешно!</h2>
                <p className="success-page-block-subtitle">Перейдите в мобильную версию приложения для входа в систему.<span>Ссылка на приложение: <a href="https://example.com/app" target="_blank">https://example.com/app</a></span></p>
            </div>
        </div>
    )
}