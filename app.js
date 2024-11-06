require("dotenv").config();
const express = require("express");


const dbService = require("./db/db");
const app = express();
const PORT = process.env.PORT || 3000;

//establecer la carpeta publica
app.use(express.static("public"));

app.use(express.json());




app.post("/find", async (req, res) => {
  if (req.query.name) {
    dbService.findByName(req.query.name)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else if (req.query.lastSeen) {
    dbService.findByLastSeen(req.query.lastSeen)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
})

app.get("/all", async (req, res) => {
  dbService.getAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
      console.error("Error cazado en la API:", err);
    });
})

app.post("/register", async (req, res) => {
  dbService.insertPerson(req.body)
    .then(() => {
      res.status(200).send("Persona registrada correctamente");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})

app.delete("/delete/:id", (req, res) => {
  dbService.deletePerson(req.params.id)
  .then(() => {
    res.status(200).send("Persona eliminada correctamente");
  })
  .catch((err) => {
    res.status(500).send(err);
  })
})

app.get('/centros', async (req, res) => {
  dbService.getCentros()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})

app.post('/centros', async (req, res) => {
  console.log('Body:', req.body);
  dbService.insertCentro(req.body)
    .then(() => {
      res.status(200).send("Centro registrado correctamente");
    })
    .catch((err) => {
      res.status(500).send(err);
    });
})

app.delete('/centros/:id', async (req, res) => {
  dbService.deleteCentro(req.params.id)
    .then(() => {
      res.status(200).send("Centro eliminado correctamente");
      console.log("Centro eliminado correctamente");
    })
    .catch((err) => {
      res.status(500).send(err);
      console.error("Error al eliminar el centro:", err);
    });
})

app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
