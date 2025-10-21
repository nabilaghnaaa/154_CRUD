const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Banjarmasin67.",
  database: "mahasiswa",
  port: 3309,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Koneksi Berhasil!");
});

app.get("/api/mahasiswa", (req, res) => {
  db.query("SELECT * FROM biodata", (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack);
      res.status(500).send("Error fetching users");
      return;
    }
    res.json(results);
  });
});

app.post("/api/mahasiswa", (req, res) => {
  const { nama, alamat, agama } = req.body;

  if (!nama || !alamat || !agama) {
    return res
      .status(400)
      .json({ message: "Nama, alamat, dan agama harus diisi." });
  }

  db.query(
    "INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)",
    [nama, alamat, agama],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
      }
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

app.put("/api/mahasiswa/:id", (req, res) => {
  const userId = req.params.id;
  const { nama, alamat, agama } = req.body;

  db.query(
    "UPDATE biodata SET nama = ?, alamat = ?, agama = ? WHERE id = ?",
    [nama, alamat, agama, userId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
      }
      res.json({ message: "User updated successfully" });
    }
  );
});

app.delete("/api/mahasiswa/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM biodata WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json({ message: "User deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
