import React from "react";

export const Button = ({ className, divClassName, text = "Submit" }) => {
  return (
    <button className={`button ${className}`}>
      <div className={`submit ${divClassName}`}>{text}</div>
    </button>
  );
};
