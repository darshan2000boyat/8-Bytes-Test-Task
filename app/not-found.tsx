"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
      <Image
        src="/404.svg"
        alt="Page not found"
        width={400}
        height={300}
        className="mb-6"
      />
      <h1 className="text-5xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-lg text-gray-600">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <button
        onClick={() => router.back()}
        className="cursor-pointer mt-6 px-6 py-3 btn btn-primary text-white rounded-lg transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default NotFound;
