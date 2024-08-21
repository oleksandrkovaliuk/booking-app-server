const bucket = require("../../../config/firebase");

const uploadUserListingImages = async (req, res) => {
  const files = req.files;
  const { user_email, location } = req.body;

  try {
    if (!files || !user_email || !location) {
      throw new Error("Some details are missing. Please try again");
    } else {
      const path = `users/${user_email}/listings/${location}/`;

      const [storedFiles] = await bucket.getFiles({ prefix: path });
      const existingFileNames = storedFiles.map((file) => file.name);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${path}${file.originalname}`;

        if (!existingFileNames.includes(file.originalname)) {
          const fileUpload = bucket.file(filePath);
          await fileUpload.save(file.buffer, {
            contentType: file.mimetype,
          });
        }
      }
      const [updatedFiles] = await bucket.getFiles({ prefix: path });
      const fileUrls = await Promise.all(
        updatedFiles.map(async (file) => {
          const [url] = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          });
          return { url: url };
        })
      );
      return res.status(200).json({ data: fileUrls });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Something went wrong. Please try again",
    });
  }
};

module.exports = uploadUserListingImages;
