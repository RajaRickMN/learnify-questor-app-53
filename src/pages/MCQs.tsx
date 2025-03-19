
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MCQ, FilterState, QuestionStatus } from "@/utils/types";
import { mockMCQs, getUniqueSubjects, getUniqueTopics } from "@/utils/mockData";
import Header from "@/components/Header";
import Filter from "@/components/Filter";
import MCQItem from "@/components/MCQItem";

const MCQs = () => {
  const [mcqs, setMCQs] = useState<MCQ[]>(mockMCQs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    subject: null,
    topic: null,
    status: null,
  });

  // Get filtered MCQs
  const filteredMCQs = mcqs.filter((mcq) => {
    const subjectMatch = !filterState.subject || mcq.subject === filterState.subject;
    const topicMatch = !filterState.topic || mcq.topic === filterState.topic;
    const statusMatch = !filterState.status || mcq.status === filterState.status;
    
    return subjectMatch && topicMatch && statusMatch;
  });

  // Reset current index when filtered MCQs change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredMCQs.length]);

  // Get unique subjects and topics for filter
  const subjects = getUniqueSubjects(mcqs);
  const topics = filterState.subject
    ? getUniqueTopics(
        mcqs,
        filterState.subject
      )
    : [];

  // Status counts for filter display
  const counts = {
    correct: mcqs.filter((mcq) => mcq.status === "correct").length,
    wrong: mcqs.filter((mcq) => mcq.status === "wrong").length,
    unattempted: mcqs.filter(
      (mcq) => mcq.status === "unattempted"
    ).length,
    total: mcqs.length,
  };

  // Handle changing the status of an MCQ
  const handleStatusChange = (id: string | number, status: QuestionStatus) => {
    setMCQs((prev) =>
      prev.map((mcq) => (mcq.id === id ? { ...mcq, status } : mcq))
    );
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredMCQs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container max-w-screen-2xl py-8">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
          {/* Sidebar filter */}
          <div className="order-2 md:order-1">
            <Filter
              filterState={filterState}
              setFilterState={setFilterState}
              subjects={subjects}
              topics={topics}
              counts={counts}
            />
          </div>

          {/* Main content */}
          <div className="order-1 md:order-2">
            {filteredMCQs.length > 0 ? (
              <div className="space-y-8">
                <div className="progress-bar">
                  <div
                    className="progress-value"
                    style={{
                      width: `${
                        ((currentIndex + 1) / filteredMCQs.length) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Question {currentIndex + 1} of {filteredMCQs.length}
                </div>

                <MCQItem
                  mcq={filteredMCQs[currentIndex]}
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
                    disabled={currentIndex === filteredMCQs.length - 1}
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
                <div className="text-xl font-medium">No questions found</div>
                <p className="text-muted-foreground mt-2">
                  Try changing your filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQs;
