import { makeAutoObservable, runInAction } from "mobx";
import { calendarStore } from "./calendarStore";

type FieldConfig = {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    type?: "string" | "number";
};

export class OrderStore {
    payload = {
        fullName: "",
        address: "",
        phone: "",
        messageSeller: "",
        dateOrder: "",
        frontDoorQuantity: "",
        inDoorQuantity: "",
    };

    errors: Record<string, string> = {};
    loading = false;
    error: string | null = null;
    success: string | null = null;

    validationConfig: Record<keyof typeof this.payload, FieldConfig> = {
        fullName: { required: true, min: 3, max: 50, type: "string" },
        address: { required: true, min: 3, max: 100, type: "string" },
        phone: {
            required: true,
            pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
            type: "string",
        },
        messageSeller: { max: 150, type: "string" },
        dateOrder: { required: true, type: "string" },
        frontDoorQuantity: { min: 0, max: 99, type: "number" },
        inDoorQuantity: { min: 0, max: 99, type: "number" },
    };

    constructor() {
        makeAutoObservable(this);
    }

    setField<K extends keyof typeof this.payload>(field: K, value: string | number) {
        this.payload[field] = String(value);
        this.validateField(field);
    }

    validateField(field: keyof typeof this.payload) {
        const value = this.payload[field];
        const config = this.validationConfig[field];

        if (!config) return;

        if (config.required && (!value || value === "")) {
            this.errors[field] = "Поле обязательно";
            return;
        } else {
            delete this.errors[field];
        }

        if (config.type === "string") {
            if (config.min && value.length < config.min) {
                this.errors[field] = `Минимум ${config.min} символов`;
                return;
            }
            if (config.max && value.length > config.max) {
                this.errors[field] = `Максимум ${config.max} символов`;
                return;
            }
            if (config.pattern && !config.pattern.test(value)) {
                this.errors[field] = "Некорректный формат";
                return;
            }
        }
        if (field === "frontDoorQuantity" || field === "inDoorQuantity") {
            const front = Number(this.payload.frontDoorQuantity || 0);
            const inDoor = Number(this.payload.inDoorQuantity || 0);

            if (!this.payload.dateOrder) {
                this.errors.frontDoorQuantity = "Выберите дату перед вводом количества";
                this.errors.inDoorQuantity = "Выберите дату перед вводом количества";
                return;
            }

            const dayData = calendarStore.allData.find(d => d.date === this.payload.dateOrder);

            if (dayData) {
                if (front > dayData.frontDoorQuantity) {
                    this.errors.frontDoorQuantity = `Максимум ${dayData.frontDoorQuantity} на выбранную дату`;
                } else if (this.errors.frontDoorQuantity === `Максимум ${dayData.frontDoorQuantity} на выбранную дату`) {
                    delete this.errors.frontDoorQuantity;
                }

                if (inDoor > dayData.inDoorQuantity) {
                    this.errors.inDoorQuantity = `Максимум ${dayData.inDoorQuantity} на выбранную дату`;
                } else if (this.errors.inDoorQuantity === `Максимум ${dayData.inDoorQuantity} на выбранную дату`) {
                    delete this.errors.inDoorQuantity;
                }
            } else {
                if (this.errors.frontDoorQuantity?.includes("Максимум")) delete this.errors.frontDoorQuantity;
                if (this.errors.inDoorQuantity?.includes("Максимум")) delete this.errors.inDoorQuantity;
            }
            if (front === 0 && inDoor === 0) {
                this.errors.frontDoorQuantity = "Нельзя отправить значение 0";
                this.errors.inDoorQuantity = "Нельзя отправить значение 0";
            } else {
                if (this.errors.frontDoorQuantity === "Нельзя отправить значение 0") delete this.errors.frontDoorQuantity;
                if (this.errors.inDoorQuantity === "Нельзя отправить значение 0") delete this.errors.inDoorQuantity;
            }
        }
    }

    validateForm() {
        Object.keys(this.payload).forEach(field => this.validateField(field as keyof typeof this.payload));
        return Object.keys(this.errors).length === 0;
    }

    get isValid() {
        return Object.keys(this.errors).length === 0;
    }



    postOrderData = async (payload: typeof this.payload) => {
        const preparedPayload = {
            ...payload,
            doorLimits: {
                limitDate: payload.dateOrder
            },
        }

        this.error = null;
        this.loading = true;
        const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/create`
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(preparedPayload)
            })
            const data = await response.json()

            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to create order:", data);
                    this.error = `Не удалось создать заказ: ${response.status}`;
                });

                return;
            }
            this.success = 'Заказ успешно создан';


            return data;

        } catch (error: any) {
            console.error(error);
            this.error = error.message || "Неизвестная ошибка при отправке заказа";
            return null;
        }
        finally {
            this.loading = false;
        }
    }

    getOrderSeller = async (id: number | undefined, role: string) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/edit/${id}`;
        const options: RequestInit = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
        }

        try {
            this.error = null;
            this.loading = true;

            const response = await fetch(url, options)
            const data = await response.json();

            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to get data for edit:", data);
                    this.error = `Не удалось получить данные для редактирования: ${response.status}`;
                });

                return;
            }

            return data;
        }
        catch (err: any) {
            console.error(err);
            this.error = err.message;

        } finally {
            this.loading = false;
        }

    }

    editOrderSeller = async (id: number, payload: object) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/edit/${id}`;
        const options: RequestInit = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        };

        try {
            const response = await fetch(url, options);
            const text = await response.text();

            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to update order:", text);
                    this.error = `Не удалось обновить заказ: ${response.status}`;
                });

                return;
            }

            this.success = 'Заказ успешно обновлен';

            if (!text.trim() || text === "{}") {
                console.log("Заказ успешно обновлён (пустой ответ)");
                return true;
            }

            try {
                const data = JSON.parse(text);
                console.log("Ответ сервера:", data);
                return data;
            } catch (e) {
                console.warn("Не удалось распарсить ответ как JSON, но статус 200 — считаем успехом");
                return true;
            }
        } catch (err: any) {
            console.error("Сеть/ошибка:", err);
            this.error = err.message;
            return false;
        }
    };

}

export const orderStore = new OrderStore();