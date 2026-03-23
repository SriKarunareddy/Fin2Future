import { generateChatResponse } from "../services/chatService.js";

export const handleChat = async (req, res) => {
    try {
        const { userId, userMessage, chatHistory } = req.body;
        if (!userId || !userMessage) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const aiResponse = await generateChatResponse(userId, userMessage, chatHistory || []);
        res.status(200).json({ success: true, data: aiResponse });
    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
