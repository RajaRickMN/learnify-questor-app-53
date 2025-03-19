
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const Header = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center">
            {!isHome ? (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="mr-2"
                aria-label="Back to home"
              >
                <Link to="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="mr-2"
                aria-label="Home"
              >
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <h1 className="text-lg font-medium">
              {isHome
                ? "Interactive Learning App"
                : location.pathname === "/flashcards"
                ? "Flashcards"
                : location.pathname === "/mcqs"
                ? "Multiple Choice Questions"
                : location.pathname === "/test-app"
                ? "Test App"
                : ""}
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
