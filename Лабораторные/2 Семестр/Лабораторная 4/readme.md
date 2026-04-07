# Лабораторная работа №4


## Особенности реализации

| Действие | Метод | URL |
| :--- | :--- | :--- |
| Получить список книг | `GET` | `http://localhost:3000/books` |
| Поиск книг по автору или названию | `GET` | `http://localhost:3000/books?author=Роулинг` |
| Получить книгу по ISBN | `GET` | `http://localhost:3000/books/555-133` |
| Получить список пользователей | `GET` | `http://localhost:3000/users` |
| Добавить книгу | `POST` | `http://localhost:3000/books` |
| Добавить пользователя | `POST` | `http://localhost:3000/users` |
| Выдать книгу | `POST` | `http://localhost:3000/issue` |
| Изменить книгу | `PUT` | `http://localhost:3000/books/555-133` |
| Удалить книгу | `DELETE` | `http://localhost:3000/books/555-133` |

---

<br>
<br>



# Примеры выполнения в Thunder Client
## 1. Добавление книги

Метод: POST
URL:
```
http://localhost:3000/books
```

Body → JSON:
```json
{
  "title": "Гарри Поттер",
  "author": "Роулинг",
  "isbn": "555-133",
  "count": 10
}
```

## 2. Добавление пользователя

Метод: `POST` 
URL:

```bash
http://localhost:3000/users
```

Body → JSON:
```json
{
  "fName": "Иван",
  "lName": "Иванов",
  "card": "CARD-1"
}
```

## 3. Выдача книги пользователю

Метод: POST
URL:

```
http://localhost:3000/issue
```

Body → JSON:
``` json
{
  "isbn": "555-133",
  "card": "CARD-1"
}
```
## 4. Просмотр списка книг

Метод: GET
URL:
```
http://localhost:3000/books
```
**Ответ:**
```json
{
  "list": [
    {
      "id": 1775378221538,
      "title": "Гарри Поттер",
      "author": "Роулинг",
      "isbn": "555-133"
    }
  ],
  "inventory": {
    "555-133": 9
  }
}
```
## 5. Поиск книг по автору

Метод: GET
URL:
```
http://localhost:3000/books?author=Роулинг
```
## 6. Получение книги по ISBN

Метод: GET
URL:
```
http://localhost:3000/books/555-133
```
## 7. Изменение книги

Метод: PUT
URL:
```
http://localhost:3000/books/555-133
```
Body → JSON:
```json
{
  "title": "Гарри Поттер 2",
  "count": 12
}
```
## 8. Удаление книги

Метод: DELETE
URL:
```
http://localhost:3000/books/555-133
```
Структура данных <br>
`books.json` Содержит список книг и количество экземпляров на складе.
```json
{
  "list": [
    {
      "id": 1775378221538,
      "title": "Гарри Поттер",
      "author": "Роулинг",
      "isbn": "555-133"
    }
  ],
  "inventory": {
    "555-133": 9
  }
}
```

`users.json`
Содержит список пользователей и книги, которые у них находятся.
```json
[
  {
    "fName": "Иван",
    "lName": "Иванов",
    "card": "CARD-1",
    "books": ["555-133"]
  }
]
```


