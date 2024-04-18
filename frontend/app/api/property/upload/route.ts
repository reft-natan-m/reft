import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

const createFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

export async function POST(req: NextRequest) {
  const data = await req.formData();
  console.log(data);

  const propertyId: string = data.get("propertyId") as unknown as string;

  const files: File[] | null = data.getAll("images") as unknown as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ success: false });
  }

  const uploadDir = path.resolve("./public/images");
  const propertyImagePath = path.join(uploadDir, propertyId);
  createFolder(propertyImagePath);

  const uploadTasks = files.map(async (file: File, index: number) => {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = path.join(propertyImagePath, `Image${index}.jpg`);

    await writeFile(filename, buffer);
    console.log(
      `File ${file.name} uploaded successfully as Image${index}.jpg.`
    );
  });

  await Promise.all(uploadTasks);

  console.log(`open ${uploadDir} to see the uploaded files`);
  return NextResponse.json({ success: true });
}
