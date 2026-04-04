import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await client.responses.create({
            model: "gpt-5.4",
            input: message,
        });

        res.json({ reply: response.output_text });
    } catch (error) {
        res.status(500).json({ error: "AI 요청 실패" });
    }
});

app.listen(process.env.PORT || 3001, () => {
    console.log("AI server running");
});
