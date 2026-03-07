import { makeAutoObservable, runInAction } from "mobx";

class InstallerStore {
    installers: any[] = [];
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
        } finally {
            this.loading = false;
        }
    };

    getInstallersWorkloadByDate = async (date: string) => {
        if (this.workloadByDate[date]) return;

        this.loading = true;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/listInstallers/workload?date=${date}`, {
                credentials: "include",
            });
            const data = await res.json();

            const map: Record<string, { front: number; in: number }> = {};
            data.forEach((item: any) => {
                map[item.installerFullName] = {
                    front: item.frontDoorQuantity || 0,
                    in: item.inDoorQuantity || 0
                };
            });

            runInAction(() => {
                this.workloadByDate[date] = map;
            });
        } finally {
            this.loading = false;
        }
    };
}

export const installerStore = new InstallerStore();