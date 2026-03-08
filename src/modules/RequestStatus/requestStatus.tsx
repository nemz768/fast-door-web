'use client';

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { authStore } from "@/stores/authStore";
import { tableStore } from "@/stores/tableStore";
import { calendarStore } from "@/stores/calendarStore";
import { installerStore } from "@/stores/installerStore";
import { reportsStore } from "@/stores/reportsStore";
import "./requestStatus.scss";
import { orderStore } from "@/stores/orderStore";

interface StoreWithStatus {
  error: string | null;
  success?: string | null;
}

const stores: StoreWithStatus[] = [authStore, tableStore, calendarStore, installerStore, reportsStore, orderStore];

const RequestStatus = observer(() => {
  const [closing, setClosing] = useState(false);

  // Всегда ищем активный стор
  const activeStore = stores.find(store => store.error || store.success);

  // Закрытие уведомления
  const close = () => {
    setClosing(true);
    setTimeout(() => {
      if (activeStore) {
        activeStore.error = null;
        if ('success' in activeStore) activeStore.success = null;
      }
      setClosing(false);
    }, 350);
  };

  useEffect(() => {
    if (!activeStore) return;

    const timer = setTimeout(close, 7000);
    return () => clearTimeout(timer);
  }, [activeStore?.error, activeStore?.success]);

  if (!activeStore) return null;

  const status = activeStore.error ? "error" : "success";
  const message = activeStore.error || activeStore.success;

  return (
    <div className={`request-status request-status--${status} ${closing ? "closing" : ""}`}>
      <span>{message}</span>

      <span className="request-status-close" onClick={close}>✕</span>

      <div className="progress-bar"></div>
    </div>
  );
});

export default RequestStatus;