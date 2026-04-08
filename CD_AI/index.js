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
        const { industry = "", resumeText = "", questionType = "industry", questionCount } = req.body;
        const normalizedCount = Number(questionCount);
        const normalizedIndustry = String(industry).trim();
        const normalizedResumeText = String(resumeText).trim();

        if (!Number.isInteger(normalizedCount) || normalizedCount < 2 || normalizedCount > 5) {
            return res.status(400).json({ error: "questionCount(2~5)가 필요합니다." });
        }

        if (questionType === "industry" && !normalizedIndustry) {
            return res.status(400).json({ error: "산업 기반 질문에는 industry가 필요합니다." });
        }

        if (questionType === "resume" && !normalizedResumeText) {
            return res.status(400).json({ error: "자소서 기반 질문에는 resumeText가 필요합니다." });
        }

        const basisLine =
            questionType === "resume"
                ? `- 자소서 내용: ${normalizedResumeText}`
                : `- 산업: ${normalizedIndustry}`;

        const prompt = `
당신은 한국어 면접 질문 생성기입니다.
아래 조건에 맞는 질문만 생성하세요.

- 질문 유형: ${questionType}
${basisLine}
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

const port = Number(process.env.PORT) || 3001;

app.get("/", (req, res) => {
    res.json({
        message: "AI server is running",
        healthcheck: "/health",
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        ok: true,
        service: "cd-ai",
        port,
        timestamp: new Date().toISOString(),
    });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`AI server running on port ${port}`);
});
