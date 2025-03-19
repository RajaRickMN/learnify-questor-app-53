
import React, { createContext, useContext, useState, useEffect } from "react";
import { MCQ, Flashcard, TestQuestion } from "@/utils/types";
import * as XLSX from "xlsx";

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
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      const data = await readExcelFile(file);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      setLoading(false);
      throw error;
    }
  };

  const readExcelFile = async (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });

          // Process Flashcards sheet
          if (workbook.SheetNames.includes("Flashcards")) {
            const flashcardsSheet = workbook.Sheets["Flashcards"];
            const flashcardsData = XLSX.utils.sheet_to_json(flashcardsSheet);
            
            const processedFlashcards: Flashcard[] = flashcardsData.map((row: any, index) => ({
              id: index + 1,
              question: row.question || "",
              answer: row.answer || "",
              subject: row.subject || "",
              topic: row.topic || "",
              status: Number(row.correct) > 0 
                ? "correct" 
                : Number(row.wrong) > 0 
                  ? "wrong" 
                  : "unattempted"
            }));
            
            setFlashcards(processedFlashcards);
          }

          // Process MCQs sheet
          if (workbook.SheetNames.includes("MCQs")) {
            const mcqsSheet = workbook.Sheets["MCQs"];
            const mcqsData = XLSX.utils.sheet_to_json(mcqsSheet);
            
            const processedMCQs: MCQ[] = mcqsData.map((row: any) => ({
              id: row["sl no"] || row.slno || row.id || Math.random().toString(36).substr(2, 9),
              question: row.question || "",
              optionA: row["option a"] || "",
              optionB: row["option b"] || "",
              optionC: row["option c"] || "",
              optionD: row["option d"] || "",
              key: row.key?.toLowerCase() || "a",
              explanation: row.fullexplanation || row.fullexplanataion || "",
              subject: row.subject || "",
              topic: row.topic || "",
              status: "unattempted"
            }));
            
            setMcqs(processedMCQs);
          }

          // Process Test App sheet
          if (workbook.SheetNames.includes("Test App")) {
            const testSheet = workbook.Sheets["Test App"];
            const testData = XLSX.utils.sheet_to_json(testSheet);
            
            const processedTests: TestQuestion[] = testData.map((row: any) => ({
              id: row["sl no"] || row.slno || row.id || Math.random().toString(36).substr(2, 9),
              question: row.question || "",
              optionA: row["option a"] || "",
              optionB: row["option b"] || "",
              optionC: row["option c"] || "",
              optionD: row["option d"] || "",
              key: row.key?.toLowerCase() || "a",
              explanation: row.fullexplanation || row.fullexplanataion || row["full explanation"] || "",
              subject: row.subject || "",
              topic: row.topic || "",
              testNumber: row["test number"] || 1,
              status: "unattempted"
            }));
            
            setTestQuestions(processedTests);
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
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
