const express = require("express");
const fs = require("fs");

const app = express();

const feedback = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home page
app.get("/", (req, res) => {
  const filePath = __dirname + "/public/index.html";
  let html = fs.readFileSync(filePath, "utf8");

  const commitId =
    process.env.RENDER_GIT_COMMIT ||
    process.env.COMMIT_ID ||
    "local";

  html = html.replaceAll("__COMMIT_ID__", commitId);

  res.send(html);
});

// Serve other static files
app.use(express.static("public"));

// Submit feedback
app.post("/feedback", (req, res) => {
  const { student, meal, rating, comment } = req.body;

  const validMeals = ["breakfast", "lunch", "dinner"];
  const numericRating = Number(rating);

  if (!student || !meal || !rating || !comment) {
    return res.status(400).send("All feedback fields are required.");
  }

  if (!validMeals.includes(meal)) {
    return res.status(400).send("Invalid meal selected.");
  }

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return res.status(400).send("Rating must be a whole number from 1 to 5.");
  }

  feedback.push({
    id: feedback.length + 1,
    student: student.trim(),
    meal,
    rating: numericRating,
    comment: comment.trim(),
    createdAt: new Date().toISOString()
  });

  res.redirect("/");
});

// JSON API
app.get("/api/feedback", (req, res) => {
  res.json(feedback);
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

module.exports = app;