const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos de MariaDB');
});

app.get('/search', (req, res) => {
    const { name } = req.query;
  
    const sql = "SELECT * FROM personas_desaparecidas WHERE nombre LIKE ?";
    db.query(sql, [`%${name}%`], (err, results) => {
      if (err) {
        console.error("Error al buscar en la base de datos:", err);
        return res.status(500).json({ message: 'Error al buscar personas.' });
      }
      res.json(results);
    });
});

//delete person
app.delete('/person/:id', (req, res) => {
    const id = req.params.id;
  
    const sql = "DELETE FROM personas_desaparecidas WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.error("Error al borrar en la base de datos:", err);
        return res.status(500).json({ message: 'Error al borrar la persona.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Persona no encontrada.' });
      }
      res.json({ message: 'Persona borrada con exito.' });
    });
  });
  


  app.post("/register", upload.single("photo"), (req, res) => {
    const { name, contact, location, status } = req.body;
    const photo = req.file ? req.file.filename : null;
  
    const sql = "INSERT INTO personas_desaparecidas (nombre, contacto, ubicacion, estado, foto) VALUES (?, ?, ?, ?, ?)";
    const values = [name, contact, location, status, photo];
  
    db.query(sql, values, (error, results) => {
      if (error) {
        console.error("Error al insertar en la base de datos:", error);
        res.status(500).json({ message: "Error al registrar la persona." });
      } else {
        res.json({ message: "Persona registrada con éxito." });
      }
    });
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
