import { AuthStore } from "@/stores/authStore";

describe("AuthStore", () => {
  let store: AuthStore;

  beforeEach(() => {
    store = new AuthStore();
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  describe("validateCredentials", () => {
    test("возвращает false если логин пустой", () => {
      const result = store.validateCredentials({ username: "", password: "1234" });
      expect(result).toBe(false);
      expect(store.validationErrors.username).toBe("введите логин");
    });

    test("возвращает false если логин меньше 3 символов", () => {
      const result = store.validateCredentials({ username: "ab", password: "1234" });
      expect(result).toBe(false);
      expect(store.validationErrors.username).toBe("логин должен содержать минимум 3 символа");
    });

    test("возвращает false если логин содержит запрещенные символы", () => {
      const result = store.validateCredentials({ username: "user@123", password: "1234" });
      expect(result).toBe(false);
      expect(store.validationErrors.username).toBe("логин может содержать только буквы, цифры, дефис и подчеркивание");
    });

    test("возвращает false если пароль пустой", () => {
      const result = store.validateCredentials({ username: "user", password: "" });
      expect(result).toBe(false);
      expect(store.validationErrors.password).toBe("введите пароль");
    });

    test("возвращает false если пароль меньше 4 символов", () => {
      const result = store.validateCredentials({ username: "user", password: "123" });
      expect(result).toBe(false);
      expect(store.validationErrors.password).toBe("пароль должен содержать минимум 4 символа");
    });

    test("возвращает true если данные корректны", () => {
      const result = store.validateCredentials({ username: "user_123", password: "1234" });
      expect(result).toBe(true);
      expect(store.validationErrors).toEqual({});
    });
  });


  test("login успешно устанавливает user", async () => {
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ role: "ADMIN" }),
    } as any);

    const promise = store.login({ username: "user", password: "1234" });

    expect(store.isLoading).toBe(true);

    const result = await promise;

    expect(result).toEqual({ role: "ADMIN" });
    expect(store.user).toEqual({ role: "ADMIN" });
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

test("login 401 устанавливает правильную ошибку", async () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  mockedFetch.mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: async () => ({}),
    text: async () => "",
  } as any);

  try {
    await store.login({ username: "user", password: "1234" });
  } catch (err) {

  }

  expect(store.error).toBe("неверные учетные данные. проверьте логин и пароль");
  expect(store.isLoading).toBe(false);
});

test("login 400 устанавливает правильную ошибку", async () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  mockedFetch.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: async () => ({}),
    text: async () => "",
  } as any);

  try {
    await store.login({ username: "user", password: "1234" });
  } catch (err) {
   
  }

  expect(store.error).toBe("некорректные данные. попробуйте снова");
  expect(store.isLoading).toBe(false);
});

test("login network error", async () => {
  const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

  mockedFetch.mockRejectedValueOnce(new Error("network error"));

  try {
    await store.login({ username: "user", password: "1234" });
  } catch (err) {
    
  }

  expect(store.error).toBe("ошибка подключения.");
  expect(store.isLoading).toBe(false);
});

  test("login не вызывает fetch если данные невалидные", async () => {
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

    const invalidCredentials = { username: "", password: "123" };
    const valid = store.validateCredentials(invalidCredentials);
    expect(valid).toBe(false);

    await expect(store.login(invalidCredentials)).rejects.toThrow();
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  test("login использует URL из NEXT_PUBLIC_API_URL", async () => {
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;
    process.env.NEXT_PUBLIC_API_URL = "https://fast-door.ru/api";

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ role: "ADMIN" }),
    } as any);

    await store.login({ username: "user", password: "1234" });

    expect(mockedFetch).toHaveBeenCalledWith(
      "https://fast-door.ru/api/login",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username: "user", password: "1234" }),
      })
    );
  });

  test("logout очищает пользователя", async () => {
    store.user = { role: "ADMIN" };
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

    mockedFetch.mockResolvedValueOnce({ text: async () => "ok" } as any);

    await store.logout();

    expect(store.user).toBeNull();
    expect(store.isLoggedIn()).toBe(false);
  });

  test("checkRoleSession возвращает true если сессия активна", async () => {
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ loggedIn: true, role: "MANAGER" }),
    } as any);

    const result = await store.checkRoleSession();

    expect(result).toBe(true);
    expect(store.user).toEqual({ role: "MANAGER" });
    expect(store.isLoading).toBe(false);
  });

  test("checkRoleSession возвращает false если не залогинен", async () => {
    const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ loggedIn: false }),
    } as any);

    const result = await store.checkRoleSession();

    expect(result).toBe(false);
    expect(store.user).toBeNull();
  });
});