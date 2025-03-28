
import React, { useState } from "react";
import { MCQ, QuestionStatus } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "./StatusBadge";

interface MCQItemProps {
  mcq: MCQ;
  onStatusChange: (id: string | number, status: QuestionStatus) => void;
}

// Helper function to format text with newlines
const formatText = (text: string) => {
  if (!text) return '';
  return text.split('\\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < text.split('\\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

const MCQItem: React.FC<MCQItemProps> = ({ mcq, onStatusChange }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent changing after selection
    
    setSelectedOption(option);
    
    if (option === mcq.key) {
      onStatusChange(mcq.id, "correct");
    } else {
      onStatusChange(mcq.id, "wrong");
      setShowExplanation(true);
    }
  };

  const getOptionClassName = (option: string) => {
    if (!selectedOption) {
      return "border-border hover:border-primary hover:bg-secondary";
    }
    
    if (option === mcq.key) {
      return "border-status-correct bg-status-correct/10";
    }
    
    if (option === selectedOption && selectedOption !== mcq.key) {
      return "border-status-wrong bg-status-wrong/10";
    }
    
    return "border-border opacity-60";
  };

  const resetQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    onStatusChange(mcq.id, "unattempted");
  };

  return (
    <div className="question-card p-6 animate-scale-in">
      <div className="flex justify-between items-start">
        <div className="text-sm text-muted-foreground">
          <span>{mcq.subject}</span>
          <span className="mx-2">•</span>
          <span>{mcq.topic}</span>
        </div>
        <StatusBadge status={mcq.status} />
      </div>
      
      <div className="mt-4">
        <h3 className="text-xl font-medium mb-6">{formatText(mcq.question)}</h3>
        
        <div className="space-y-3">
          {[
            { key: "a", text: mcq.optionA },
            { key: "b", text: mcq.optionB },
            { key: "c", text: mcq.optionC },
            { key: "d", text: mcq.optionD },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => handleOptionSelect(option.key)}
              disabled={!!selectedOption}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-colors",
                getOptionClassName(option.key)
              )}
            >
              <div className="flex items-start">
                <div className="flex items-center justify-center rounded-full w-6 h-6 border border-current mr-3 flex-shrink-0">
                  {option.key.toUpperCase()}
                </div>
                <div className="flex-1">{formatText(option.text)}</div>
                {selectedOption === option.key && option.key === mcq.key && (
                  <CheckCircle className="h-5 w-5 text-status-correct ml-2 flex-shrink-0" />
                )}
                {selectedOption === option.key && option.key !== mcq.key && (
                  <XCircle className="h-5 w-5 text-status-wrong ml-2 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
        
        {showExplanation && (
          <div className="mt-6 p-4 border border-border rounded-lg bg-secondary/50 animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Explanation</p>
                <p className="text-muted-foreground mt-1">{formatText(mcq.explanation)}</p>
              </div>
            </div>
          </div>
        )}
        
        {selectedOption && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={resetQuestion} 
              variant="outline" 
              size="sm"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQItem;
