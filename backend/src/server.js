const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { connectDB } = require("./config/db.config");
const { agencyRouter } = require("./routes/agency.routes");
const { userRouter } = require("./routes/user.routes");
const { agentRouter } = require("./routes/agent.routes");
const { propertyRouter } = require("./routes/property.routes");
const { electedBodyRouter } = require("./routes/electedBody.routes");
const phaseRoutes = require("./routes/phaseRoutes");
const phaseNameRoutes = require("./routes/phaseNameRoutes");
const contactQueryRoutes = require("./routes/contactQueryRoutes");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://dha-connect.onrender.com','https://dha-connect.vercel.app', 'http://localhost:8000', 'http://localhost:3001','https://dha-connect.netlify.app', 'https://dhaconnects.com'], // Add your frontend URLs
  credentials: true
}));


const startServer = async () => {
  try {
    await connectDB();

    // ROUTES
    app.get("/api/health", (req, res) => {
      res.status(200).json({ status: "ok", message: "API health is good" });
    });

    app.use("/api/user", userRouter);
    app.use("/api/agency", agencyRouter);
    app.use("/api/agent", agentRouter);
    app.use("/api/property", propertyRouter);
    app.use("/api/phases", phaseRoutes);
    app.use("/api/phase-names", phaseNameRoutes);
    app.use("/api/contact-queries", contactQueryRoutes);
    app.use("/api/elected-bodies", electedBodyRouter);

    app.listen(port, () =>
      console.log(`Server is running on PORT: ${port}`)
    );
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
