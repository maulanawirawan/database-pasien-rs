const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory storage for pasien
const pasien = {};

// POST API: Add new pasien data
app.post('/api/pasien', (req, res) => {
    const { id, nama, usia, diagnosa } = req.body;

    // Validate the incoming request
    if (!id || !nama || !usia || !diagnosa) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    // Save pasien data
    pasien[id] = { nama, usia, diagnosa };
    res.status(201).json({
        message: 'Data pasien berhasil ditambahkan',
        pasien: pasien[id]
    });
});

// GET API: Retrieve all pasien data
app.get('/api/pasien', (req, res) => {
    res.status(200).json(pasien);
});

// GET API: Retrieve specific pasien data by ID
app.get('/api/pasien/:id', (req, res) => {
    const { id } = req.params;

    if (!pasien[id]) {
        return res.status(404).json({ error: 'Data pasien tidak ditemukan' });
    }

    res.status(200).json(pasien[id]);
});

// DELETE API: Delete pasien data by ID
app.delete('/api/pasien/:id', (req, res) => {
    const { id } = req.params;

    if (!pasien[id]) {
        return res.status(404).json({ error: 'Data pasien tidak ditemukan' });
    }

    delete pasien[id];
    res.status(200).json({ message: 'Data pasien berhasil dihapus' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
