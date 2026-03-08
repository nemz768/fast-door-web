'use client';

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { authStore } from "@/stores/authStore";
import { tableStore } from "@/stores/tableStore";
import { calendarStore } from "@/stores/calendarStore";
import { installerStore } from "@/stores/installerStore";
import { reportsStore } from "@/stores/reportsStore";
import { orderStore } from "@/stores/orderStore";
import "./requestStatus.scss";

interface StoreWithStatus {
    error: string | null;
    success?: string | null;
    name?: string;
}

interface Notification {
    id: number;
    message: string;
    status: "success" | "error";
    closing?: boolean;
}

const stores: StoreWithStatus[] = [authStore, tableStore, calendarStore, installerStore, reportsStore, orderStore];

let nextId = 1;

const DISPLAY_DURATION = 3000; // 3 секунды
const CLOSING_DURATION = 350;  // slideOutRight

const RequestStatus = observer(() => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            stores.forEach(store => {

                if (store.error) {
                    addNotification(store.error, "error");

                    setTimeout(() => {
                        store.error = null;
                    }, 0);
                }

                if (store.success) {
                    addNotification(store.success, "success");

                    setTimeout(() => {
                        store.success = null;
                    }, 0);
                }

            });
        }, 200);

        return () => clearInterval(interval);
    }, []);
    const addNotification = (message: string, status: "success" | "error") => {
        const id = nextId++;
        setNotifications(prev => [{ id, message, status }, ...prev]);
    };

    const startClosing = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, closing: true } : n)
        );
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, CLOSING_DURATION);
    };

    const closeNotification = (id: number) => startClosing(id);

    return (
        <div className="request-status-wrapper">
            {notifications.map(n => (
                <div
                    key={n.id}
                    className={`request-status request-status--${n.status} ${n.closing ? 'closing' : ''}`}
                >
                    <span>{n.message}</span>
                    <span className="request-status-close" onClick={() => closeNotification(n.id)}>✕</span>
                    <div
                        className="progress-bar"
                        style={{
                            animationDuration: `${DISPLAY_DURATION}ms`,
                            animationPlayState: n.closing ? "paused" : "running"
                        }}

                        onAnimationEnd={() => {
                            if (!n.closing) startClosing(n.id);
                        }}
                    ></div>
                </div>
            ))}
        </div>
    );
});

export default RequestStatus;