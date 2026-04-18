const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/optimize", async (req, res) => {
  console.log("Request received");

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You optimize code and explain improvements."
          },
          {
            role: "user",
            content: `Optimize this code:\n\n${req.body.code}`
          }
        ]
      },
      {
        headers: {
          Authorization: "Bearer AIzaSyB0d5AUYBfz_3vhB6GikGOgazE8r67MPyw",
          "Content-Type": "application/json"
        },
        timeout: 10000
      }
    );

    console.log("AI RESPONSE:", response.data);

    res.json(response.data);

  } catch (err) {
    console.error("FULL ERROR:", err);
    console.error("API ERROR:", err.response?.data);
    console.error("MESSAGE:", err.message);

    res.status(500).json({
      error: err.response?.data || err.message
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});