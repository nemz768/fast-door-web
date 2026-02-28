import { makeAutoObservable } from "mobx";

type FieldConfig = {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    type?: "string" | "number";
};

class OrderStore {
    payload = {
        fullName: "",
        address: "",
        phone: "",
        messageSeller: "",
        dateOrder: "",
        frontDoorQuantity: '',
        inDoorQuantity: '',
    };

    errors: Record<string, string> = {};
    loading: boolean = false;
    error: string | null = null;

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

    setField<K extends keyof typeof this.payload>(
        field: K,
        value: string | number
    ) {
        if (typeof this.payload[field] === "string" && (field === "frontDoorQuantity" || field === "inDoorQuantity")) {
            this.payload[field] = String(value) as any;
        } else {
            this.payload[field] = value as any;
        }

        this.validateField(field);
    }

    validateField(field: keyof typeof this.payload) {
        const config = this.validationConfig[field];
        const value = this.payload[field];

        if (!config) return;

        if (config.required) {
            if (value === "" || value === null || value === undefined) {
                this.errors[field] = "Поле обязательно";
                return;
            } else {
                delete this.errors[field];
            }
        }

        if (config.type === "string") {
            const str = String(value);

            if (config.min && str.length < config.min) {
                this.errors[field] = `Минимум ${config.min} символов`;
                return;
            }

            if (config.max && str.length > config.max) {
                this.errors[field] = `Максимум ${config.max} символов`;
                return;
            }

            if (config.pattern && !config.pattern.test(str)) {
                this.errors[field] = "Некорректный формат";
                return;
            }

            delete this.errors[field];
        }

        if (config.type === "number") {
            const num = value === "" ? null : Number(value);

            if (num !== null) {
                if (config.min !== undefined && num < config.min) {
                    this.errors[field] = `Минимум ${config.min}`;
                    return;
                }

                if (config.max !== undefined && num > config.max) {
                    this.errors[field] = `Максимум ${config.max}`;
                    return;
                }
            }

            delete this.errors[field];

            if (
                field === "frontDoorQuantity" || field === "inDoorQuantity"
            ) {
                const front = this.payload.frontDoorQuantity === "" ? null : Number(this.payload.frontDoorQuantity);
                const inDoor = this.payload.inDoorQuantity === "" ? null : Number(this.payload.inDoorQuantity);

                if ((front === 0 || front === null) && (inDoor === 0 || inDoor === null)) {
                    this.errors.frontDoorQuantity = "Нельзя отправить значение 0";
                    this.errors.inDoorQuantity = "Нельзя отправить значение 0";
                } else {
                    delete this.errors.frontDoorQuantity;
                    delete this.errors.inDoorQuantity;
                }
            }
        }
    }

    validateForm() {
        Object.keys(this.payload).forEach((field) =>
            this.validateField(field as keyof typeof this.payload)
        );

        return this.isValid;
    }


    getInputProps<K extends keyof typeof this.payload>(field: K, isRawValue: boolean = false) {
        const hasError = !!this.errors[field];

        return {
            value: this.payload[field],
            className: hasError ? "input-error" : "",
            onChange: (e: React.ChangeEvent<HTMLInputElement> | number | string) => {

                if (isRawValue) {
                    const value = typeof this.payload[field] === "number" && typeof e === "string"
                        ? Number(e)
                        : e;
                    this.setField(field, value as any);
                    return;
                }

                const event = e as React.ChangeEvent<HTMLInputElement>;
                const value = typeof this.payload[field] === "number"
                    ? Number(event.target.value)
                    : event.target.value;

                this.setField(field, value as any);
            },
        };
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
                throw new Error(data.message || `Ошибка сервера: ${response.status}`);
            }
            console.log(data)
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

}

export const orderStore = new OrderStore();