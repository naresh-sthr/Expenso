import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import handleSignup from "./controllers/handleSignup.js";
import handleLogin from './controllers/handleLogin.js'
import handleUserOperation from './controllers/handleUserOperations.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo DB Connected"))
  .catch((err) => console.log("Mongodb Error", err));

  const allowedOrigin = 'http://localhost:5173';

  app.use(cors({
    origin: allowedOrigin,      // NOT '*', but your exact frontend origin
    credentials: true           // allow cookies and credentials
  }));
app.use("/user", handleSignup);
app.listen(PORT, () => {
  console.log("App is running on PORT ", PORT);
});
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use('/user',handleLogin);
app.use('/api',handleUserOperation)
