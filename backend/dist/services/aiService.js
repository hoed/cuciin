"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimateOrder = exports.laundryAssistant = exports.getGeminiResponse = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const getGeminiResponse = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error("AI Service Error:", error);
        return "Maaf kak, sistem AI sedang istirahat sebentar. Coba lagi nanti ya!";
    }
};
exports.getGeminiResponse = getGeminiResponse;
const laundryAssistant = async (context, userMessage) => {
    const prompt = `
    Kamu adalah AI Customer Service untun Cuciin Platform, sebuah marketplace laundry on-demand.
    Gaya bahasa: Ramah, santai, gunakan kata "kak", bahasa Indonesia.
    Konteks saat ini: ${context}
    
    Pertanyaan user: ${userMessage}
    
    Berikan jawaban yang akurat berdasarkan konteks di atas. Jika tidak tahu, sarankan untuk hubungi CS manusia.
  `;
    return await (0, exports.getGeminiResponse)(prompt);
};
exports.laundryAssistant = laundryAssistant;
const estimateOrder = async (items, isExpress) => {
    const prompt = `
    Tugas: Estimasi waktu dan harga untuk order laundry.
    Items: ${JSON.stringify(items)}
    Express: ${isExpress ? "Ya" : "Tidak"}
    
    Berikan output dalam format JSON:
    {
      "estimated_time_minutes": number,
      "total_price": number,
      "confidence_score": number,
      "explanation": "string"
    }
    
    Gunakan logika: 
    - Kiloan: 10rb/kg. 1-2 hari.
    - Cuci Sepatu: 30rb/pasang. 2-3 hari.
    - Express: Harga 2x lipat, waktu 1/2.
  `;
    const response = await (0, exports.getGeminiResponse)(prompt);
    try {
        // Attempt to parse JSON from AI response
        const jsonMatch = response.match(/\{.*\}/s);
        return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    }
    catch (e) {
        return null;
    }
};
exports.estimateOrder = estimateOrder;
