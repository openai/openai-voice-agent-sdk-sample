import clsx from "clsx";
import React from "react";
import ReactMarkdown from "react-markdown";

type CustomLinkProps = {
  href?: string;
  children?: React.ReactNode;
};

const CustomLink = ({ href, children, ...props }: CustomLinkProps) => (
  <a
    href={href}
    {...props}
    className="bg-gray-200 rounded-full py-1 px-2 text-sm font-medium hover:text-white hover:bg-black dark:bg-gray-700 dark:hover:bg-white dark:hover:text-black"
  >
    {children}
  </a>
);

type TextMessageProps = {
  text: string;
  isUser: boolean;
};

export function TextMessage({ text, isUser }: TextMessageProps) {
  return (
    <div
      className={clsx("flex flex-row gap-2", {
        "justify-end py-2": isUser,
      })}
    >
      <div
        className={clsx("rounded-[20px]", {
          "px-4 max-w-[90%] ml-4 text-stone-900 dark:text-stone-900 bg-[#ededed] dark:bg-gray-300": isUser, 
          "px-4 max-w-[90%] mr-4 text-black bg-white dark:bg-gray-800 dark:text-white": !isUser, 
        })}
      >
        <ReactMarkdown components={{ a: CustomLink }}>{text}</ReactMarkdown>
      </div>
    </div>
  );
}
