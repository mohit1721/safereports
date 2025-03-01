import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="bg-white/10 w-full backdrop-blur-xl shadow-lg rounded-lg p-5 border border-gray-200">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
};

export default Card;
