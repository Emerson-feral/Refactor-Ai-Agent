import express from "express";
import { handlePR } from "./github/webhook";

const app = express();
app.use(express.json());

app.post("/webhook", handlePR);

app.listen(3000, () => {
  console.log("Review agent server running at port 3000");
});