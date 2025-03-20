
import * as XLSX from "xlsx";
import { MCQ, Flashcard, TestQuestion } from "@/utils/types";

/**
 * Fetches and processes the Excel file from GitHub
 */
export const fetchAndProcessGithubExcel = async (): Promise<{
  flashcards: Flashcard[];
  mcqs: MCQ[];
  testQuestions: TestQuestion[];
}> => {
  const GITHUB_URLS = [
    "https://raw.githubusercontent.com/RajaRickMN/learnify-questor-app-53/main/app.xlsx",
    "https://github.com/RajaRickMN/learnify-questor-app-53/raw/main/app.xlsx",
    "https://github.com/RajaRickMN/learnify-questor-app-53/blob/main/app.xlsx?raw=true"
  ];
  
  let lastError: Error | null = null;
  
  for (const url of GITHUB_URLS) {
    try {
      console.log(`Attempting to fetch from: ${url}`);
      const response = await fetch(url, { 
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.log(`URL ${url} failed with status: ${response.status}`);
        continue;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      
      console.log("Workbook sheets:", workbook.SheetNames);
      
      let flashcards: Flashcard[] = [];
      let mcqs: MCQ[] = [];
      let testQuestions: TestQuestion[] = [];
      
      if (workbook.SheetNames.includes("Flashcards")) {
        flashcards = processFlashcardsSheet(workbook.Sheets["Flashcards"]);
      }

      if (workbook.SheetNames.includes("MCQs")) {
        mcqs = processMCQsSheet(workbook.Sheets["MCQs"]);
      }

      const testSheetNames = ["Test App", "Test", "TestApp"];
      const testSheetName = testSheetNames.find(name => workbook.SheetNames.includes(name));
      
      if (testSheetName) {
        testQuestions = processTestSheet(workbook.Sheets[testSheetName]);
      }

      return {
        flashcards,
        mcqs,
        testQuestions
      };
    } catch (error) {
      console.error(`Error with URL ${url}:`, error);
      lastError = error as Error;
    }
  }
  
  throw lastError || new Error("Failed to fetch Excel file from all GitHub URLs");
};

/**
 * Processes an Excel file and extracts flashcards, MCQs, and test questions
 */
export const processExcelFile = async (file: File): Promise<{
  flashcards: Flashcard[];
  mcqs: MCQ[];
  testQuestions: TestQuestion[];
}> => {
  return new Promise<{
    flashcards: Flashcard[];
    mcqs: MCQ[];
    testQuestions: TestQuestion[];
  }>((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        console.log("Workbook sheets:", workbook.SheetNames);
        
        let flashcards: Flashcard[] = [];
        let mcqs: MCQ[] = [];
        let testQuestions: TestQuestion[] = [];
        
        if (workbook.SheetNames.includes("Flashcards")) {
          flashcards = processFlashcardsSheet(workbook.Sheets["Flashcards"]);
        }

        if (workbook.SheetNames.includes("MCQs")) {
          mcqs = processMCQsSheet(workbook.Sheets["MCQs"]);
        }

        const testSheetNames = ["Test App", "Test", "TestApp"];
        const testSheetName = testSheetNames.find(name => workbook.SheetNames.includes(name));
        
        if (testSheetName) {
          testQuestions = processTestSheet(workbook.Sheets[testSheetName]);
        }

        resolve({
          flashcards,
          mcqs,
          testQuestions
        });
      } catch (error) {
        console.error("Error processing Excel file:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

/**
 * Process the Flashcards sheet from an Excel workbook
 */
const processFlashcardsSheet = (sheet: XLSX.WorkSheet): Flashcard[] => {
  const flashcardsData = XLSX.utils.sheet_to_json(sheet);
  console.log("Flashcards data:", flashcardsData);
  
  return flashcardsData.map((row: any, index) => ({
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
};

/**
 * Process the MCQs sheet from an Excel workbook
 */
const processMCQsSheet = (sheet: XLSX.WorkSheet): MCQ[] => {
  const mcqsData = XLSX.utils.sheet_to_json(sheet);
  console.log("MCQs data:", mcqsData);
  
  if (mcqsData.length === 0) {
    return [];
  }
  
  console.log("Sample MCQ row:", mcqsData[0]);
  
  return mcqsData.map((row: any, index) => {
    const normalizedRow = Object.keys(row).reduce((acc: any, key: string) => {
      const lcKey = key.toLowerCase();
      
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
};

/**
 * Process the Test sheet from an Excel workbook
 */
const processTestSheet = (sheet: XLSX.WorkSheet): TestQuestion[] => {
  const testData = XLSX.utils.sheet_to_json(sheet);
  console.log("Test data:", testData);
  
  if (testData.length === 0) {
    return [];
  }
  
  console.log("Sample test row:", testData[0]);
  
  return testData.map((row: any, index) => {
    const normalizedRow = Object.keys(row).reduce((acc: any, key: string) => {
      const lcKey = key.toLowerCase();
      
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
};
