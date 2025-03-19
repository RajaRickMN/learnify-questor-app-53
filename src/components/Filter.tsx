
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, RefreshCw } from "lucide-react";
import { FilterState, QuestionStatus } from "@/utils/types";
import StatusBadge from "./StatusBadge";

interface FilterProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  subjects: string[];
  topics: string[];
  testNumbers?: number[];
  counts: {
    correct: number;
    wrong: number;
    unattempted: number;
    total: number;
  };
  resetCorrect: () => void;
  resetWrong: () => void;
  resetAll: () => void;
}

const Filter: React.FC<FilterProps> = ({
  filterState,
  setFilterState,
  subjects,
  topics,
  testNumbers,
  counts,
  resetCorrect,
  resetWrong,
  resetAll,
}) => {
  return (
    <div className="space-y-6">
      <div className="p-4 border rounded-lg shadow-sm">
        <h3 className="font-medium mb-4">Filters</h3>

        {/* Test Numbers Filter (only for Test App) */}
        {testNumbers && testNumbers.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Test Number</h4>
            <div className="flex flex-wrap gap-2">
              {testNumbers.map((num) => (
                <Badge
                  key={num}
                  variant={
                    filterState.testNumber === num ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      testNumber:
                        prev.testNumber === num ? null : num,
                      // Reset subject and topic when test changes
                      subject: prev.testNumber === num ? prev.subject : null,
                      topic: prev.testNumber === num ? prev.topic : null,
                    }))
                  }
                >
                  {filterState.testNumber === num && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  Test {num}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Subject Filter */}
        {subjects.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Subject</h4>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Badge
                  key={subject}
                  variant={
                    filterState.subject === subject ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      subject: prev.subject === subject ? null : subject,
                      // Reset topic when subject changes
                      topic: prev.subject === subject ? prev.topic : null,
                    }))
                  }
                >
                  {filterState.subject === subject && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  {subject}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Topic Filter */}
        {filterState.subject && topics.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Topic</h4>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant={
                    filterState.topic === topic ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      topic: prev.topic === topic ? null : topic,
                    }))
                  }
                >
                  {filterState.topic === topic && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Status Filter */}
        <div>
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {(["correct", "wrong", "unattempted"] as QuestionStatus[]).map(
              (status) => (
                <Badge
                  key={status}
                  variant={
                    filterState.status === status ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    setFilterState((prev) => ({
                      ...prev,
                      status: prev.status === status ? null : status,
                    }))
                  }
                >
                  {filterState.status === status && (
                    <Check className="mr-1 h-3 w-3" />
                  )}
                  <StatusBadge
                    status={status}
                    showLabel={false}
                    className="mr-1"
                  />
                  {status === "correct" && counts.correct}
                  {status === "wrong" && counts.wrong}
                  {status === "unattempted" && counts.unattempted}
                </Badge>
              )
            )}
          </div>
        </div>
      </div>

      {/* Reset Actions */}
      <div className="p-4 border rounded-lg space-y-3">
        <h3 className="font-medium mb-2">Actions</h3>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-status-correct"
          onClick={resetCorrect}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Correct
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-status-wrong"
          onClick={resetWrong}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset Wrong
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={resetAll}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset All
        </Button>
      </div>

      {/* Stats */}
      <div className="text-center text-sm">
        <p className="text-muted-foreground">
          {counts.total} total items
        </p>
      </div>
    </div>
  );
};

export default Filter;
