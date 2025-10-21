const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql2");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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