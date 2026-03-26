const fs = require('fs');

class Book {
    constructor(id, title, author, isbn) {
        this._id = id;
        this._title = title;
        this._author = author;
        this._isbn = isbn;
    }
    get title() { return this._title; }
    get isbn() { return this._isbn; }
    static isValid(isbn) { return typeof isbn === 'string' && isbn.length >= 3; }

    toJSON() {
        return {
            id: this._id,
            title: this._title,
            author: this._author,
            isbn: this._isbn
        };
    }
}

class User {
    constructor(fName, lName, card) {
        this.fName = fName;
        this.lName = lName;
        this.card = card;
        this.books = [];
    }
}

class Library {
    constructor() {
        this._books = [];
        this._users = [];
        this._inv = {};
        this.load();
    }

    load() {
        if (fs.existsSync('books.json')) {
            try {
                const data = JSON.parse(fs.readFileSync('books.json', 'utf8'));
                this._books = data.list || [];
                this._inv = data.inventory || {};
            } catch (e) { console.log("Ошибка чтения книг"); }
        }
        if (fs.existsSync('users.json')) {
            try {
                this._users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
            } catch (e) { console.log("Ошибка чтения пользователей"); }
        }
    }

    saveBooks() {
        fs.writeFileSync('books.json', JSON.stringify({ list: this._books, inventory: this._inv }, null, 2));
    }

    saveUsers() {
        fs.writeFileSync('users.json', JSON.stringify(this._users, null, 2));
    }

    addBook(t, a, i, n = 1) {
        if (!Book.isValid(i)) return console.log("Ошибка: Неверный ISBN");
        if (!this._books.find(b => b.isbn === i)) {
            this._books.push(new Book(Date.now(), t, a, i).toJSON());
        }
        this._inv[i] = (this._inv[i] || 0) + parseInt(n);
        this.saveBooks();
        console.log(`Добавлено: ${t}`);
    }

    addUser(f, l, c) {
        this._users.push(new User(f, l, c));
        this.saveUsers();
        console.log(`Пользователь ${l} зарегистрирован`);
    }

    issue(isbn, card) {
        const u = this._users.find(u => u.card === card);
        if (u && this._inv[isbn] > 0) {
            this._inv[isbn]--;
            u.books.push(isbn);
            this.saveBooks();
            this.saveUsers();
            console.log(`Книга ${isbn} выдана пользователю ${card}`);
        } else {
            console.log("Ошибка: Книги нет или юзер не найден");
        }
    }

    list() {
        console.log("\n--- КНИЖНЫЙ ФОНД ---");
        this._books.forEach(b => {
            console.log(`${b.isbn} | "${b.title}" | В наличии: ${this._inv[b.isbn]}`);
        });
    }
}

const lib = new Library();
const [, , cmd, ...args] = process.argv;

switch (cmd) {
    case 'add':
        lib.addBook(args[0], args[1], args[2], args[3]);
        break;
    case 'adduser':
        lib.addUser(args[0], args[1], args[2]);
        break;
    case 'issue':
        lib.issue(args[0], args[1]);
        break;
    case 'list':
        lib.list();
        break;
    default:
        console.log("Доступные команды: add, adduser, issue, list");
}