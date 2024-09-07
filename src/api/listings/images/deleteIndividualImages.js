const bucket = require("../../../config/firebase");

const deleteIndividualListingImage = async (req, res) => {
  const { user_email, location, image } = req.body;
  try {
    const folderPath = `users/${user_email}/listings/${location}/`;
    const [files] = await bucket.getFiles({ prefix: folderPath });

    const remainingUrls = [];

    for (const file of files) {
      const [url] = await file.getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });

      if (url === image) {
        await file.delete();
      } else {
        remainingUrls.push({ url: url });
      }
    }
    return res.status(200).json(remainingUrls);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Something went wrong. Please try again",
    });
  }
};

module.exports = deleteIndividualListingImage;
