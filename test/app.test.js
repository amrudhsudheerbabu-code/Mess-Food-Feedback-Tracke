const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");

const app = require("../app");

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;

      const request = http.request(
        {
          hostname: "localhost",
          port,
          path,
          method,
          headers: body
            ? {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(body)
              }
            : {}
        },
        (response) => {
          let data = "";

          response.on("data", (chunk) => {
            data += chunk;
          });

          response.on("end", () => {
            server.close();

            resolve({
              statusCode: response.statusCode,
              headers: response.headers,
              body: data
            });
          });
        }
      );

      request.on("error", (error) => {
        server.close();
        reject(error);
      });

      if (body) {
        request.write(body);
      }

      request.end();
    });
  });
}

test("GET /health returns status ok", async () => {
  const response = await makeRequest("GET", "/health");

  assert.strictEqual(response.statusCode, 200);
  assert.deepStrictEqual(JSON.parse(response.body), {
    status: "ok"
  });
});

test("GET / returns the application page", async () => {
  const response = await makeRequest("GET", "/");

  assert.strictEqual(response.statusCode, 200);
  assert.match(response.body, /Mess Food Feedback Tracker/);
});

test("POST /feedback accepts valid feedback", async () => {
  const response = await makeRequest(
    "POST",
    "/feedback",
    "student=TestStudent&meal=lunch&rating=5&comment=Great+food"
  );

  assert.strictEqual(response.statusCode, 302);
  assert.strictEqual(response.headers.location, "/");
});

test("POST /feedback rejects missing fields", async () => {
  const response = await makeRequest(
    "POST",
    "/feedback",
    "student=TestStudent&meal=lunch"
  );

  assert.strictEqual(response.statusCode, 400);
});

test("POST /feedback rejects invalid rating", async () => {
  const response = await makeRequest(
    "POST",
    "/feedback",
    "student=TestStudent&meal=lunch&rating=10&comment=Bad+rating"
  );

  assert.strictEqual(response.statusCode, 400);
});

test("GET /api/feedback returns JSON", async () => {
  const response = await makeRequest("GET", "/api/feedback");

  assert.strictEqual(response.statusCode, 200);
  assert.ok(Array.isArray(JSON.parse(response.body)));
});