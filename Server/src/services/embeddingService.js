const axios = require('axios');

async function getVoyageEmbedding(text) {
  const apiKey = process.env.voyage_ai_api_key;
  if (!apiKey) throw new Error("voyage_ai_api_key is not configured in environment.");
  
  const response = await axios.post('https://api.voyageai.com/v1/embeddings', {
    input: [text],
    model: 'voyage-3-large'
  }, {
    headers: { 
      'Authorization': `Bearer ${apiKey}`, 
      'Content-Type': 'application/json' 
    }
  });

  if (response.data && response.data.data && response.data.data.length > 0) {
    return response.data.data[0].embedding;
  }
  throw new Error("Failed to retrieve embedding from Voyage AI");
}

module.exports = {
  getVoyageEmbedding
};