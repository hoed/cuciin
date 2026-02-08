import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getGeminiResponse = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Maaf kak, sistem AI sedang istirahat sebentar. Coba lagi nanti ya!";
  }
};

export const laundryAssistant = async (context: string, userMessage: string) => {
  const prompt = `
    Kamu adalah AI Customer Service untun Cuciin Platform, sebuah marketplace laundry on-demand.
    Gaya bahasa: Ramah, santai, gunakan kata "kak", bahasa Indonesia.
    Konteks saat ini: ${context}
    
    Pertanyaan user: ${userMessage}
    
    Berikan jawaban yang akurat berdasarkan konteks di atas. Jika tidak tahu, sarankan untuk hubungi CS manusia.
  `;
  return await getGeminiResponse(prompt);
};

export const estimateOrder = async (items: any[], isExpress: boolean) => {
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
  const response = await getGeminiResponse(prompt);
  try {
    // Attempt to parse JSON from AI response
    const jsonMatch = response.match(/\{.*\}/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch (e) {
    return null;
  }
};
