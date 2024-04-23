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
    // If image fails to load, switch to fallback image
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
        <img
          src={imageSrcs[0]}
          alt="Property Image 0"
          onError={() => handleImageError(0)}
          className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75 cursor-pointer"
          style={{ width: "1000px", height: "400px" }}
          onClick={() => handleImageClick(0)}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:col-span-2">
        {imageSrcs.slice(1).map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Property Image ${index + 1}`}
              onError={() => handleImageError(index + 1)}
              className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75 cursor-pointer"
              style={{ width: "300px", height: "150px" }}
              onClick={() => handleImageClick(index + 1)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryComp;
