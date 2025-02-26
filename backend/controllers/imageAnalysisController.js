import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const analyzeImage = async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: "No image provided" });
        }

        const base64Data = image.split(",")[1];
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:

        TITLE: Write a clear, brief title  
        TYPE: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
        DESCRIPTION: Write a clear, concise description`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const text = await result.response.text();
        const titleMatch = text.match(/TITLE:\s*(.+)/);
        const typeMatch = text.match(/TYPE:\s*(.+)/);
        const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

        res.json({
            title: titleMatch ? titleMatch[1].trim() : "",
            reportType: typeMatch ? typeMatch[1].trim() : "",
            description: descMatch ? descMatch[1].trim() : "",
        });
    } catch (error) {
        console.error("Image analysis error:", error);
        res.status(500).json({ error: "Failed to analyze image" });
    }
};

export { analyzeImage };
