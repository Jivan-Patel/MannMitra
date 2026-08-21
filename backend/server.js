require("dotenv").config();
const express = require("express");
const cors = require("cors");

const chatRoute = require("./routes/chat");
const contentRoute = require("./routes/content");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Step 3: health check — confirms the server + environment are alive
// before any LLM complexity gets added on top.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/chat", chatRoute);
app.use("/api/content", contentRoute);

app.listen(PORT, () => {
  console.log(`MannMitra backend running on http://localhost:${PORT}`);
  console.log(`  Health check: GET /api/health`);
  console.log(`  Chat:         POST /api/chat`);
  console.log(`  Content:      GET /api/content?mood=anxious`);
});
