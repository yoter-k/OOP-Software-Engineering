const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

class Book {
    constructor(id, title, author, isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            isbn: this.isbn
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

    toJSON() {
        return {
            fName: this.fName,
            lName: this.lName,
            card: this.card,
            books: this.books
        };
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
            const data = JSON.parse(fs.readFileSync('books.json', 'utf8'));
            this._books = data.list || [];
            this._inv = data.inventory || {};
        }

        if (fs.existsSync('users.json')) {
            const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
            this._users = Array.isArray(data) ? data : (data.users || []);
        }
    }

    saveBooks() {
        fs.writeFileSync(
            'books.json',
            JSON.stringify({ list: this._books, inventory: this._inv }, null, 2)
        );
    }

    saveUsers() {
        fs.writeFileSync(
            'users.json',
            JSON.stringify(this._users, null, 2)
        );
    }

    addBook(title, author, isbn, count = 1) {
        if (!title || !author || !isbn) return { error: 'Не все поля заполнены' };

        if (!this._books.find(b => b.isbn === isbn)) {
            this._books.push(new Book(Date.now(), title, author, isbn).toJSON());
        }

        this._inv[isbn] = (this._inv[isbn] || 0) + Number(count);
        this.saveBooks();

        return { message: 'Книга добавлена', inventory: this._inv[isbn] };
    }

    addUser(fName, lName, card) {
        if (!fName || !lName || !card) return { error: 'Не все поля заполнены' };

        this._users.push(new User(fName, lName, card).toJSON());
        this.saveUsers();

        return { message: 'Пользователь добавлен' };
    }

    issue(isbn, card) {
        const user = this._users.find(u => u.card === card);
        if (!user) return { error: 'Пользователь не найден' };
        if (!this._inv[isbn] || this._inv[isbn] <= 0) return { error: 'Книга недоступна' };

        user.books.push(isbn);
        this._inv[isbn]--;
        this.saveBooks();
        this.saveUsers();

        return { message: 'Книга выдана', remain: this._inv[isbn] };
    }

    updateBook(isbn, title, author, count) {
        const book = this._books.find(b => b.isbn === isbn);
        if (!book) return { error: 'Книга не найдена' };

        if (title) book.title = title;
        if (author) book.author = author;
        if (count !== undefined) this._inv[isbn] = Number(count);

        this.saveBooks();
        return { message: 'Книга обновлена', book, inventory: this._inv[isbn] || 0 };
    }

    deleteBook(isbn) {
        const index = this._books.findIndex(b => b.isbn === isbn);
        if (index === -1) return { error: 'Книга не найдена' };

        this._books.splice(index, 1);
        delete this._inv[isbn];
        this.saveBooks();

        return { message: 'Книга удалена' };
    }

    getBooks() {
        return { list: this._books, inventory: this._inv };
    }

    getBookByISBN(isbn) {
        const book = this._books.find(b => b.isbn === isbn);
        if (!book) return { error: 'Книга не найдена' };

        return { book, inventory: this._inv[isbn] || 0 };
    }

    searchBooks(query) {
        let result = [...this._books];

        if (query.title) {
            const t = query.title.toLowerCase();
            result = result.filter(b => b.title.toLowerCase().includes(t));
        }

        if (query.author) {
            const a = query.author.toLowerCase();
            result = result.filter(b => b.author.toLowerCase().includes(a));
        }

        return { list: result, count: result.length };
    }

    getUsers() {
        return { users: this._users };
    }
}

const lib = new Library();

app.get('/books', (req, res) => {
    if (req.query.title || req.query.author) {
        return res.json(lib.searchBooks(req.query));
    }
    res.json(lib.getBooks());
});

app.get('/books/:isbn', (req, res) => {
    res.json(lib.getBookByISBN(req.params.isbn));
});

app.get('/users', (req, res) => {
    res.json(lib.getUsers());
});

app.post('/books', (req, res) => {
    const { title, author, isbn, count } = req.body;
    res.json(lib.addBook(title, author, isbn, count));
});

app.post('/users', (req, res) => {
    const { fName, lName, card } = req.body;
    res.json(lib.addUser(fName, lName, card));
});

app.post('/issue', (req, res) => {
    const { isbn, card } = req.body;
    res.json(lib.issue(isbn, card));
});

app.put('/books/:isbn', (req, res) => {
    const { title, author, count } = req.body;
    res.json(lib.updateBook(req.params.isbn, title, author, count));
});

app.delete('/books/:isbn', (req, res) => {
    res.json(lib.deleteBook(req.params.isbn));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});