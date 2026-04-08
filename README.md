# Fast Door Web

Фронтенд сайта [fast-door.ru](https://fast-door.ru) — сервис по установке и обслуживанию дверей.  
Построен на **Next.js 16** с использованием TypeScript, MobX и SCSS.

---

## Стек технологий

| Категория | Технологии |
|---|---|
| Фреймворк | Next.js 16 (App Router) |
| Язык | TypeScript |
| Стейт-менеджмент | MobX + MobX React Lite |
| Стилизация | SCSS |
| Тестирование | Jest, Testing Library |
| Линтинг | ESLint |
| Процесс-менеджер | PM2 |
| Веб-сервер | Nginx |

---

## Структура проекта

```
fast-door-web/
├── .github/
│   └── workflows/          # CI/CD пайплайны GitHub Actions
├── public/                 # Статические файлы (изображения, иконки)
├── src/                    # Исходный код приложения
├── .gitignore
├── eslint.config.mjs       # Конфигурация ESLint
├── jest.config.ts          # Конфигурация Jest
├── jest.setup.ts           # Настройка тестового окружения
├── next.config.ts          # Конфигурация Next.js
├── package.json
├── tsconfig.json           # Конфигурация TypeScript
└── README.md
```

---

## Установка и запуск локально

### Требования

- Node.js >= 18
- npm >= 9

### Шаги

```bash
# Клонировать репозиторий
git clone https://github.com/nemz768/fast-door-web.git
cd fast-door-web

# Установить зависимости
npm ci

# Запустить dev-сервер (порт 8081)
npm run dev
```

Открыть в браузере: [http://localhost:8081](http://localhost:8081)

---

## Запуск через Docker

### Требования

- Docker Desktop

### Сборка и запуск

```bash
# Создать сеть
docker network create fast-door-network

# Собрать образ
docker build -t fast-door-front .

# Запустить контейнер
docker run -d --name frontend --network fast-door-network -p 8081:3000 fast-door-front
```

Открыть в браузере: [http://localhost:8081](http://localhost:8081)

### Запуск вместе с бэкендом

```bash
# Запустить бэкенд (образ должен быть собран заранее)
docker run -d --name backend --network fast-door-network -p 8080:8080 javaapp

# Запустить фронтенд
docker run -d --name frontend --network fast-door-network -p 8081:3000 fast-door-front
```

Контейнеры находятся в одной сети и видят друг друга по имени — фронт обращается к бэку как `http://backend:8080`.

### Структура Dockerfile

Образ собирается в два этапа:

- **builder** — устанавливает зависимости и собирает Next.js билд
- **runner** — минимальный образ только с файлами необходимыми для запуска

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера на порту 8081 (предварительно прогоняет тесты) |
| `npm run build` | Сборка production-билда |
| `npm run start` | Запуск production-сервера |
| `npm run lint` | Проверка кода линтером |
| `npm test` | Запуск тестов |
| `npm run test:watch` | Запуск тестов в режиме наблюдения |
| `npm run test:coverage` | Запуск тестов с отчётом покрытия |

---

## Зависимости

### Production

| Пакет | Описание |
|---|---|
| `next` | Фреймворк React с SSR/SSG |
| `react` / `react-dom` | React 19 |
| `mobx` / `mobx-react-lite` | Стейт-менеджмент |
| `sass` | SCSS поддержка |
| `@react-input/mask` | Маска ввода для форм |
| `react-select` | Кастомный select компонент |
| `react-calendar` | Компонент календаря |
| `react-loader-spinner` | Спиннеры загрузки |

### Development

| Пакет | Описание |
|---|---|
| `typescript` | Типизация |
| `jest` / `ts-jest` | Тестирование |
| `@testing-library/react` | Тестирование React компонентов |
| `eslint` | Линтер |

---

## CI/CD

Проект использует **GitHub Actions** с разделением по веткам.

### Ветки

| Ветка | Действие |
|---|---|
| `dev` | Запуск тестов при каждом push |
| `main` | Деплой на сервер при каждом push |

### Рабочий процесс

```
dev ──(push)──► тесты (Jest)
  │
  └──(merge в main)──► деплой на сервер
```

### Процесс деплоя на сервере

1. Подключение к серверу по SSH
2. `git pull origin main`
4. `npm ci` — установка зависимостей
5. `npm run build` — сборка Next.js
6. `pm2 restart fast-door-web` — перезапуск процесса
7. `nginx -t && systemctl reload nginx` — перезагрузка Nginx

---

## Продакшн

Сайт доступен по адресу: [https://fast-door.ru](https://fast-door.ru)

Инфраструктура:
- **Nginx** — проксирование запросов
- **PM2** — управление Node.js процессом
- **Ubuntu** — операционная система сервера