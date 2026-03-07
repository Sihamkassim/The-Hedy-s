// Using Gemini or any general LLM interface
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getVoyageEmbedding } = require('./embeddingService');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || 'fake_key');

const getMentalHealthResponse = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: "You are a highly empathetic and professional psychiatrist assistant. Your default language is Amharic, so answer by amharic each time  you are asked  but you must respond in English if the user explicitly asks you to. Structure your responses clearly using Markdown with well-spaced paragraphs and bullet points. Your goal is to provide comforting, clinically informed (but non-diagnostic), and helpful responses to users. Whenever relevant, use the provided knowledge base context to inform your answer. If the context doesn't relate to the user's issue, rely on your general expertise. Do not offer a medical diagnosis."
    });

    // RAG: 1. Embed user query
    let contextDocs = "";
    try {
      const userEmbedding = await getVoyageEmbedding(message);
      
      // 2. Vector search via pgvector (cosine distance <= 0.3 for similarity, for instance)
      // We'll retrieve the top 3 most relevant chunks
      const nearestChunks = await prisma.$queryRaw`
        SELECT content, 1 - (embedding <=> ${JSON.stringify(userEmbedding)}::vector) as similarity
        FROM "DocumentChunk"
        ORDER BY embedding <=> ${JSON.stringify(userEmbedding)}::vector
        LIMIT 3
      `;

      if (nearestChunks && nearestChunks.length > 0) {
        contextDocs = nearestChunks.map(c => c.content).join('\n\n');
      }
    } catch (embedError) {
      console.error("Vector search error (ignoring and proceeding without RAG context):", embedError.message);
    }

    // 3. Assemble prompt with RAG Context
    const prompt = `Knowledge Base Context:
"""
${contextDocs || 'No additional context available.'}
"""

User Query: "${message}"`;
    
    // Generate content using the assembled prompt
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    // Fallback response if API fails
    return "I'm sorry, I'm having trouble connecting right now. Please remember you are not alone, and help is available if you need it.";
  }
};

module.exports = { getMentalHealthResponse };
