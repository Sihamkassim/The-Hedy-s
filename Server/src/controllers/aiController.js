const catchAsync = require('../utils/catchAsync');
const { getMentalHealthResponse } = require('../services/aiService');

exports.chatWithAI = catchAsync(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message is required' });
  }

  // Basic crisis keyword detection
  const crisisKeywords = ['suicide', 'kill myself', 'hopeless', 'hurt myself', 'end it all'];
  const isCrisis = crisisKeywords.some(keyword => message.toLowerCase().includes(keyword));

  if (isCrisis) {
    return res.status(200).json({
      reply: "It sounds like you're going through a truly difficult time. Please know that you are not alone and there is help available right now. We strongly encourage you to call the National Suicide Prevention Lifeline at 988, or seek professional emergency help immediately.",
      isEmergency: true
    });
  }

  const aiReply = await getMentalHealthResponse(message);

  res.status(200).json({
    reply: aiReply,
    isEmergency: false
  });
});
