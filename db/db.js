const mysql = require("mysql2");
const path = require('path')
const fs = require('fs');

const caCertPath = path.join(__dirname, 'ca-cert.pem');
const serverCertPath = path.join(__dirname, 'server-cert.pem');
const serverKeyPath = path.join(__dirname, 'server-key.pem');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    ca: fs.readFileSync(caCertPath),
    cert: fs.readFileSync(serverCertPath),
    key: fs.readFileSync(serverKeyPath),
}
});

connection.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
  } else {
    console.log(`DB Conectada: ${process.env.DB_MODE} - ${process.env.DB_HOST}:${process.env.DB_PORT}`);
  }
});

/**
 * Busca una persona por su nombre en la base de datos. No tiene que ser exactamente el mismo.
 * @param {string} name - El nombre de la persona a buscar.
 * @returns {Promise} - Un objeto Promise que se resuelve con un array de objetos que representan
 *                     las personas encontradas, o que se rechaza con un objeto Error en caso de error.
 */
async function findByName(name) {
  try {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${process.env.DB_TABLE} WHERE nombre LIKE '%${name}%' ORDER BY nombre ASC`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          //ordenar por nombre
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

async function findByLastSeen(lastSeen) {
  try {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${process.env.DB_TABLE} WHERE ubicacion LIKE '%${lastSeen}%' ORDER BY nombre ASC`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          //ordenar por nombre
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

async function getAll() {
  try {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${process.env.DB_TABLE} ORDER BY nombre ASC`; ;
                connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

async function insertPerson({ name, contact, lastSeen }) {
  try {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO ${process.env.DB_TABLE} (nombre, contacto, ubicacion) VALUES (?, ?, ?)`;
      connection.query(query, [name, contact, lastSeen], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

async function deletePerson(id) {
  return new Promise((resolve, reject) => {
    // Verificamos si el ID es válido
    if (!id) {
      reject(new Error('El ID es requerido.'));
      return;
    }

    const query = `DELETE FROM ${process.env.DB_TABLE} WHERE id = ?`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        // Manejo de errores: rechaza la promesa si hay un error
        reject(err);
      } else {
        // Resolvemos la promesa con los resultados
        resolve(results);
      }
    });
  });
}

async function getCentros() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${process.env.DB_TABLE_CENTROS}`;
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  }
  );
}

async function insertCentro({ nombre, direccion, tipo, lat, lng }) {
  try {
    return new Promise((resolve, reject) => {
      console.log("Insertando centro:", { nombre, direccion, tipo, lat, lng });
      const query = `INSERT INTO ${process.env.DB_TABLE_CENTROS} (nombre, direccion, tipo, lat, lng) VALUES (?, ?, ?, ?, ?)`;
      connection.query(query, [nombre, direccion, tipo, lat, lng], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}




module.exports = { findByName, findByLastSeen,getAll, insertPerson, deletePerson, getCentros, insertCentro, connection };
