const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Mess Food Feedback Tracker</h1>
    <p>Application is running.</p>
  `);
});

module.exports = app;