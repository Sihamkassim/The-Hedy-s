// Using Gemini or any general LLM interface
const { GoogleGenerativeAI } = require('@google/generative-ai');

// If using Google Gemini:
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || 'fake_key');

const getMentalHealthResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Add specific instruction context to make it a mental health assistant
    const prompt = `You are a compassionate mental health assistant. 
    A user says: "${message}". 
    Provide a comforting, helpful, and concise response. 
    Do not offer medical diagnosis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("AI Error:", error);
    // Fallback response if API fails
    return "I'm sorry, I'm having trouble connecting right now. Please remember you are not alone, and help is available if you need it.";
  }
};

module.exports = { getMentalHealthResponse };
