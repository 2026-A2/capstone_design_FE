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

app.post("/api/interview/questions", async (req, res) => {
    try {
        const { industry, questionType = "industry", questionCount } = req.body;
        const normalizedCount = Number(questionCount);

        if (!industry || !Number.isInteger(normalizedCount) || normalizedCount < 2 || normalizedCount > 5) {
            return res.status(400).json({ error: "industry와 questionCount(2~5)가 필요합니다." });
        }

        const prompt = `
당신은 한국어 면접 질문 생성기입니다.
아래 조건에 맞는 질문만 생성하세요.

- 질문 유형: ${questionType}
- 산업: ${industry}
- 질문 개수: ${normalizedCount}

반드시 JSON 배열 문자열로만 응답하세요.
예시: ["질문1", "질문2"]
`;

        const response = await client.responses.create({
            model: "gpt-5.4",
            input: prompt,
        });

        const rawText = response.output_text?.trim() || "[]";
        let questions = [];

        try {
            const parsed = JSON.parse(rawText);
            questions = Array.isArray(parsed) ? parsed : [];
        } catch {
            questions = rawText
                .split("\n")
                .map((line) => line.replace(/^\d+[.)\s-]*/, "").trim())
                .filter(Boolean);
        }

        res.json({ questions: questions.slice(0, normalizedCount) });
    } catch (error) {
        res.status(500).json({ error: "질문 생성 실패" });
    }
});

app.listen(process.env.PORT || 3001, () => {
    console.log("AI server running");
});
