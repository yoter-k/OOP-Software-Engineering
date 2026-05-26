const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

function loadGames() {
    try {
        const filePath = path.join(__dirname, 'data', 'games.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function loadUsers() {
    try {
        const filePath = path.join(__dirname, 'data', 'users.json');
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]', 'utf8');
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

function saveUsers(users) {
    try {
        const filePath = path.join(__dirname, 'data', 'users.json');
        fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (err) {
        console.error('Error saving users:', err.message);
    }
}

function getCurrentUser(req) {
    const sessionUser = req.cookies.user_session;
    if (!sessionUser) return null;

    const users = loadUsers();
    const user = users.find(u => u.username === sessionUser);
    return user ? { username: user.username, role: user.role, favorites: user.favorites || [] } : null;
}

app.get('/', (req, res) => {
    const user = getCurrentUser(req);
    const games = loadGames();

    const genres = [...new Set(games.map(g => g.genre))];

    res.render('index', {
        title: 'Игровой Атлас - Справочник Лучших Игр',
        gamesCount: games.length,
        genres: genres,
        games: games,
        user: user
    });
});

app.get('/login', (req, res) => {
    if (getCurrentUser(req)) return res.redirect('/');
    res.render('login', {
        title: 'Авторизация - Игровой Атлас',
        error: null,
        user: null
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();

    const matchedUser = users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());

    if (matchedUser && matchedUser.passwordHash === hashPassword(password)) {

        res.cookie('user_session', matchedUser.username, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        return res.redirect('/');
    } else {
        res.render('login', {
            title: 'Авторизация - Игровой Атлас',
            error: 'Неверное имя пользователя или пароль.',
            user: null
        });
    }
});

app.get('/register', (req, res) => {
    if (getCurrentUser(req)) return res.redirect('/');
    res.render('register', {
        title: 'Регистрация - Игровой Атлас',
        error: null,
        user: null
    });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
        return res.render('register', {
            title: 'Регистрация - Игровой Атлас',
            error: 'Пожалуйста, заполните все поля.',
            user: null
        });
    }

    const users = loadUsers();
    const userExists = users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase());

    if (userExists) {
        return res.render('register', {
            title: 'Регистрация - Игровой Атлас',
            error: 'Пользователь с таким именем уже существует.',
            user: null
        });
    }

    const newUser = {
        username: cleanUsername,
        role: 'Пользователь',
        favorites: [],
        passwordHash: hashPassword(password)
    };

    users.push(newUser);
    saveUsers(users);

    res.cookie('user_session', newUser.username, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    res.clearCookie('user_session');
    res.redirect('/');
});

app.get('/users', (req, res) => {
    const user = getCurrentUser(req);

    if (!user || user.role !== 'Администратор') {
        return res.status(403).render('login', {
            title: 'Доступ запрещен',
            error: 'Доступ ограничен. Данная страница доступна только для пользователей с ролью "Администратор".',
            user: null
        });
    }

    const usersList = loadUsers();
    res.render('users', {
        title: 'База пользователей - Игровой Атлас',
        usersList: usersList,
        user: user
    });
});

app.get('/add-game', (req, res) => {
    const user = getCurrentUser(req);

    if (!user || user.role !== 'Администратор') {
        return res.status(403).render('login', {
            title: 'Доступ запрещен',
            error: 'Доступ ограничен. Данная страница доступна только для пользователей с ролью "Администратор".',
            user: null
        });
    }

    res.render('add_game', {
        title: 'Добавить игру - Игровой Атлас',
        error: null,
        success: null,
        user: user
    });
});

app.post('/add-game', (req, res) => {
    const user = getCurrentUser(req);

    if (!user || user.role !== 'Администратор') {
        return res.status(403).send('Forbidden');
    }

    const { title, genre, developer, release_year, rating, user_rating, description } = req.body;

    if (!title || !genre || !developer || !release_year || !rating || !user_rating || !description) {
        return res.render('add_game', {
            title: 'Добавить игру - Игровой Атлас',
            error: 'Пожалуйста, заполните все поля формы.',
            success: null,
            user: user
        });
    }

    const games = loadGames();

    const maxId = games.reduce((max, g) => g.id > max ? g.id : max, 0);
    const newId = maxId + 1;

    const newGame = {
        id: newId,
        title: title.trim(),
        genre: genre.trim(),
        developer: developer.trim(),
        release_year: parseInt(release_year, 10),
        rating: parseFloat(rating),
        user_rating: parseFloat(user_rating),
        image: '/public/images/default.png',
        description: description.trim()
    };

    games.push(newGame);

    try {
        const filePath = path.join(__dirname, 'data', 'games.json');
        fs.writeFileSync(filePath, JSON.stringify(games, null, 2), 'utf8');

        return res.redirect(`/data?id=${newId}`);
    } catch (err) {
        return res.render('add_game', {
            title: 'Добавить игру - Игровой Атлас',
            error: 'Произошла ошибка записи в базу данных: ' + err.message,
            success: null,
            user: user
        });
    }
});

app.get('/data', (req, res) => {
    const user = getCurrentUser(req);

    if (!user) {
        return res.render('login', {
            title: 'Авторизация требуется',
            error: 'Для доступа к справочным данным необходимо авторизоваться в системе.',
            user: null
        });
    }

    const games = loadGames();
    const query = req.query;

    if (query.random === 'true') {
        if (games.length === 0) {
            return res.render('result', { type: 'single', game: null, error: 'В базе данных нет игр.', user });
        }
        const randomIndex = Math.floor(Math.random() * games.length);
        const randomGame = games[randomIndex];
        return res.render('result', {
            title: `Случайная игра: ${randomGame.title}`,
            type: 'single',
            game: randomGame,
            user
        });
    }

    if (query.id) {
        const searchId = parseInt(query.id, 10);
        const foundGame = games.find(g => g.id === searchId);
        if (!foundGame) {
            return res.render('result', {
                title: 'Игра не найдена',
                type: 'single',
                game: null,
                error: `Игра с указанным ID (${query.id}) не найдена в базе данных.`,
                user
            });
        }
        return res.render('result', {
            title: `Игра #${foundGame.id}: ${foundGame.title}`,
            type: 'single',
            game: foundGame,
            user
        });
    }

    let resultList = [...games];
    let activeFilter = 'all';

    if (query.genre && query.genre !== 'all') {
        resultList = resultList.filter(g => g.genre.toLowerCase() === query.genre.toLowerCase());
        activeFilter = query.genre;
    }

    const sortBy = query.sortBy || 'id';
    const sortDir = query.sortDir || 'asc';

    resultList.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    const genres = [...new Set(games.map(g => g.genre))];
    res.render('result', {
        title: 'Результаты запроса - Игровой Атлас',
        type: 'list',
        games: resultList,
        activeFilter: activeFilter,
        sortBy: sortBy,
        sortDir: sortDir,
        genres: genres,
        user
    });
});

app.get('/profile', (req, res) => {
    const user = getCurrentUser(req);
    if (!user) return res.redirect('/login');

    const games = loadGames();
    const favoriteIds = user.favorites || [];
    const favoriteGames = games.filter(g => favoriteIds.includes(g.id));

    res.render('profile', {
        title: 'Личный кабинет - Игровой Атлас',
        favoriteGames: favoriteGames,
        user: user
    });
});

app.post('/favorites/toggle', (req, res) => {
    const user = getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const gameId = parseInt(req.body.gameId, 10);
    if (isNaN(gameId)) return res.status(400).json({ error: 'Invalid game ID' });

    const users = loadUsers();
    const matchedUser = users.find(u => u.username === user.username);
    if (!matchedUser) return res.status(404).json({ error: 'User not found' });

    if (!matchedUser.favorites) matchedUser.favorites = [];

    const index = matchedUser.favorites.indexOf(gameId);
    let favorited = false;
    if (index > -1) {
        matchedUser.favorites.splice(index, 1);
    } else {
        matchedUser.favorites.push(gameId);
        favorited = true;
    }

    saveUsers(users);
    res.json({ success: true, favorited: favorited });
});

app.use((req, res) => {
    res.status(404).send('<h1>404 - Страница не найдена</h1><p><a href="/">Вернуться на главную</a></p>');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
