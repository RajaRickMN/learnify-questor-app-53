
import React, { createContext, useContext, useState, useEffect } from "react";
import { MCQ, Flashcard, TestQuestion } from "@/utils/types";
import * as XLSX from "xlsx";
import { toast } from "sonner";

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
      await readExcelFile(file);
      toast.success("Excel file uploaded successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      toast.error("Error uploading Excel file");
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
          console.log("Workbook sheets:", workbook.SheetNames);
          
          // Process Flashcards sheet
          if (workbook.SheetNames.includes("Flashcards")) {
            const flashcardsSheet = workbook.Sheets["Flashcards"];
            const flashcardsData = XLSX.utils.sheet_to_json(flashcardsSheet);
            console.log("Flashcards data:", flashcardsData);
            
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
            console.log("MCQs data:", mcqsData);
            
            if (mcqsData.length > 0) {
              // Log the first row to see the field names
              console.log("Sample MCQ row:", mcqsData[0]);
              
              const processedMCQs: MCQ[] = mcqsData.map((row: any, index) => {
                // Create a normalized version of keys to handle different formats
                const normalizedRow = Object.keys(row).reduce((acc: any, key: string) => {
                  // Convert the key to lowercase for normalization
                  const lcKey = key.toLowerCase();
                  
                  // Map the key to a standard format
                  if (lcKey.includes("sl no") || lcKey.includes("slno") || lcKey.includes("id")) {
                    acc.id = row[key];
                  } else if (lcKey === "question") {
                    acc.question = row[key];
                  } else if (lcKey === "option a" || lcKey === "optiona" || lcKey === "opton a") {
                    acc.optionA = row[key];
                  } else if (lcKey === "option b" || lcKey === "optionb" || lcKey === "opton b") {
                    acc.optionB = row[key];
                  } else if (lcKey === "option c" || lcKey === "optionc" || lcKey === "opton c") {
                    acc.optionC = row[key];
                  } else if (lcKey === "option d" || lcKey === "optiond" || lcKey === "opton d") {
                    acc.optionD = row[key];
                  } else if (lcKey === "key" || lcKey === "answer") {
                    acc.key = String(row[key]).toLowerCase();
                  } else if (lcKey.includes("explanation") || lcKey.includes("exp")) {
                    acc.explanation = row[key];
                  } else if (lcKey === "subject") {
                    acc.subject = row[key];
                  } else if (lcKey === "topic") {
                    acc.topic = row[key];
                  }
                  
                  return acc;
                }, {});
                
                return {
                  id: normalizedRow.id || index + 1,
                  question: normalizedRow.question || "",
                  optionA: normalizedRow.optionA || "",
                  optionB: normalizedRow.optionB || "",
                  optionC: normalizedRow.optionC || "",
                  optionD: normalizedRow.optionD || "",
                  key: normalizedRow.key || "a",
                  explanation: normalizedRow.explanation || "",
                  subject: normalizedRow.subject || "",
                  topic: normalizedRow.topic || "",
                  status: "unattempted"
                };
              });
              
              console.log("Processed MCQs:", processedMCQs);
              setMCQs(processedMCQs);
            }
          }

          // Process Test App sheet
          const testSheetNames = ["Test App", "Test", "TestApp"];
          const testSheetName = testSheetNames.find(name => workbook.SheetNames.includes(name));
          
          if (testSheetName) {
            const testSheet = workbook.Sheets[testSheetName];
            const testData = XLSX.utils.sheet_to_json(testSheet);
            console.log("Test data:", testData);
            
            if (testData.length > 0) {
              // Log the first row to see the field names
              console.log("Sample test row:", testData[0]);
              
              const processedTests: TestQuestion[] = testData.map((row: any, index) => {
                // Create a normalized version of keys to handle different formats
                const normalizedRow = Object.keys(row).reduce((acc: any, key: string) => {
                  // Convert the key to lowercase for normalization
                  const lcKey = key.toLowerCase();
                  
                  // Map the key to a standard format
                  if (lcKey.includes("sl no") || lcKey.includes("slno") || lcKey.includes("id")) {
                    acc.id = row[key];
                  } else if (lcKey === "question") {
                    acc.question = row[key];
                  } else if (lcKey === "option a" || lcKey === "optiona" || lcKey === "opton a") {
                    acc.optionA = row[key];
                  } else if (lcKey === "option b" || lcKey === "optionb" || lcKey === "opton b") {
                    acc.optionB = row[key];
                  } else if (lcKey === "option c" || lcKey === "optionc" || lcKey === "opton c") {
                    acc.optionC = row[key];
                  } else if (lcKey === "option d" || lcKey === "optiond" || lcKey === "opton d") {
                    acc.optionD = row[key];
                  } else if (lcKey === "key" || lcKey === "answer") {
                    acc.key = String(row[key]).toLowerCase();
                  } else if (lcKey.includes("explanation") || lcKey.includes("exp")) {
                    acc.explanation = row[key];
                  } else if (lcKey === "subject") {
                    acc.subject = row[key];
                  } else if (lcKey === "topic") {
                    acc.topic = row[key];
                  } else if (lcKey.includes("test number") || lcKey.includes("testnumber")) {
                    acc.testNumber = row[key];
                  }
                  
                  return acc;
                }, {});
                
                return {
                  id: normalizedRow.id || index + 1,
                  question: normalizedRow.question || "",
                  optionA: normalizedRow.optionA || "",
                  optionB: normalizedRow.optionB || "",
                  optionC: normalizedRow.optionC || "",
                  optionD: normalizedRow.optionD || "",
                  key: normalizedRow.key || "a",
                  explanation: normalizedRow.explanation || "",
                  subject: normalizedRow.subject || "",
                  topic: normalizedRow.topic || "",
                  testNumber: normalizedRow.testNumber || 1,
                  status: "unattempted"
                };
              });
              
              console.log("Processed Tests:", processedTests);
              setTestQuestions(processedTests);
            }
          }

          resolve();
        } catch (error) {
          console.error("Error processing Excel file:", error);
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
