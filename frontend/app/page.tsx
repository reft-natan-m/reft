import Image from "next/image";
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'REFT Home Page',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-5xl max-[500px]:text-2xl">Hello REFT bois</h1>
    </main>
  );
}
