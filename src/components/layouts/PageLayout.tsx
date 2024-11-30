import React from "react";
import Header from "../shared/Header";
import { cn } from "@/lib/utils";
import Head from "next/head";


interface IProps {
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
  title?: string;
}
export default function PageLayout({ children, className, title }: IProps) {
  const header = Array.isArray(children)
    ? children.find(
        (child) => React.isValidElement(child) && child.type === Header
      )
    : null;

  const childrenWithoutHeader = Array.isArray(children)
    ? children.filter((child) => {
        return React.isValidElement(child) && child.type !== Header;
      })
    : children;

  return (
    <div>
      {header}
      <main
        className={cn(
          "flex flex-1 max-h-[calc(100vh-60px)] flex-col gap-4 overflow-y-auto mx-auto",
          {
            "mb-14": !!header,
          },
          className
        )}
      >
        {childrenWithoutHeader}
      </main>
    </div>
  );
}
