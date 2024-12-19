const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'your_secret_key';

// In-memory storage for users and pasien
const users = {};
const pasien = {};

// Middleware to parse JSON bodies
app.use(express.json());

// Register API
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password diperlukan' });
    }

    if (users[email]) {
        return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users[email] = { password: hashedPassword };

    res.status(201).json({ message: 'Pendaftaran berhasil' });
});

// Login API
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!users[email]) {
        return res.status(401).json({ error: 'Email tidak terdaftar' });
    }

    const isValidPassword = await bcrypt.compare(password, users[email].password);
    if (!isValidPassword) {
        return res.status(401).json({ error: 'Password salah' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware untuk autentikasi
function authenticate(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'Token diperlukan' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token tidak valid' });
        req.user = user;
        next();
    });
}

// POST API: Tambah pasien
app.post('/api/pasien', authenticate, (req, res) => {
    const { id, nama, usia, diagnosa } = req.body;

    if (!id || !nama || !usia || !diagnosa) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    pasien[id] = { nama, usia, diagnosa };
    res.status(201).json({ message: 'Data pasien berhasil ditambahkan', pasien: pasien[id] });
});

// GET API: Ambil semua data pasien
app.get('/api/pasien', authenticate, (req, res) => {
    res.json(pasien);
});

// DELETE API: Hapus data pasien
app.delete('/api/pasien/:id', authenticate, (req, res) => {
    const { id } = req.params;

    if (!pasien[id]) {
        return res.status(404).json({ error: 'Data pasien tidak ditemukan' });
    }

    delete pasien[id];
    res.json({ message: `Data pasien dengan ID ${id} berhasil dihapus` });
});

module.exports = app;
