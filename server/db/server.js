const express = require("express");
const cors = require("cors"); // Add this line to import the cors middleware
const swaggerJSDoc = require("swagger-jsdoc");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const db = require("./db");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(bodyParser.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api/data", async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM public."User"');
      const userData = result.rows.map((row) => ({
        name: row.name,
        id: row.id,
        email: row.email,
        age: row.age,
      }));
  
      console.log(userData);
      res.json(userData);
    } catch (error) {
      console.error("Error executing query", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/data-store", async (req, res) => {
    try {
      const { name, email, age } = req.body;
      const result = await db.query('INSERT INTO public."User" (name, email, age) VALUES ($1, $2, $3) RETURNING *', [name, email, age]);
      const newUser = result.rows[0];
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error inserting data", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
