import { makeAutoObservable, runInAction } from "mobx";

interface Order {
    id: number;
    fullName: string;
    address: string;
    phone: string;
    condition: string;
}

interface Report {
    id: number;
    title: string;
    dateFrom: string;
    dateTo: string;
    dateCreated: string;
    relatedUsers: string[];
    orders: Order[];
}

class ReportsStore {
    error: string | null = null;
    success: string | null = null;
    loading: boolean = false;
    data: Report[] = [];
    sellers: string[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    fetchData = async (
        url: string,
        method: string,
        body?: object,
        fileName?: string,
        successMessage?: string,
        errorMessage?: string
    ) => {
        runInAction(() => {
            this.loading = true;
            this.error = null;
            this.success = null;
        });

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: body ? JSON.stringify(body) : undefined,
            });

            const contentType = response.headers.get("content-type");
            let responseData: any = null;

            if (contentType && contentType.includes("application/json")) {
                const text = await response.text();
                responseData = text ? JSON.parse(text) : null;
            }

            if (!response.ok) {
                const errorMsg = `${errorMessage}: ${response.status}`;
                runInAction(() => { this.error = errorMsg; });
                throw new Error(errorMsg);
            }

            if (method === 'GET' && fileName) {
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = `${fileName.replace("admin", "")}.xls`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);

                runInAction(() => { this.success = `Файл "${fileName}" успешно загружен`; });
                return null;
            }

            if (successMessage) {
                runInAction(() => { this.success = successMessage; });
            }

            return responseData;
        } catch (err: any) {
            console.error(err);
            runInAction(() => {
                if (!this.error) {
                    this.error = err instanceof Error ? err.message : errorMessage || 'Неизвестная ошибка запроса';
                }
            });
            throw err;
        } finally {
            runInAction(() => { this.loading = false; });
        }
    };

    getReportDownload = async (reportId: number, fileName: string) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/report/download?reportId=${reportId}`;
        await this.fetchData(
            url,
            "GET",
            undefined,
            fileName,
            `Файл "${fileName}" успешно загружен`,
            "Ошибка при скачивании отчета"
        );
    };

    getReportData = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/report/all`;
        return this.fetchData(
            url,
            "GET",
            undefined,
            undefined,
            undefined,
            "Не удалось загрузить отчеты"
        ).then((reports: Report[]) => {
            const cleanedReports = (reports || []).map((item) => ({
                ...item,
                title: item.title.replace(/admin/gi, '').trim()
            }));
            runInAction(() => { this.data = cleanedReports; });
            return this.data;
        });
    }

    postReportData = async (data: object) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/report/create`;

        await this.fetchData(
            url,
            "POST",
            data,
            undefined,
            undefined,
            "Не удалось создать отчет"
        );

        await this.getReportData();

        runInAction(() => {
            this.success = "Отчет успешно создан";
        });
    }



    getSellersStore = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/seller/all`;
        const data = await this.fetchData(
            url,
            "GET",
            undefined,
            undefined,
            undefined,
            "Не удалось загрузить магазины"
        );

        runInAction(() => {
            if (Array.isArray(data) && data.length > 0) {
                if (typeof data[0] === 'string') {
                    this.sellers = data;
                } else if (typeof data[0] === 'object' && 'name' in data[0]) {
                    this.sellers = data.map((item: any) => item.name);
                }
            }
        });
    }
}

export const reportsStore = new ReportsStore();