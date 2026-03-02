import { makeAutoObservable } from "mobx";

export interface CalendarDateItem {
  [x: string]: any;
  id: number;
  limitDate: string;
  frontDoorQuantity: number;
  inDoorQuantity: number;
  availability: boolean;
  orders: any[];
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

      const url =
        `${process.env.NEXT_PUBLIC_API_URL}/orders/allDays` +
        `?page=${page}&size=${size}&sortBy=${sortBy}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      this.pagedData = result.content;
      this.totalPages = result.totalPages;
      this.totalElements = result.totalElements;

      return result.content;
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
        const url =
          `${process.env.NEXT_PUBLIC_API_URL}/doorLimits/allDays?page=${page}&size=100`;

        const response = await fetch(url);

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

      for (const item of dates) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/doorLimits/closeDate?date=${item.date}`;
        const payload = {
          date: item.date,
          availability: false, 
        };

        await this.fetchPatchCalendar(url, payload, "PATCH");

        const idxAll = this.allData.findIndex(d => d.limitDate === item.date);
        if (idxAll !== -1) {
          this.allData[idxAll] = {
            ...this.allData[idxAll],
            availability: false,
          };
        }

        const idxPaged = this.pagedData.findIndex(d => d.limitDate === item.date);
        if (idxPaged !== -1) {
          this.pagedData[idxPaged] = {
            ...this.pagedData[idxPaged],
            availability: false,
          };
        }
      }

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
          availability: true,
        };

        await this.fetchPatchCalendar(url, payload, "PATCH");

        const updateItem = (arr: CalendarDateItem[]) => {
          const idx = arr.findIndex(d => d.limitDate === item.date);
          if (idx !== -1) {
            arr[idx] = {
              ...arr[idx],
              availability: true,
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
  }[]
) => {
  try {
    this.loading = true;
    this.error = null;

    for (const item of items) {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/doorLimits/editDate`;

      await this.fetchPatchCalendar(url, item);
      
      const idxAll = this.allData.findIndex(
        d => d.limitDate === item.date
      );

      if (idxAll !== -1) {
        this.allData[idxAll] = {
          ...this.allData[idxAll],
          frontDoorQuantity: item.frontDoorQuantity,
          inDoorQuantity: item.inDoorQuantity
        };
      }
      const idxPaged = this.pagedData.findIndex(
        d => d.limitDate === item.date
      );

      if (idxPaged !== -1) {
        this.pagedData[idxPaged] = {
          ...this.pagedData[idxPaged],
          frontDoorQuantity: item.frontDoorQuantity,
          inDoorQuantity: item.inDoorQuantity
        };
      }
    }

  } catch (err: any) {
    this.error = err.message;
  } finally {
    this.loading = false;
  }
};


}

export const calendarStore = new CalendarStore();