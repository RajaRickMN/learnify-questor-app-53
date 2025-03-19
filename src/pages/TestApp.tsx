
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TestQuestion, FilterState, QuestionStatus } from "@/utils/types";
import { getUniqueSubjects, getUniqueTopics, getUniqueTestNumbers } from "@/utils/mockData";
import Header from "@/components/Header";
import Filter from "@/components/Filter";
import TestItem from "@/components/TestItem";
import { useData } from "@/context/DataContext";

const TestApp = () => {
  const { testQuestions: dataTestQuestions, loading } = useData();
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>(dataTestQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    subject: null,
    topic: null,
    testNumber: null,
    status: null,
  });

  // Update local state when data changes
  useEffect(() => {
    setTestQuestions(dataTestQuestions);
  }, [dataTestQuestions]);

  // Get filtered test questions
  const filteredQuestions = testQuestions.filter((question) => {
    const testMatch = !filterState.testNumber || question.testNumber === filterState.testNumber;
    const subjectMatch = !filterState.subject || question.subject === filterState.subject;
    const topicMatch = !filterState.topic || question.topic === filterState.topic;
    const statusMatch = !filterState.status || question.status === filterState.status;
    
    return testMatch && subjectMatch && topicMatch && statusMatch;
  });

  // Reset current index when filtered questions change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredQuestions.length]);

  // Get unique test numbers, subjects, and topics for filter
  const testNumbers = getUniqueTestNumbers(testQuestions);
  const subjects = filterState.testNumber 
    ? getUniqueSubjects(testQuestions.filter(q => q.testNumber === filterState.testNumber))
    : getUniqueSubjects(testQuestions);
  
  const topics = filterState.subject
    ? getUniqueTopics(
        filterState.testNumber
          ? testQuestions.filter(q => q.testNumber === filterState.testNumber)
          : testQuestions,
        filterState.subject
      )
    : [];

  // Status counts for filter display
  const counts = {
    correct: testQuestions.filter((q) => q.status === "correct").length,
    wrong: testQuestions.filter((q) => q.status === "wrong").length,
    unattempted: testQuestions.filter(
      (q) => q.status === "unattempted"
    ).length,
    total: testQuestions.length,
  };

  // Handle changing the status of a test question
  const handleStatusChange = (id: string | number, status: QuestionStatus) => {
    setTestQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container max-w-screen-2xl py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-xl">Loading data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            {/* Sidebar filter */}
            <div className="order-2 md:order-1">
              <Filter
                filterState={filterState}
                setFilterState={setFilterState}
                subjects={subjects}
                topics={topics}
                testNumbers={testNumbers}
                counts={counts}
              />
            </div>

            {/* Main content */}
            <div className="order-1 md:order-2">
              {filteredQuestions.length > 0 ? (
                <div className="space-y-8">
                  <div className="progress-bar">
                    <div
                      className="progress-value"
                      style={{
                        width: `${
                          ((currentIndex + 1) / filteredQuestions.length) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Question {currentIndex + 1} of {filteredQuestions.length}
                  </div>

                  <TestItem
                    question={filteredQuestions[currentIndex]}
                    onStatusChange={handleStatusChange}
                  />

                  <div className="flex justify-between items-center">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <Button
                      onClick={handleNext}
                      disabled={currentIndex === filteredQuestions.length - 1}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                  <div className="text-xl font-medium">No test questions found</div>
                  <p className="text-muted-foreground mt-2">
                    Try changing your filter criteria or upload an Excel file
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestApp;
