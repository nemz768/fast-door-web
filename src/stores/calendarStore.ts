import { makeAutoObservable } from "mobx";

export interface CalendarDateItem {
  [x: string]: any;
  id: number;
  date: string;
  frontDoorQuantity: number;
  inDoorQuantity: number;
  available: boolean;
  orders?: any[];
}

class CalendarStore {
  pagedData: CalendarDateItem[] = [];
  allData: CalendarDateItem[] = [];
  error: string | null = null;
  loading: boolean = false;
  totalPages: number = 0;
  totalElements: number = 0;
  selectedDates: any;

  constructor() {
    makeAutoObservable(this);
  }

  fetchPaged = async (page = 0, size = 10, sortBy = "id") => {
    try {
      this.loading = true;
      this.error = null;

      const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/allDays?page=${page}&size=${size}&sort=${sortBy}`;

      const response = await fetch(url, {
        credentials: "include",
        headers: { "Accept": "application/json" },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      this.pagedData = result.content.map((item: any) => ({
        ...item,
        available: item.available,
      }));

      this.totalPages = result.totalPages;
      this.totalElements = result.totalElements;

      return this.pagedData;
    } catch (err: any) {
      this.error = err.message;
      return [];
    } finally {
      this.loading = false;
    }
  };

  fetchAll = async () => {
    try {
      this.loading = true;
      this.error = null;

      let allData: CalendarDateItem[] = [];
      let page = 0;
      let totalPages = 1;

      while (page < totalPages) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/allDays?page=${page}&size=100&sort=id`;

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "include"
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const result = await response.json();

        allData = [...allData, ...result.content];
        totalPages = result.totalPages;
        page++;
      }

      this.allData = allData;

      return allData;
    } catch (err: any) {
      this.error = err.message;
      return [];
    } finally {
      this.loading = false;
    }
  };


  handleGetCalendarDisabledDates = async (page = 0, size = 100, sortBy = 'id') => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/doorLimits/allDays?page=${page}&size=${size}&sortBy=${sortBy}`
    try {
      this.loading = true;
      this.error = null;


      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const data = await response.json();
      console.log(data.content);

      this.allData = data.content;
      return this.allData;

    } catch (err: any) {
      this.error = err.message;
      return [];
    } finally {
      this.loading = false;
    }
  }

  fetchPatchCalendar = async (url: string, payload?: any, method: string = "PATCH") => {
    try {
      this.error = null;
      this.loading = true;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: payload ? JSON.stringify(payload) : undefined,
      });

      if (!response.ok) throw new Error(`Ошибка ${response.status}`);

      const data = await response.text();
      console.log("RESULT:", data);
      return data;
    } catch (error: any) {
      this.error = error.message;
      console.error(error);
    } finally {
      this.loading = false;
    }
  };

  closeCalendarDates = async (dates: { date: string }[]) => {
    try {
      this.loading = true;
      this.error = null;

      await Promise.all(
        dates.map(item => {
          const url = `${process.env.NEXT_PUBLIC_API_URL}/doorLimits/closeDate?date=${item.date}`;
          const payload = {
            date: item.date,
            available: false,
          };
          return this.fetchPatchCalendar(url, payload, "PATCH");
        })
      );

      this.allData = this.allData.map(d =>
        dates.some(item => item.date === d.date)
          ? { ...d, available: false }
          : d
      );

      this.pagedData = this.pagedData.map(d =>
        dates.some(item => item.date === d.date)
          ? { ...d, available: false }
          : d
      );

    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  };


  openCalendarDates = async (dates: { date: string }[]) => {
    try {
      this.loading = true;
      this.error = null;

      for (const item of dates) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/doorLimits/openDate?date=${item.date}`;
        const payload = {
          date: item.date,
          available: true,
        };

        await this.fetchPatchCalendar(url, payload, "PATCH");

        const updateItem = (arr: CalendarDateItem[]) => {
          const idx = arr.findIndex(d => d.date === item.date);
          if (idx !== -1) {
            arr[idx] = {
              ...arr[idx],
              available: true,
            };
          }
        };

        updateItem(this.allData);
        updateItem(this.pagedData);
      }
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  };


  editCalendarDate = async (
    items: {
      date: string;
      frontDoorQuantity: number;
      inDoorQuantity: number;
      available: boolean;
    }[]
  ) => {
    try {
      for (const item of items) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/doorLimits/editDate`;

        await this.fetchPatchCalendar(url, item);

        const idxAll = this.allData.findIndex(
          d => d.date === item.date
        );

        if (idxAll !== -1) {
          this.allData[idxAll] = {
            ...this.allData[idxAll],
            frontDoorQuantity: item.frontDoorQuantity,
            inDoorQuantity: item.inDoorQuantity,
            available: item.available
          };
        }
        const idxPaged = this.pagedData.findIndex(
          d => d.date === item.date
        );

        if (idxPaged !== -1) {
          this.pagedData[idxPaged] = {
            ...this.pagedData[idxPaged],
            frontDoorQuantity: item.frontDoorQuantity,
            inDoorQuantity: item.inDoorQuantity,
            available: item.available
          };
        }
      }

    } catch (err: any) {
      this.error = err.message;
    }
  };


}

export const calendarStore = new CalendarStore();