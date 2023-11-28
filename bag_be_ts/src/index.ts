import express, { Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { json } from "body-parser";
import { DeviceRouter } from "./routes/bag.routes";

dotenv.config();

const app: Express = express();

const port = process.env.PORT!;

const options: cors.CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
};

app.use(cors(options));
app.use(json());
app.use([DeviceRouter]);

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("  Database connected 📟 "))
  .catch((err) => console.log(err))


app.listen(port, () => {
  console.log(`App is running at https://localhost:${port}`);
});