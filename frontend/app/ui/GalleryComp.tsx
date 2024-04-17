import React from "react";
import Image from "next/image";
import { PropertyData } from "./CardData";

// interface GalleryCompProps {
//   data: PropertyData;
// }

const GalleryComp: React.FC = ({}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Image
          width={500}
          height={500}
          src="/images/Dunno.jpg"
          alt="Property Image 1"
          className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75"
        />
      </div>
      <div>
        <Image
          width={500}
          height={500}
          src="/images/Dunno.jpg"
          alt="Property Image 1"
          className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75"
        />
      </div>
      <div>
        <Image
          width={500}
          height={500}
          src="/images/Dunno.jpg"
          alt="Property Image 1"
          className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75"
        />
      </div>
      <div>
        <Image
          width={500}
          height={500}
          src="/images/Dunno.jpg"
          alt="Property Image 1"
          className="h-auto max-w-full rounded-lg transition duration-150 ease-in-out transform hover:brightness-75"
        />
      </div>
    </div>
  );
};

export default GalleryComp;
