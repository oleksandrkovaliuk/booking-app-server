const bucket = require("../../../config/firebase");

const deleteListingImages = async (req, res) => {
  const { user_email, location } = req.body;
  try {
    const folderPath = `users/${user_email}/listings/${location}/`;
    const [files] = await bucket.getFiles({ prefix: folderPath });

    const deletePromises = files.map((file) => file.delete());
    await Promise.all(deletePromises);
    return res.status(200).json({ massage: "Images deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Something went wrong. Please try again",
    });
  }
};

module.exports = deleteListingImages;
