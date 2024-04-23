import { UserSession } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import FeatureCard from "./FeatureCard";

interface FeatureProps {
  userSession: UserSession | null;
}

const Feature: React.FC<FeatureProps> = ({ userSession }) => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
        <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto dark:text-white">
          <span className="relative inline-block">
            <svg
              viewBox="0 0 52 24"
              fill="currentColor"
              className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
            >
              <defs>
                <pattern
                  id="18302e52-9e2a-4c8e-9550-0cbb21b38e55"
                  x="0"
                  y="0"
                  width=".135"
                  height=".30"
                >
                  <circle cx="1" cy="1" r=".7" />
                </pattern>
              </defs>
              <rect
                fill="url(#18302e52-9e2a-4c8e-9550-0cbb21b38e55)"
                width="52"
                height="24"
              />
            </svg>
            <span className="relative">Revolutionize</span>
          </span>{" "}
          Real Estate Ownership
        </h2>
        <p className="text-base text-gray-400 md:text-lg">
          Unlock the Power of Property Tokenization
        </p>
      </div>
      <div className="grid gap-4 row-gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard feature={1} />
        <FeatureCard feature={2} />
        <FeatureCard feature={3} />
        <FeatureCard feature={4} />
      </div>
      <div className="flex justify-center items-center mt-5">
        <Link href="/auth/signup">
          {!userSession && (
            <h3 className="text-xl font-semibold sm:text-center text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-500 sm:mb-6 sm:text-2xl ">
              Signup Today!
            </h3>
          )}
        </Link>
      </div>
    </div>
  );
};
export default Feature;
