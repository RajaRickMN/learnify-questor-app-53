
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterState, QuestionStatus } from "@/utils/types";
import { getUniqueSubjects, getUniqueTopics } from "@/utils/mockData";
import Header from "@/components/Header";
import Filter from "@/components/Filter";
import FlashcardItem from "@/components/FlashcardItem";
import { useData } from "@/context/DataContext";
import { Progress } from "@/components/ui/progress";

const Flashcards = () => {
  const { flashcards: dataFlashcards, loading } = useData();
  const [flashcards, setFlashcards] = useState(dataFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterState, setFilterState] = useState<FilterState>({
    subject: null,
    topic: null,
    status: null,
  });

  // Update local state when data changes
  useEffect(() => {
    setFlashcards(dataFlashcards);
  }, [dataFlashcards]);

  // Get filtered flashcards
  const filteredFlashcards = flashcards.filter((card) => {
    const subjectMatch = !filterState.subject || card.subject === filterState.subject;
    const topicMatch = !filterState.topic || card.topic === filterState.topic;
    const statusMatch = !filterState.status || card.status === filterState.status;
    
    return subjectMatch && topicMatch && statusMatch;
  });

  // Reset current index when filtered cards change
  useEffect(() => {
    setCurrentIndex(0);
  }, [filteredFlashcards.length]);

  // Get unique subjects and topics for filter
  const subjects = getUniqueSubjects(flashcards);
  const topics = filterState.subject
    ? getUniqueTopics(
        flashcards,
        filterState.subject
      )
    : [];

  // Status counts for filter display
  const counts = {
    correct: flashcards.filter((card) => card.status === "correct").length,
    wrong: flashcards.filter((card) => card.status === "wrong").length,
    unattempted: flashcards.filter(
      (card) => card.status === "unattempted"
    ).length,
    total: flashcards.length,
  };

  // Handle changing the status of a flashcard
  const handleStatusChange = (id: string | number, status: QuestionStatus) => {
    setFlashcards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, status } : card))
    );
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Reset status handlers
  const resetCorrect = () => {
    setFlashcards(prev => 
      prev.map(card => card.status === "correct" ? { ...card, status: "unattempted" } : card)
    );
  };

  const resetWrong = () => {
    setFlashcards(prev => 
      prev.map(card => card.status === "wrong" ? { ...card, status: "unattempted" } : card)
    );
  };

  const resetAll = () => {
    setFlashcards(prev => 
      prev.map(card => ({ ...card, status: "unattempted" }))
    );
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
                counts={counts}
                resetCorrect={resetCorrect}
                resetWrong={resetWrong}
                resetAll={resetAll}
              />
            </div>

            {/* Main content */}
            <div className="order-1 md:order-2">
              {filteredFlashcards.length > 0 ? (
                <div className="space-y-8">
                  <Progress value={((currentIndex + 1) / filteredFlashcards.length) * 100} className="h-2" />

                  <div className="text-center text-sm text-muted-foreground">
                    Card {currentIndex + 1} of {filteredFlashcards.length}
                  </div>

                  <FlashcardItem
                    flashcard={filteredFlashcards[currentIndex]}
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
                      disabled={currentIndex === filteredFlashcards.length - 1}
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
                  <div className="text-xl font-medium">No flashcards found</div>
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

export default Flashcards;
