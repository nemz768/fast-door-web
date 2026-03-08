import { makeAutoObservable, runInAction } from 'mobx';

export class AuthStore {
  user: any = null;
  isLoading = false;
  error: string | null = null;
  validationErrors: { username?: string; password?: string } = {};
  success: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  login = async (credentials: { username: string; password: string, rememberMe: boolean }) => {
    if (!this.validateCredentials(credentials)) {
      throw new Error("Некорректные данные, валидация не пройдена");
    }

    runInAction(() => {
      this.isLoading = true;
      this.error = null;
      this.success = null;
    });

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        runInAction(() => {
          if (response.status === 401) {
            this.error = "Неверные учетные данные, проверьте логин и пароль";
          } else if (response.status === 400) {
            this.error = "Некорректные данные, попробуйте снова";
          } else {
            this.error = "Ошибка при входе, попробуйте позже";
          }
        });
        throw new Error(`http error! status: ${response.status}`);
      }

      const data = await response.json();
      this.success = "Успешный вход";
      runInAction(() => {
        this.user = data;
      });
      return data;
    } catch (err: any) {
      runInAction(() => {
        if (!this.error) this.error = "Ошибка подключения, проверьте соединение и попробуйте снова";
      });
      throw err;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  validateCredentials = (credentials: { username: string; password: string }) => {
    this.validationErrors = {};

    if (!credentials.username.trim()) {
      this.validationErrors.username = 'введите логин';
    } else if (credentials.username.trim().length < 3) {
      this.validationErrors.username = 'логин должен содержать минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(credentials.username)) {
      this.validationErrors.username = 'логин может содержать только латиницу, цифры, дефис и подчеркивание';
    }

    if (!credentials.password.trim()) {
      this.validationErrors.password = 'введите пароль';
    } else if (credentials.password.length < 4) {
      this.validationErrors.password = 'пароль должен содержать минимум 4 символа';
    }

    return Object.keys(this.validationErrors).length === 0;
  };


  checkRoleSession = async () => {
    runInAction(() => { this.isLoading = true; this.error = null; });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check-session`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();

      runInAction(() => {
        if (response.ok && data.loggedIn) {
          this.user = { role: data.role };
          console.log("active session found, role:", data.role);
        } else {
          this.user = null;
          console.log("no active session or loggedIn false");
        }
        this.isLoading = false;
      });

      return !!data.loggedIn;
    } catch (err: any) {
      runInAction(() => {
        this.user = null;
        this.error = err.message;
        this.isLoading = false;
      });
      console.error("error checking session:", err);
      return false;
    }
  };

  logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.text();
      console.log("logout response:", data);
    } catch (error) {
      console.error("logout failed:", error);
    } finally {
      this.user = null;
      this.isLoading = false;
      this.error = null;
    }
  };

  getUserRole = () => {
    return this.user?.role || null;
  };

  isLoggedIn = () => {
    return this.user !== null;
  };
}

export const authStore = new AuthStore();