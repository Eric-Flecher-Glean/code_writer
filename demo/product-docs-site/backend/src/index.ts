import express from "express";
import cors from "cors";
import * as path from "path";
import docsRouter from "./routes/docs";

const app = express();
app.use(cors());
app.use(express.json());

// Serve static PDF files
app.use("/pdfs", express.static(path.join(__dirname, "../static/pdfs")));

app.use("/api/docs", docsRouter);

export default app;
