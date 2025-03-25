import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-1 rounded-full transition-all duration-300 border border-primary text-primary",
      )}
    >
      {theme === "light" ? <Moon size={10} /> : <Sun size={10} />}
    </button>
  );
}
