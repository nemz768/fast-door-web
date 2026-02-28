'use client'


import {useRouter} from "next/navigation"

export default function Unauthorized () {
    const router = useRouter();
    
    return (
             <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            backgroundColor: "#f5f5f7",
            gap: "16px",
            padding: "20px",
            textAlign: "center"
        }}>
            <h1 style={{
                fontSize: "28px",
                fontWeight: "600",
                color: "#1d1d1f",
                margin: "0"
            }}>
                Доступ запрещен
            </h1>
            <p style={{
                fontSize: "16px",
                color: "#86868b",
                margin: "8px 0 0 0"
            }}>
                У вас нет прав для просмотра этой страницы
            </p>
            <button 
                onClick={() => router.push('/login')}
                style={{
                    marginTop: "16px",
                    padding: "12px 24px",
                    fontSize: "16px",
                    backgroundColor: "#8B6649",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#8B664990"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#8B6649"}
            >
                На главную
            </button>
        </div>
    )
}