'use client';
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { useEffect, useState, CSSProperties } from "react";
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
    status: "success" | "error" | "warning";
    closing?: boolean;
    customStyle?: CSSProperties;
}

type AddNotificationFn = (message: string, customStyle?: CSSProperties) => void;

const stores: StoreWithStatus[] = [authStore, tableStore, calendarStore, installerStore, reportsStore, orderStore];
let nextId = 1;
const DISPLAY_DURATION = 6000;
const CLOSING_DURATION = 650;

type AddWarningFn = (message: string, customStyle?: CSSProperties) => void;
export let warning: AddWarningFn = () => { };
export let success: AddNotificationFn = () => { };

const RequestStatus = observer(() => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (message: string, status: "success" | "error" | "warning", customStyle?: CSSProperties) => {
        const id = nextId++;
        setNotifications(prev => [{ id, message, status, customStyle }, ...prev]);
    };
    useEffect(() => {
        warning = (message, customStyle) => addNotification(message, "warning", customStyle);
        success = (message, customStyle) => addNotification(message, "success", customStyle);
        return () => { warning = () => { }; success = () => { }; };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            stores.forEach(store => {
                if (store.error) {
                    addNotification(store.error, "error");
                    setTimeout(() => { runInAction(() => { store.error = null; }); }, 0);
                }
                if (store.success) {
                    addNotification(store.success, "success");
                    setTimeout(() => { runInAction(() => { store.success = null; }); }, 0);
                }
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

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
                    style={n.customStyle}
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