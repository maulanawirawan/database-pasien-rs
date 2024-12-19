const express = require('express');
const app = express();

// In-memory storage for pasien data (global)
const pasien = {};

// Middleware to parse JSON bodies
app.use(express.json());

// ------------------- Bagian Pasien (Persis Seperti Kode Anda) -------------------

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

// Start the server (sesuai dengan kode Anda, tetap menggunakan app.listen)
const PORT = 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

// ------------------- Bagian Tambahan: Ruangan, Pasien dalam Ruangan, & Sensor -------------------

// In-memory storage untuk data ruangan
// Format:
// dataRuangan = {
//   "ruangan_1": {
//     "nama_ruangan": "ICU",
//     "patients": {
//       "pasien_1": {
//         "nama": "Budi",
//         "usia": 30,
//         "diagnosa": "Demam",
//         "sensors": {
//           "loadcell": { "value": 200, "unit": "ml" },
//           "color_sensor": { "value": "hijau", "detail": "Normal" },
//           "laju_infus": { "value": 20, "unit": "tetes/menit" }
//         }
//       }
//     }
//   }
// }
const dataRuangan = {};

// POST /api/ruangan - Tambah ruangan
app.post('/api/ruangan', (req, res) => {
    const { id, nama_ruangan } = req.body;
    if (!id || !nama_ruangan) {
        return res.status(400).json({ error: 'Data ruangan tidak lengkap' });
    }
    if (dataRuangan[id]) {
        return res.status(400).json({ error: 'Ruangan dengan ID tersebut sudah ada' });
    }
    dataRuangan[id] = {
        nama_ruangan,
        patients: {}
    };
    res.status(201).json({ message: 'Ruangan berhasil ditambahkan', ruangan: dataRuangan[id] });
});

// GET /api/ruangan - Ambil semua ruangan dan pasien di dalamnya
app.get('/api/ruangan', (req, res) => {
    res.status(200).json(dataRuangan);
});

// GET /api/ruangan/:ruanganId - Ambil data satu ruangan
app.get('/api/ruangan/:ruanganId', (req, res) => {
    const { ruanganId } = req.params;
    if (!dataRuangan[ruanganId]) {
        return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    res.status(200).json(dataRuangan[ruanganId]);
});

// POST /api/ruangan/:ruanganId/pasien - Tambah pasien ke dalam ruangan
app.post('/api/ruangan/:ruanganId/pasien', (req, res) => {
    const { ruanganId } = req.params;
    const { id, nama, usia, diagnosa, sensors } = req.body;

    if (!dataRuangan[ruanganId]) {
        return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }

    if (!id || !nama || !usia || !diagnosa) {
        return res.status(400).json({ error: 'Data pasien tidak lengkap' });
    }

    dataRuangan[ruanganId].patients[id] = {
        nama,
        usia,
        diagnosa,
        sensors: sensors || {
            loadcell: { value: 0, unit: "ml" },
            color_sensor: { value: "N/A", detail: "" },
            laju_infus: { value: 0, unit: "tetes/menit" }
        }
    };

    res.status(201).json({
        message: 'Pasien berhasil ditambahkan ke ruangan',
        pasien: dataRuangan[ruanganId].patients[id]
    });
});

// GET /api/ruangan/:ruanganId/pasien - Ambil semua pasien di suatu ruangan
app.get('/api/ruangan/:ruanganId/pasien', (req, res) => {
    const { ruanganId } = req.params;
    if (!dataRuangan[ruanganId]) {
        return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    res.status(200).json(dataRuangan[ruanganId].patients);
});

// GET /api/ruangan/:ruanganId/pasien/:pasienId - Ambil data pasien tertentu di suatu ruangan
app.get('/api/ruangan/:ruanganId/pasien/:pasienId', (req, res) => {
    const { ruanganId, pasienId } = req.params;
    if (!dataRuangan[ruanganId]) {
        return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }
    if (!dataRuangan[ruanganId].patients[pasienId]) {
        return res.status(404).json({ error: 'Pasien tidak ditemukan di ruangan ini' });
    }
    res.status(200).json(dataRuangan[ruanganId].patients[pasienId]);
});

// POST /api/ruangan/:ruanganId/pasien/:pasienId/sensor - Update sensor pasien
app.post('/api/ruangan/:ruanganId/pasien/:pasienId/sensor', (req, res) => {
    const { ruanganId, pasienId } = req.params;
    const { sensors } = req.body;

    if (!dataRuangan[ruanganId]) {
        return res.status(404).json({ error: 'Ruangan tidak ditemukan' });
    }

    if (!dataRuangan[ruanganId].patients[pasienId]) {
        return res.status(404).json({ error: 'Pasien tidak ditemukan di ruangan ini' });
    }

    if (!sensors) {
        return res.status(400).json({ error: 'Data sensor tidak lengkap' });
    }

    dataRuangan[ruanganId].patients[pasienId].sensors = {
        ...dataRuangan[ruanganId].patients[pasienId].sensors,
        ...sensors
    };

    res.status(200).json({
        message: 'Data sensor pasien berhasil diperbarui',
        pasien: dataRuangan[ruanganId].patients[pasienId]
    });
});
