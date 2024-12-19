const express = require('express');
const app = express();
app.use(express.json());

const pasien = {};

// POST API: Tambah Data Pasien
app.post('/api/pasien', (req, res) => {
    const { id, nama, usia, diagnosa } = req.body;
    if (!id || !nama || !usia || !diagnosa) {
        return res.status(400).json({ error: 'Data tidak lengkap' });
    }
    pasien[id] = { nama, usia, diagnosa };
    res.status(201).json({ message: 'Data pasien berhasil ditambahkan', pasien: pasien[id] });
});

app.listen(5000, () => console.log('Server berjalan di port 5000'));
