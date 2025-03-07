import React from "react";
import Image from "next/image"; // If using Next.js
import "./style.css";

interface Props {
  type: "left-right" | "single" | "up-down";
  className?: string;
  iconText?: string;
  iconTextClassName?: string;
  iconText2?: string;
}

export const Content = ({
  type,
  className = "",
  iconText = "twenty",
  iconTextClassName = "",
  iconText2 = "Text",
}: Props): JSX.Element => {
  return (
    <div className={`content ${type} ${className}`}>
      {["left-right", "up-down"].includes(type) && (
        <>
          <div className="icon-text">
            <Image src="/icons/icon8.svg" alt="Icon8" width={20} height={20} />
            <span className="text">{iconText2}</span>
          </div>
          <div className="icon-set">
            <Image src="/icons/icon8.svg" alt="Icon8" width={20} height={20} />
          </div>
        </>
      )}

      {type === "single" && (
        <div className={`icon-text ${iconTextClassName}`}>
          <Image src="/icons/icon8.svg" alt="Icon8" width={20} height={20} />
          <span className="text">{iconText2}</span>
        </div>
      )}
    </div>
  );
};
