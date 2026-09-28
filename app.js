const express = require("express");

const app = express();
const feedback = [];

app.post("/feedback", (req, res) => {
  const { student, meal, rating, comment } = req.body;

  if (!student || !meal || !rating || !comment) {
    return res.status(400).send("All feedback fields are required.");
  }

  feedback.push({
    id: feedback.length + 1,
    student,
    meal,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString()
  });

  res.redirect("/");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static("public"));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;   