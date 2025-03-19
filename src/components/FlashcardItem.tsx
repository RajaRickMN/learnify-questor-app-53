
import React, { useState } from "react";
import { Flashcard, QuestionStatus } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Rotate3D, Edit } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface FlashcardItemProps {
  flashcard: Flashcard;
  onStatusChange: (id: string | number, status: QuestionStatus) => void;
}

const FlashcardItem: React.FC<FlashcardItemProps> = ({
  flashcard,
  onStatusChange,
}) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${flipped ? "flipped" : ""}`}>
        <div className="flashcard-front question-card border shadow p-8 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="text-sm text-muted-foreground">
              <span>{flashcard.subject}</span>
              <span className="mx-2">•</span>
              <span>{flashcard.topic}</span>
            </div>
            <StatusBadge status={flashcard.status} />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <h2 className="text-2xl font-medium text-center">{flashcard.question}</h2>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleFlip}
              variant="default"
              className="flex items-center gap-2"
            >
              <Rotate3D className="h-4 w-4" />
              Show Answer
            </Button>
          </div>
        </div>

        <div className="flashcard-back question-card border shadow p-8 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="text-sm text-muted-foreground">
              <span>{flashcard.subject}</span>
              <span className="mx-2">•</span>
              <span>{flashcard.topic}</span>
            </div>
            <StatusBadge status={flashcard.status} />
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xl text-center">{flashcard.answer}</p>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Button
                onClick={() => onStatusChange(flashcard.id, "correct")}
                variant="outline"
                className="flex items-center gap-2 text-status-correct border-status-correct/30 hover:bg-status-correct/10"
              >
                <CheckCircle className="h-4 w-4" />
                I Got It Right
              </Button>
              
              <Button
                onClick={() => onStatusChange(flashcard.id, "wrong")}
                variant="outline"
                className="flex items-center gap-2 text-status-wrong border-status-wrong/30 hover:bg-status-wrong/10"
              >
                <XCircle className="h-4 w-4" />
                I Got It Wrong
              </Button>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={handleFlip}
                variant="secondary"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
              >
                <Rotate3D className="h-4 w-4" />
                Back to Question
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardItem;
