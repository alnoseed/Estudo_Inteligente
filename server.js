
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

const users = [];
const SECRET = 'secreto123';

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const user = { id: users.length + 1, username, password };
    users.push(user);
    res.json({ message: 'Registrado com sucesso!' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas.' });
    }
});

app.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        res.json(user);
    });
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
