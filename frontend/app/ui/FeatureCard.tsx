"use client";

import { Card } from "flowbite-react";

interface FeatureCardProps {
  feature: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  switch (feature) {
    case 1:
      return (
        <Card className="max-w-lg">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Own a Piece of Prime Real Estate
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            With our platform, you can tokenize your property, breaking it down
            into manageable fractions. Whether you're a property owner looking
            to unlock liquidity or an investor seeking to diversify your
            portfolio, fractional ownership opens up a world of possibilities.
          </p>
        </Card>
      );
    case 2:
      return (
        <Card className="max-w-lg">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Real Estate, Without Borders
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Say goodbye to geographical constraints. Our blockchain-based
            platform enables users from around the globe to invest in real
            estate assets effortlessly. Whether it's a luxury apartment in New
            York or a beachfront villa in Bali, the world is your oyster.
          </p>
        </Card>
      );
    case 3:
      return (
        <Card className="max-w-lg">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Trust Through Transparency
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Transparency is the cornerstone of our platform. Every transaction,
            from token issuance to property management, is recorded on the
            blockchain, providing immutable proof of ownership and fostering
            trust among investors and property owners alike.
          </p>
        </Card>
      );
    case 4:
      return (
        <Card className="max-w-lg">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Unleash the Power of Liquid Assets
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Tired of waiting for the right buyer? With tokenized real estate,
            liquidity is just a click away. Easily buy, sell, or trade property
            tokens on our platform, giving you the freedom to optimize your
            investment portfolio according to your needs and market conditions.
          </p>
        </Card>
      );
    default:
      return (
        <Card className="max-w-sm">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Default Feature
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            This should never be shown
          </p>
        </Card>
      );
  }
};
export default FeatureCard;
