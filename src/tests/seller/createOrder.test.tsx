import { OrderStore } from "@/stores/orderStore";
import { calendarStore } from "@/stores/calendarStore";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("OrderStore validation and creation", () => {
  let store: OrderStore;

  beforeEach(() => {
    store = new OrderStore();

    calendarStore.allData = [
      {
        date: "2026-04-10",
        frontDoorQuantity: 2,
        inDoorQuantity: 3,
        available: true,
        id: 0,
      },
    ];
  });

  const fillValidData = () => {
    store.setField("fullName", "Иван Иванов");
    store.setField("address", "Москва");
    store.setField("phone", "+7 (999) 123-45-67");
    store.setField("dateOrder", "2026-04-10");
    store.setField("frontDoorQuantity", 1);
    store.setField("inDoorQuantity", 1);
  };

  test("ошибка если fullName пустой", () => {
    fillValidData();
    store.setField("fullName", "");
    const result = store.validateForm();
    expect(result).toBe(false);
    expect(store.errors.fullName).toBe("Поле обязательно");
  });

  test("ошибка если телефон невалидный", () => {
    fillValidData();
    store.setField("phone", "+7 (999)");
    store.validateForm();
    expect(store.errors.phone).toBe("Некорректный формат");
  });

  test("ошибка если дата не выбрана", () => {
    fillValidData();
    store.setField("dateOrder", "");
    store.validateForm();
    expect(store.errors.dateOrder).toBe("Поле обязательно");
  });

  test("ошибка если ввод количества без даты", () => {
    store.setField("frontDoorQuantity", 1);
    store.setField("inDoorQuantity", 1);
    store.validateForm();
    expect(store.errors.frontDoorQuantity).toBe("Выберите дату перед вводом количества");
    expect(store.errors.inDoorQuantity).toBe("Выберите дату перед вводом количества");
  });

  test("ошибка если обе двери = 0", () => {
    fillValidData();
    store.setField("frontDoorQuantity", 0);
    store.setField("inDoorQuantity", 0);
    store.validateForm();
    expect(store.errors.frontDoorQuantity).toBe("Нельзя отправить значение 0");
    expect(store.errors.inDoorQuantity).toBe("Нельзя отправить значение 0");
  });

  test("ошибка если превышен лимит входных дверей", () => {
    fillValidData();
    store.setField("frontDoorQuantity", 5);
    store.validateForm();
    expect(store.errors.frontDoorQuantity).toBe("Максимум 2 на выбранную дату");
  });

  test("валидная форма возвращает true", () => {
    fillValidData();
    const result = store.validateForm();
    expect(result).toBe(true);
    expect(store.errors).toEqual({});
  });

  test("если дата есть, но нет в календаре — лимиты не применяются", () => {
    fillValidData();
    store.setField("dateOrder", "2026-04-20"); // нет в calendarStore
    store.setField("frontDoorQuantity", 50);
    store.validateForm();
    expect(store.errors.frontDoorQuantity).toBeUndefined();
  });

  // Попытка создания заказа (mock fetch)
  test("создание заказа возвращает успешный ответ", async () => {
    fillValidData();

    // Мокаем fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 123, message: "Заказ создан" }),
      } as Response)
    );

    const data = await store.postOrderData(store.payload);

    expect(data).toEqual({ id: 123, message: "Заказ создан" });
    expect(store.success).toBe("Заказ успешно создан");
    expect(store.error).toBeNull();
    expect(store.loading).toBe(false);
  });

  test("создание заказа при ошибке сервера возвращает ошибку", async () => {
    fillValidData();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: "Ошибка сервера" }),
      } as Response)
    );

    const data = await store.postOrderData(store.payload);

    expect(data).toBeUndefined();
    expect(store.error).toBe("Не удалось создать заказ: 500");
  });

  test("создание заказа при сетевой ошибке", async () => {
    fillValidData();

    global.fetch = jest.fn(() => Promise.reject(new Error("network error")));

    const data = await store.postOrderData(store.payload);

    expect(data).toBeNull();
    expect(store.error).toBe("network error");
  });
});