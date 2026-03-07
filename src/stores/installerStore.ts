
import { makeAutoObservable, runInAction } from "mobx";

class InstallerStore {
    installers: any[] = [];
    error: string | null = null;
    workloadByDate: Record<string, Record<string, { front: number; in: number }>> = {};
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    getInstallers = async () => {
        if (this.installers.length > 0) return;
        this.loading = true;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers`, {
                credentials: "include",
            });
            const data = await res.json();

            runInAction(() => {
                this.installers = data.installers || [];
            });
        } catch (error) {
            runInAction(() => {
                console.error("Failed to fetch installers:", error);
                this.error = "Не удалось получить список установщиков";
            });
        } finally {
            this.loading = false;
        }
    };

    getInstallersWorkloadByDate = async (date: string) => {
        this.loading = true;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers/workload?date=${date}`, {
                credentials: "include",
            });
            const data = await res.json();

            const items = Array.isArray(data) ? data : data.workload || []; 

            const map: Record<string, { front: number; in: number }> = {};
            items.forEach((item: any) => {
                map[item.installerFullName] = {
                    front: item.frontDoorQuantity || 0,
                    in: item.inDoorQuantity || 0,
                };
            });

            runInAction(() => {
                this.workloadByDate[date] = map;
            });
        } catch (error) {
            runInAction(() => {
                console.error("Failed to fetch installers workload:", error);
                this.error = "Не удалось получить загруженность работника";
            });
        } finally {
            this.loading = false;
        }
    };

    deleteInstaller = async (id: number) => {
        this.loading = true;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers/delete/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            const data = await res.text();
            console.log("Удаление установщика успешно:", data);
            runInAction(() => {
                this.installers = this.installers.filter(
                    (installer: any) => installer.id !== id
                );
            });
        } catch (error) {
            runInAction(() => {
                console.error("Failed to fetch installers:", error);
                this.error = "Не удалось удалить установщика";
            });
        }
        finally {
            this.loading = false;
        }
    }

    getInstallerById = async (id: number) => {
        this.loading = true;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/installer/${id}`, {
                credentials: "include",
                method: "GET"
            });

            const result = await response.json();
            console.log(result);
            return result;

        } catch (error) {
            runInAction(() => {
                console.error("Failed to update installer:", error);
                this.error = "Не удалось получить установщика";
            });
        } finally {
            this.loading = false;
        }
    }


    createInstaller = async (data: { fullName: string; phone: string }) => {
        this.loading = true;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers/create?fullName=${data.fullName}&phone=${data.phone}`, {
                credentials: "include",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await response.text();
            console.log("Создание установщика успешно:", result);

        } catch (error) {
            runInAction(() => {
                console.error("Failed to create installer:", error);
                this.error = "Не удалось создать установщика";
            });
        } finally {
            this.loading = false;
        }
    }

    editInstaller = async (id: number, data: { fullName: string; phone: string }) => {
        this.loading = true;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/installer/${id}?fullName=${data.fullName}&phone=${data.phone}`, {
                credentials: "include",
                method: "PATCH",
                body: JSON.stringify(data),
            });
            const result = await response.text();
            console.log("Обновление установщика успешно:", result);
        } catch (error) {
            runInAction(() => {
                console.error("Failed to update installer:", error);
                this.error = "Не удалось обновить установщика";
            });
        } finally {
            this.loading = false;
        }
    }

}

export const installerStore = new InstallerStore();