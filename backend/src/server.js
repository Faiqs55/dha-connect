const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.config");
const { agencyRouter } = require("./routes/agency.routes");
const { userRouter } = require("./routes/user.routes");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://dha-connect.vercel.app', 'http://localhost:8000', 'http://localhost:3001','https://dha-connect.netlify.app'], // Add your frontend URLs
  credentials: true
}));


// DATABASE CONNECTION
connectDB();


// ROUTES
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API health is good" });
});

app.use("/api/agency", agencyRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server is running on PORT: ${port}`));
