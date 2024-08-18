import React from "react";
import Header from "../shared/Header";
import { cn } from "@/lib/utils";

interface IProps {
  children: React.ReactNode[] | React.ReactNode;
}
export default function PageLayout({ children }: IProps) {
  const header = Array.isArray(children)
    ? children.find((child) => React.isValidElement(child) && child.type === Header)
    : null;

  const childrenWithoutHeader = Array.isArray(children)
    ? children.filter((child) => {
        return React.isValidElement(child) && child.type !== Header;
      })
    : children;

  return (
    <>
      {header}
      <main className={
        cn("flex flex-1 max-h-[calc(100vh-60px)] flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto", {
          'mb-14': !!header,
        })
      }>
        {childrenWithoutHeader}
      </main>
    </>
  );
}
