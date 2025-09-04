import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-white shadow-sm rounded-lg p-4 flex flex-col justify-between ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
