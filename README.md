# Messenger App

Веб-приложение мессенджера, построенное с использованием TypeScript, Handlebars и Vite.

## Функциональность

- Страницы авторизации и регистрации
- Профиль пользователя
- Чат с сообщениями
- Смена пароля
- Валидация форм
- Роутинг между страницами

## Технологии

- **TypeScript** - типизированный JavaScript
- **Handlebars** - шаблонизатор
- **Vite** - сборщик проекта
- **PostCSS** - обработка CSS
- **ESLint** - линтер для TypeScript
- **Stylelint** - линтер для CSS

## HTTP Transport

Реализован собственный класс `HTTPTransport` для работы с HTTP-запросами:

- Использует только XMLHttpRequest и Promise
- Поддерживает методы GET, POST, PUT, DELETE
- Работа с query параметрами в GET-запросах
- Поддержка body для POST, PUT, DELETE запросов
- Обработка ошибок и таймаутов
- Полная типизация TypeScript

### Пример использования

```typescript
import { HTTPTransport } from './services/HTTPTransport';

const http = new HTTPTransport('https://api.example.com');

// GET запрос с параметрами
const users = await http.get('/users', { page: '1', limit: '10' });

// POST запрос с данными
const newUser = await http.post('/users', { name: 'John', email: 'john@example.com' });

// PUT запрос
const updatedUser = await http.put('/users/1', { name: 'John Updated' });

// DELETE запрос
await http.delete('/users/1');
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Запуск собранного проекта
npm start
```

## Линтинг и проверка кода

```bash
# Проверка TypeScript
npm run type-check

# Проверка ESLint
npm run lint:check

# Автоматическое исправление ESLint
npm run lint

# Проверка Stylelint
npm run stylelint:check

# Автоматическое исправление Stylelint
npm run stylelint

# Запуск всех проверок
npm run lint:all
```

## Структура проекта

```
src/
├── components/          # Компоненты UI
├── pages/              # Страницы приложения
├── services/           # Сервисы (HTTPTransport, валидация)
├── styles/             # CSS стили
├── types/              # TypeScript типы
└── main.ts             # Точка входа
```

## Конфигурация

- **ESLint** - настроен с правилами для TypeScript, включает правила безопасности и качества кода
- **Stylelint** - настроен с правилами для CSS, включает порядок свойств и проверку селекторов
- **EditorConfig** - настройки редактора для единообразия кода
- **TypeScript** - строгая типизация с проверкой типов

## Особенности реализации

1. **HTTPTransport** - собственная реализация HTTP-клиента без использования fetch или axios
2. **Валидация форм** - клиентская валидация с отображением ошибок
3. **Роутинг** - простой роутинг на основе URL
4. **Компонентная архитектура** - переиспользуемые компоненты
5. **Типизация** - полная типизация TypeScript
6. **Линтинг** - строгие правила для поддержания качества кода

