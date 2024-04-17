import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const propertyId = req.body.propertyId as string;
    const images = req.body.images as string[]; // Assuming you're sending file paths from the client

    // Create folder
    const folderPath = path.join(process.cwd(), "public", "images", propertyId);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Move and rename images
    images.forEach((image, index) => {
      const oldPath = path.join(process.cwd(), "public", image);
      const newPath = path.join(
        folderPath,
        `image${index + 1}${path.extname(image)}`
      );
      fs.renameSync(oldPath, newPath);
    });

    res.status(200).json({ message: "Upload successful" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
