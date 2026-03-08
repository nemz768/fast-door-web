
import { makeAutoObservable, runInAction } from "mobx";

class InstallerStore {
    installers: any[] = [];
    error: string | null = null;
    success: string | null = null;

    workloadByDate: Record<string, Record<string, { front: number; in: number }>> = {};
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    getInstallers = async () => {
        if (this.installers.length > 0) return;
        this.loading = true;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers`, {
                credentials: "include",
            });
            const data = await response.json();

            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to get installer list:", data);
                    this.error = `Не удалось получить список установщиков: ${response.status}`;
                });
            }

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
        if (!date) return;

        this.loading = true;
        runInAction(() => { this.error = null; this.success = null; });

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers/workload?date=${date}`, {
                credentials: "include",
            });

            const data = await response.json();
            const items = Array.isArray(data) ? data : data.workload || [];

            if (items.length === 0) {
                runInAction(() => {
                    this.error = `Не удалось получить загруженность установщиков: ${response.status}`;
                });
            } else {
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
            }

        } catch (error) {
            runInAction(() => {
                console.error("Failed to fetch installers workload:", error);
                this.error = "Не удалось получить загруженность установщиков (сетевая ошибка)";
            });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    };

    deleteInstaller = async (id: number) => {
        this.loading = true;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers/delete/${id}`, {
                credentials: "include",
                method: "DELETE",
            });
            const text = await response.text();

            runInAction(() => {
                this.installers = this.installers.filter(
                    (installer: any) => installer.id !== id
                );
            });
            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to delete installer:", text);
                    this.error = `Не удалось удалить установщика: ${response.status}`;
                });
                return;
            }
            this.success = 'Установщик успешно удален';

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

            const text = await response.json();

            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to get installer:", text);
                    this.error = `Не удалось получить данные установщика: ${response.status}`;
                });

                return;
            }
            return text;

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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const text = await response.text();

            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to create installer:", text);
                    this.error = `Не удалось создать установщика: ${response.status}`;
                });

                return;
            }
            this.success = 'Установщик успешно создан';

            console.log("Создание установщика успешно:", text);

        } catch (error) {
            runInAction(() => {
                console.error("Network or other error:", error);
                this.error = "Не удалось создать установщика (сетевая ошибка)";
            });
        } finally {
            runInAction(() => { this.loading = false; });
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
            const text = await response.text();

            if (!response.ok) {
                runInAction(() => {
                    console.error("Failed to update installer:", text);
                    this.error = `Не удалось изменить установщика: ${response.status}`;
                });

                return;
            }
            this.success = 'Установщик успешно обновлен';

            console.log("Обновление установщика успешно:", text);
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