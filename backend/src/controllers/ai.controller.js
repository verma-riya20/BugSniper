import aiServices from "../services/ai.services.js";

export const getResponse = async (req, res) => {
    const code = req.body.code;
    
    if (!code) {
        return res.status(400).send("Code is required");
    }

    try {
        const response = await aiServices.generateContent(code);
        res.send(response);
    } catch (error) {
        console.error("AI Service Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
export default { getResponse };
