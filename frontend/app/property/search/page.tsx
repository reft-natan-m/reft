import React from "react";
import PaginationComp from "@/app/ui/Pagination";
import PropertyCard from "@/app/ui/PropertyCard";
import SearchNav from "@/app/ui/SearchNav";

interface SearchResultProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const SearchResult: React.FC<SearchResultProps> = ({ searchParams }) => {
  const page = searchParams["page"] ? Number(searchParams["page"]) : 1;
  const per_page = searchParams["per_page"]
    ? Number(searchParams["per_page"])
    : 15;

  // Generate 90 property objects for testing pagination
  const totalProperties = 90;
  const cardDataArray = Array.from({ length: totalProperties }, (_, index) => ({
    id: index + 1,
    state: "CA",
    city: `Los Angeles ${index + 1}`,
    street: `${index + 1} Main St`,
    zip: `9000${index + 1}`,
    value: 500000 + (index + 1) * 10000,
    tokens: 100 + index,
    tokenForSale: 10 + index,
    tokenPrice: (500000 + (index + 1) * 10000) / (100 + index),
    image: "/images/Dunno.jpg",
  }));

  const start = (page - 1) * per_page;
  const end = start + per_page;

  const entries = cardDataArray.slice(start, end);

  return (
    <div>
      <SearchNav per_Page={per_page} totalProperties={totalProperties} />
      <div className="flex justify-center mt-4">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-screen-xl mx-auto mt-8">
            {entries.map((property) => (
              <div key={property.id} className="border p-4 overflow-x-hidden">
                {/* Render your property card here */}
                <PropertyCard data={property} />
              </div>
            ))}
          </div>
          <PaginationComp totalPages={Math.ceil(totalProperties / per_page)} />
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
