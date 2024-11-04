const express = require("express");
const connection = require("./db/db");

const app = express();
const PORT = process.env.PORT || 3001;

//establecer la carpeta publica
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
