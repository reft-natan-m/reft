import React, { useState } from "react";
import Image from "next/image";
import { Property } from "@prisma/client";

interface GalleryCompProps {
  data: Property;
}

const GalleryComp: React.FC<GalleryCompProps> = ({ data }) => {
  const [imageSrcs, setImageSrcs] = useState([
    `/images/${data.id}/Image0.jpg`,
    `/images/${data.id}/Image1.jpg`,
    `/images/${data.id}/Image2.jpg`,
    `/images/${data.id}/Image3.jpg`,
  ]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageError = (index: number) => {
    // If primary image fails to load, switch to fallback image
    const updatedSrcs = [...imageSrcs];
    updatedSrcs[index] = "/images/Dunno.jpg";
    setImageSrcs(updatedSrcs);
  };

  const handleImageClick = (index: number) => {
    // Swap positions of selected image and Image0
    const updatedSrcs = [...imageSrcs];
    const tempSrc = updatedSrcs[index];
    updatedSrcs[index] = updatedSrcs[0];
    updatedSrcs[0] = tempSrc;
    setImageSrcs(updatedSrcs);
    setSelectedImageIndex(index);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="sm:col-span-2">
        <Image
          width={1000} // Adjust width as needed for Image0
          height={600} // Adjust height as needed for Image0
          src={imageSrcs[0]}
          alt="Property Image 0"
          onError={() => handleImageError(0)}
          className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75 cursor-pointer"
          onClick={() => handleImageClick(0)}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:col-span-2">
        {imageSrcs.slice(1).map((src, index) => (
          <div key={index}>
            <Image
              width={300} // Adjust width as needed for Image1, Image2, Image3
              height={200} // Adjust height as needed for Image1, Image2, Image3
              src={src}
              alt={`Property Image ${index + 1}`}
              onError={() => handleImageError(index + 1)}
              className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75 cursor-pointer"
              onClick={() => handleImageClick(index + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryComp;
