
import React, { createContext, useContext, useState, useEffect } from "react";
import { MCQ, Flashcard, TestQuestion } from "@/utils/types";
import { toast } from "sonner";
import { processExcelFile, fetchAndProcessGithubExcel } from "@/utils/excelProcessor";

interface DataContextType {
  flashcards: Flashcard[];
  mcqs: MCQ[];
  testQuestions: TestQuestion[];
  loading: boolean;
  handleExcelUpload: (file: File) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [mcqs, setMCQs] = useState<MCQ[]>([]);
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Load GitHub Excel file on component mount
  useEffect(() => {
    const loadGithubExcel = async () => {
      setLoading(true);
      try {
        console.log("Attempting to load Excel file from GitHub...");
        const data = await fetchAndProcessGithubExcel();
        console.log("Excel data loaded successfully", data);
        setFlashcards(data.flashcards);
        setMCQs(data.mcqs);
        setTestQuestions(data.testQuestions);
        toast.success("Excel data loaded successfully");
      } catch (error) {
        console.error("Error loading Excel file from GitHub:", error);
        // Show a more user-friendly message
        toast.error("Please upload your Excel file using the upload button");
        // We don't set error state here because we want the app to be usable
        // without requiring a GitHub file
      } finally {
        setLoading(false);
      }
    };

    loadGithubExcel();
  }, []);

  useEffect(() => {
    // Listen for the excel-upload event
    const handleUploadEvent = (e: CustomEvent<{ file: File }>) => {
      handleExcelUpload(e.detail.file);
    };

    window.addEventListener(
      "excel-upload",
      handleUploadEvent as EventListener
    );

    return () => {
      window.removeEventListener(
        "excel-upload",
        handleUploadEvent as EventListener
      );
    };
  }, []);

  const handleExcelUpload = async (file: File) => {
    setLoading(true);
    try {
      const data = await processExcelFile(file);
      setFlashcards(data.flashcards);
      setMCQs(data.mcqs);
      setTestQuestions(data.testQuestions);
      toast.success("Excel file uploaded successfully");
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast.error("Error uploading Excel file");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        flashcards,
        mcqs,
        testQuestions,
        loading,
        handleExcelUpload,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
