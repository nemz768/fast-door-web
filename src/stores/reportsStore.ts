import { makeAutoObservable } from "mobx";

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
    loading: boolean = false;
    data: Report[] = [];
    sellers: string[] = [];
    
    constructor() {
        makeAutoObservable(this);
    }

    fetchData = async (url: string, method: string, body?: object, fileName?: string) => {
        this.loading = true;
        this.error = null;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                body: body ? JSON.stringify(body) : undefined
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
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
                return null;
            } 
            
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const text = await response.text();
                const data = text ? JSON.parse(text) : null;
                return data;
            } else {
                console.warn('unexpected content type:', contentType);
                return null;
            }
        } catch (error) {
            console.error(error);
            this.error = error instanceof Error ? error.message : 'Unknown error';
            throw error;
        } finally {
            this.loading = false;
        }
    }

    getReportData = async () => {
        const getReportsDataUrl = `${process.env.NEXT_PUBLIC_API_URL}/report/all`;
        this.error = null;
      
        try {
            const reports = await this.fetchData(getReportsDataUrl, "GET");
            const cleanedReports = (reports || []).map((item: Report) => ({
                ...item,
                title: item.title.replace(/admin/gi, '').trim()
            }));
            this.data = cleanedReports;
          
            return this.data;
        } catch (error) {
            console.error('Error fetching reports:', error);
            this.error = error instanceof Error ? error.message : 'Failed to fetch reports';
            throw error;
        }
    }

    postReportData = async (data: object) => {
        const postReportsDataUrl = `${process.env.NEXT_PUBLIC_API_URL}/report/create`;
        this.error = null;
      
        try {
            await this.fetchData(postReportsDataUrl, "POST", data);
            await this.getReportData();
        } catch (error) {
            console.error('Error sending reports:', error);
            this.error = error instanceof Error ? error.message : 'Failed to send reports';
            throw error;
        }
    }

    getReportDownload = async (reportId: number, fileName: string) => {
        const dataDownloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/report/download?reportId=${reportId}`;
        await this.fetchData(dataDownloadUrl, "GET", undefined, fileName);
    }

    getSellersStore = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/seller/all`;
        this.error = null;
        
        try {
            const response = await fetch(url, {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('unexpected response format for sellers');
            }

            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
                if (typeof data[0] === 'string') {
                    this.sellers = data; 
                } else if (typeof data[0] === 'object' && 'name' in data[0]) {
                    this.sellers = data.map((item: any) => item.name); 
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки магазинов:', error);
            this.error = error instanceof Error ? error.message : 'Неизвестная ошибка';
        }
    };
}

export const reportsStore = new ReportsStore();