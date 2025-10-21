// Import library Express untuk membuat server HTTP
const express = require("express");

// Import library MySQL2 untuk koneksi ke database MySQL
const mysql = require("mysql2");

// Membuat instance aplikasi Express
const app = express();

// Menentukan port server berjalan (3000)
const PORT = 3000;

// Middleware untuk parsing request body dalam format JSON
app.use(express.json());

// Middleware untuk parsing data dari form (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Route dasar (root) untuk mengecek server aktif
app.get("/", (req, res) => {
  res.send("Hello World!"); // Mengirimkan teks "Hello World!" ke browser
});

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: "localhost",      // Host database (lokal)
  user: "root",           // Username MySQL
  password: "Banjarmasin67.", // Password MySQL
  database: "mahasiswa",  // Nama database yang digunakan
  port: 3309,             // Port MySQL (sesuai pengaturan lokal kamu)
});

// Mengecek apakah koneksi ke database berhasil atau tidak
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack); // Jika gagal, tampilkan pesan error
    return;
  }
  console.log("Koneksi Berhasil!"); // Jika sukses, tampilkan pesan sukses di console
});

// Endpoint GET untuk menampilkan seluruh data mahasiswa
app.get("/api/mahasiswa", (req, res) => {
  // Jalankan query SQL untuk mengambil semua data dari tabel biodata
  db.query("SELECT * FROM biodata", (err, results) => {
    if (err) {
      console.error("Error executing query: " + err.stack); // Jika query gagal, tampilkan error
      res.status(500).send("Error fetching users"); // Kirim respon error 500 ke client
      return;
    }
    res.json(results); // Jika berhasil, kirim data hasil query dalam format JSON
  });
});

// Endpoint POST untuk menambahkan data mahasiswa baru
app.post("/api/mahasiswa", (req, res) => {
  // Mengambil data dari body request (nama, alamat, agama)
  const { nama, alamat, agama } = req.body;

  // Validasi sederhana: jika salah satu kosong, kirim pesan error
  if (!nama || !alamat || !agama) {
    return res
      .status(400)
      .json({ message: "Nama, alamat, dan agama harus diisi." });
  }

  // Jalankan query SQL untuk memasukkan data baru ke tabel biodata
  db.query(
    "INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)", // Tanda ? akan diganti dengan nilai berikut
    [nama, alamat, agama], // Nilai-nilai yang akan dimasukkan
    (err, results) => {
      if (err) {
        console.error(err); // Jika error, tampilkan di console
        return res.status(500).json({ message: "Database Error" }); // Kirim respon error
      }
      // Jika sukses, kirim respon sukses 201 (Created)
      res.status(201).json({ message: "User created successfully" });
    }
  );
});

// Endpoint PUT untuk memperbarui data mahasiswa berdasarkan ID
app.put("/api/mahasiswa/:id", (req, res) => {
  const userId = req.params.id; // Ambil ID dari parameter URL
  const { nama, alamat, agama } = req.body; // Ambil data baru dari body request

  // Jalankan query SQL untuk memperbarui data
  db.query(
    "UPDATE biodata SET nama = ?, alamat = ?, agama = ? WHERE id = ?", // Update berdasarkan ID
    [nama, alamat, agama, userId], // Nilai baru dan ID target
    (err, results) => {
      if (err) {
        console.error(err); // Jika error, tampilkan di console
        return res.status(500).json({ message: "Database Error" }); // Kirim respon error
      }
      // Jika berhasil, kirim pesan sukses
      res.json({ message: "User updated successfully" });
    }
  );
});

// Endpoint DELETE untuk menghapus data mahasiswa berdasarkan ID
app.delete("/api/mahasiswa/:id", (req, res) => {
  const userId = req.params.id; // Ambil ID dari parameter URL

  // Jalankan query SQL untuk menghapus data berdasarkan ID
  db.query("DELETE FROM biodata WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error(err); // Jika error, tampilkan di console
      return res.status(500).json({ message: "Database Error" }); // Kirim respon error
    }
    // Jika berhasil, kirim pesan sukses
    res.json({ message: "User deleted successfully" });
  });
});

// Menjalankan server pada port yang telah ditentukan
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Tampilkan pesan saat server aktif
});
