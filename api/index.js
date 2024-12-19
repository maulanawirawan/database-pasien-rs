// File utama backend 
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const pasien = {
    "12345": { nama: "John Doe", usia: 30, diagnosa: "Demam" },
    "67890": { nama: "Jane Smith", usia: 25, diagnosa: "Flu" }
};

app.get("/pasien", (req, res) => res.json(pasien));

app.listen(5000, () => console.log("Server berjalan di port 5000"));
