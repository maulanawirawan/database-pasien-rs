const express = require('express');
const app = express();

// In-memory storage for pasien data
const pasien = {};

// Middleware to parse JSON bodies
app.use(express.json());

// POST API: Tambah pasien
app.post('/api/pasien', (req, res) => {
    const { id, nama, usia, diagnosa } = req.body;

    if (!id || !nama || !usia || !diagnosa) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    pasien[id] = { nama, usia, diagnosa };
    res.status(201).json({
        message: 'Data pasien berhasil ditambahkan',
        pasien: pasien[id]
    });
});

// GET API: Ambil semua data pasien
app.get('/api/pasien', (req, res) => {
    res.status(200).json(pasien);
});

// GET API: Ambil pasien berdasarkan ID
app.get('/api/pasien/:id', (req, res) => {
    const { id } = req.params;
    if (!pasien[id]) {
        return res.status(404).json({ error: 'Data pasien tidak ditemukan' });
    }
    res.status(200).json(pasien[id]);
});

// DELETE API: Hapus pasien berdasarkan ID
app.delete('/api/pasien/:id', (req, res) => {
    const { id } = req.params;
    if (!pasien[id]) {
        return res.status(404).json({ error: 'Data pasien tidak ditemukan' });
    }
    delete pasien[id];
    res.status(200).json({ message: `Data pasien dengan ID ${id} berhasil dihapus` });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

