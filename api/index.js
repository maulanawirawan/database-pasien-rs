<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monitoring Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f9;
        }
        h1 {
            text-align: center;
            color: #333;
        }
        form {
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        form input, form button {
            display: block;
            width: 100%;
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        form button {
            background-color: #007BFF;
            color: white;
            border: none;
            cursor: pointer;
        }
        form button:hover {
            background-color: #0056b3;
        }
        .list-pasien {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .data-item {
            padding: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
        }
        .room {
            background: #e9f7fe;
            padding: 10px;
            border-radius: 8px;
            margin-top: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .room p {
            margin: 5px 0;
        }
        .delete-btn {
            background-color: red;
            color: white;
            border: none;
            padding: 5px 10px;
            cursor: pointer;
        }
        .delete-btn:hover {
            background-color: darkred;
        }
    </style>
</head>
<body>
    <h1>Monitoring Dashboard</h1>

    <!-- Form to Add Data (Patient) -->
    <form id="form-pasien">
        <input type="text" id="id" placeholder="ID Pasien" required>
        <input type="text" id="nama" placeholder="Nama Pasien" required>
        <input type="number" id="usia" placeholder="Usia Pasien" required>
        <input type="text" id="diagnosa" placeholder="Diagnosa" required>
        <button type="submit">Simpan Data</button>
    </form>

    <div id="rooms-dashboard">
        <h2>Daftar Pasien / Room Monitoring</h2>
        <!-- Real-time data from rooms will be populated here -->
    </div>

    <script>
        const BASE_URL = "https://database-pasien-rssakit.vercel.app/api"; // URL backend Anda

        // Menyimpan Data ke API Backend
        const form = document.getElementById("form-pasien");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const id = document.getElementById("id").value;
            const nama = document.getElementById("nama").value;
            const usia = document.getElementById("usia").value;
            const diagnosa = document.getElementById("diagnosa").value;

            fetch(`${BASE_URL}/pasien`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: id,
                    nama: nama,
                    usia: parseInt(usia),
                    diagnosa: diagnosa
                })
            })
            .then((response) => response.json())
            .then((data) => {
                alert("Data berhasil disimpan!");
                form.reset();
                loadData();
            })
            .catch((error) => console.error("Terjadi kesalahan:", error));
        });

        // Membaca Data dari API Backend (Display All Pasien)
        function loadData() {
            const roomsDashboard = document.getElementById("rooms-dashboard");
            fetch(`${BASE_URL}/pasien`, {
                method: "GET"
            })
            .then((response) => response.json())
            .then((data) => {
                roomsDashboard.innerHTML = "<h2>Daftar Pasien / Room Monitoring</h2>";
                for (let id in data) {
                    const pasien = data[id];
                    const roomElement = document.createElement("div");
                    roomElement.classList.add("room");
                    
                    roomElement.innerHTML = `
                        <h3>Room: ${id}</h3>
                        <p><strong>Nama:</strong> ${pasien.nama}</p>
                        <p><strong>Usia:</strong> ${pasien.usia}</p>
                        <p><strong>Diagnosa:</strong> ${pasien.diagnosa}</p>
                        <button class="delete-btn" onclick="deletePasien(${id})">Hapus</button>
                    `;
                    
                    roomsDashboard.appendChild(roomElement);
                }
            })
            .catch((error) => console.error("Terjadi kesalahan:", error));
        }

        // Fungsi hapus pasien
        function deletePasien(id) {
            fetch(`${BASE_URL}/pasien/${id}`, {
                method: "DELETE"
            })
            .then((response) => response.json())
            .then((data) => {
                alert(`Pasien dengan ID ${id} berhasil dihapus.`);
                loadData();
            })
            .catch((error) => console.error("Terjadi kesalahan:", error));
        }

        // Panggil Load Data saat halaman dimuat
        window.onload = loadData;
    </script>
</body>
</html>
