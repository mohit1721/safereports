const { analyzeMedia } = require("./ai-adapter");

const analyzeImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(200).json({
        aiFailed: true,
        title: "",
        category: "",
        description: ""
      });
    }

    const result = await analyzeMedia("image", image);
    return res.json(result);
  } catch (error) {
    console.log("Image analysis error:", error.message);
    return res.status(200).json({
      aiFailed: true,
      title: "",
      category: "",
      description: ""
    });
  }
};

module.exports = { analyzeImage };
