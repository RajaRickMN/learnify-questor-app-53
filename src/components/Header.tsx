
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Upload } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { useToast } from "@/hooks/use-toast";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid file format",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive",
      });
      return;
    }

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Trigger an event to handle the upload in a parent component
      const event = new CustomEvent('excel-upload', { detail: { file } });
      window.dispatchEvent(event);
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      });
    }
  };

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
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Excel
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            className="hidden"
          />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
