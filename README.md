# Mess Food Feedback Tracker

A dynamic web application for collecting and tracking student feedback about mess food.

## Project Overview

The Mess Food Feedback Tracker allows students to submit feedback about their meals by providing:

- Student name
- Meal type
- Rating from 1 to 5
- Written feedback

Submitted feedback is stored by the Express server and can also be accessed through a JSON API.

## Technologies Used

- Node.js
- Express.js
- HTML5
- CSS3
- JavaScript
- Docker
- GitHub Actions
- Render

## Application Features

### Feedback Submission

Students can submit feedback using the web form.

### Input Validation

The server validates:

- Required fields
- Valid meal selection
- Rating between 1 and 5

Invalid submissions return an HTTP 400 response.

### JSON API

The application provides:

```text
GET /api/feedback