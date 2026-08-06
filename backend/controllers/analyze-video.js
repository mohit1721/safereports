const { analyzeMedia } = require("./ai-adapter");

const analyzeVideo = async (req, res) => {
  try {
    const { video } = req.body;

    if (!video) {
      return res.status(200).json({
        aiFailed: true,
        title: "",
        category: "",
        description: ""
      });
    }

    const result = await analyzeMedia("video", video);
    return res.json(result);
  } catch (error) {
    console.log("Video analysis error:", error.message);
    return res.status(200).json({
      aiFailed: true,
      title: "",
      category: "",
      description: ""
    });
  }
};

module.exports = { analyzeVideo };
