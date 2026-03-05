import { makeAutoObservable } from "mobx";

class TableStore {
    data: any = null;
    error: string | null = null;
    totalPages: number = 0;
    loading: boolean = false;
    isInitialized: Boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    fetchData = async (url: string) => {
        this.error = null;
        this.totalPages = 0;
        this.loading = true;
        this.isInitialized = false;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();
            console.log("Fetched data:", data);

            this.totalPages = data.totalPages;

            return data;
        }
        catch (error: any) {
            this.error = error.message;
            console.error("Fetch data error:", error);
        }
        finally {
            this.loading = false;
            this.isInitialized = true;

        }

    }

    parseResponse(data: any, roleTable?: string, selectedTable?: string) {
        if (!data) return [];

        if (roleTable === "main") {
            switch (selectedTable) {
                case "installerTable":
                    return Array.isArray(data.installers) ? data.installers : [];

                case "allOrdersTable":
                case "mainInstallerTable":
                    return Array.isArray(data.orders) ? data.orders : [];

                case "doorsTable":
                    return Array.isArray(data.doors) ? data.doors : [];

                default:
                    return [];
            }
        }

        if (roleTable === "administrator" || roleTable === "salespeople") {
            return Array.isArray(data.orders) ? data.orders : [];
        }

        return [];
    }

    getUsersData = async (
        roleTable: string,
        page?: number,
        size?: number,
        selectedTable?: string
    ) => {

        let url = "";

        switch (roleTable) {
            case "administrator":
                url = `${process.env.NEXT_PUBLIC_API_URL}/list/adminList?page=${page}&size=${size}`;
                break;

            case "salespeople":
                url = `${process.env.NEXT_PUBLIC_API_URL}/list/sellerList?page=${page}&size=${size}`;
                break;

            case "main":
                if (selectedTable === "installerTable") {
                    url = `${process.env.NEXT_PUBLIC_API_URL}/listInstallers`;
                } else if (selectedTable === "allOrdersTable") {
                    url = `${process.env.NEXT_PUBLIC_API_URL}/mainInstaller/listOrdersMainInstaller?page=${page}&size=${size}`;
                } else {
                    url = `${process.env.NEXT_PUBLIC_API_URL}/mainInstaller?page=${page}&size=${size}`;
                }
                break;

            default:
                throw new Error("Unknown roleTable");
        }

        const rawData = await this.fetchData(url);

        const parsed = this.parseResponse(rawData, roleTable, selectedTable);

        this.data = parsed;

        return parsed;
    };

    getTotalPages() {
        return this.totalPages;
    }

    methodsOfOrder = async (
        url: string,
        method: string,
        body?: Record<string, unknown>
    ) => {
        this.loading = true;
        this.error = null;

        try {
            const options: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(url, options);

            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                return await response.text();
            }

        } catch (error: any) {
            console.error(error);
            this.error = error.message;
        } finally {
            this.loading = false;
        }
    }

    deleteOrder = async (orderId: number) => {
         const result = await this.methodsOfOrder(
        `${process.env.NEXT_PUBLIC_API_URL}/delete?id=${orderId}`,
        "DELETE"
    );

    if (!this.error && Array.isArray(this.data)) {
        console.log("Удаление успешно:", result);

        this.data = this.data.filter(
            (order: any) => order.id !== orderId
        );
    }
    }


}


export const tableStore = new TableStore();