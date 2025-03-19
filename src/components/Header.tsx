
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="icon"
            className="mr-2"
          >
            <Home className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Learning App</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
