
import { Flashcard, MCQ, TestQuestion } from "./types";

// Mock Flashcards
export const mockFlashcards: Flashcard[] = [
  {
    id: 1,
    question: "What is Python?",
    answer: "Python is a high-level programming language known for its readability and versatility.",
    subject: "Programming",
    topic: "Basics",
    status: "unattempted"
  },
  {
    id: 2,
    question: "What is a variable in programming?",
    answer: "A variable is a named storage location that contains a value which can be modified during program execution.",
    subject: "Programming",
    topic: "Fundamentals",
    status: "unattempted"
  },
  {
    id: 3,
    question: "What is Object-Oriented Programming?",
    answer: "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects, which can contain data and code: data in the form of fields, and code in the form of procedures.",
    subject: "Programming",
    topic: "OOP",
    status: "unattempted"
  },
  {
    id: 4,
    question: "What is a function in Python?",
    answer: "A function in Python is a block of reusable code that performs a specific task when called.",
    subject: "Programming",
    topic: "Functions",
    status: "unattempted"
  },
  {
    id: 5,
    question: "What is a list in Python?",
    answer: "A list in Python is an ordered, mutable collection of elements that can be of different types.",
    subject: "Programming",
    topic: "Data Structures",
    status: "unattempted"
  }
];

// Mock MCQs
export const mockMCQs: MCQ[] = [
  {
    id: 1,
    question: "Which of the following is not a Python data type?",
    optionA: "Integer",
    optionB: "String",
    optionC: "Array",
    optionD: "Float",
    key: "c",
    explanation: "Array is not a built-in data type in Python. Python uses Lists as an alternative to Arrays.",
    subject: "Programming",
    topic: "Python Basics",
    status: "unattempted"
  },
  {
    id: 2,
    question: "What does the 'self' parameter do in Python class methods?",
    optionA: "Refers to the class itself",
    optionB: "Refers to the instance of the class",
    optionC: "Refers to the parent class",
    optionD: "Is an optional parameter for class methods",
    key: "b",
    explanation: "In Python, 'self' refers to the instance of the class. It's used to access variables and methods of the class.",
    subject: "Programming",
    topic: "OOP",
    status: "unattempted"
  },
  {
    id: 3,
    question: "Which of the following is a valid way to create an empty list in Python?",
    optionA: "list = []",
    optionB: "list = list()",
    optionC: "list = {}",
    optionD: "Both A and B",
    key: "d",
    explanation: "Both [] and list() create empty lists in Python. {} creates an empty dictionary.",
    subject: "Programming",
    topic: "Data Structures",
    status: "unattempted"
  },
  {
    id: 4,
    question: "What is the output of the following code: print(3**2)?",
    optionA: "6",
    optionB: "9",
    optionC: "5",
    optionD: "Error",
    key: "b",
    explanation: "The ** operator represents exponentiation in Python. 3**2 is 3 raised to the power of 2, which equals 9.",
    subject: "Programming",
    topic: "Operators",
    status: "unattempted"
  },
  {
    id: 5,
    question: "Which of the following is used to handle exceptions in Python?",
    optionA: "if-else",
    optionB: "for-in",
    optionC: "try-except",
    optionD: "while-do",
    key: "c",
    explanation: "The try-except block is used to handle exceptions in Python. It allows you to gracefully catch and manage errors.",
    subject: "Programming",
    topic: "Error Handling",
    status: "unattempted"
  }
];

// Mock Test Questions
export const mockTestQuestions: TestQuestion[] = [
  {
    id: 1,
    question: "What does IDE stand for?",
    optionA: "Integrated Development Environment",
    optionB: "Internet Development Environment",
    optionC: "Integrated Design Environment",
    optionD: "Internal Development Environment",
    key: "a",
    explanation: "IDE stands for Integrated Development Environment. It's a software application that provides comprehensive facilities for software development.",
    subject: "Programming",
    topic: "Development Tools",
    testNumber: 1,
    status: "unattempted"
  },
  {
    id: 2,
    question: "Which language is primarily used for web development?",
    optionA: "Java",
    optionB: "Python",
    optionC: "JavaScript",
    optionD: "C++",
    key: "c",
    explanation: "JavaScript is primarily used for web development, especially for client-side scripting.",
    subject: "Programming",
    topic: "Web Development",
    testNumber: 1,
    status: "unattempted"
  },
  {
    id: 3,
    question: "What is the purpose of GitHub?",
    optionA: "A code editor",
    optionB: "A version control hosting platform",
    optionC: "A programming language",
    optionD: "A database management system",
    key: "b",
    explanation: "GitHub is a hosting platform for Git repositories that provides version control and collaboration features.",
    subject: "Programming",
    topic: "Version Control",
    testNumber: 1,
    status: "unattempted"
  },
  {
    id: 4,
    question: "What is the correct syntax for a for loop in Python?",
    optionA: "for i = 0; i < 5; i++",
    optionB: "for i in range(5)",
    optionC: "for (i = 0; i < 5; i++)",
    optionD: "loop i in range(5)",
    key: "b",
    explanation: "In Python, the correct syntax for a for loop is 'for i in range(5)'. This will iterate from 0 to 4.",
    subject: "Programming",
    topic: "Control Structures",
    testNumber: 2,
    status: "unattempted"
  },
  {
    id: 5,
    question: "Which of the following is not a database management system?",
    optionA: "MySQL",
    optionB: "MongoDB",
    optionC: "Oracle",
    optionD: "React",
    key: "d",
    explanation: "React is not a database management system. It's a JavaScript library for building user interfaces.",
    subject: "Programming",
    topic: "Databases",
    testNumber: 2,
    status: "unattempted"
  }
];

// Get unique subjects from the data
export const getUniqueSubjects = (
  data: (Flashcard | MCQ | TestQuestion)[]
): string[] => {
  const subjects = new Set<string>();
  data.forEach((item) => subjects.add(item.subject));
  return Array.from(subjects);
};

// Get unique topics for a given subject
export const getUniqueTopics = (
  data: (Flashcard | MCQ | TestQuestion)[],
  subject: string
): string[] => {
  const topics = new Set<string>();
  data
    .filter((item) => item.subject === subject)
    .forEach((item) => topics.add(item.topic));
  return Array.from(topics);
};

// Get unique test numbers (for TestQuestion only)
export const getUniqueTestNumbers = (
  data: TestQuestion[]
): number[] => {
  const testNumbers = new Set<number>();
  data.forEach((item) => testNumbers.add(item.testNumber));
  return Array.from(testNumbers).sort((a, b) => a - b);
};
