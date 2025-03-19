
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { FilterState } from "@/utils/types";
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
}

const Filter: React.FC<FilterProps> = ({
  filterState,
  setFilterState,
  subjects,
  topics,
  testNumbers,
  counts,
}) => {
  const handleReset = (type: "correct" | "wrong" | "all") => {
    if (type === "all") {
      setFilterState({
        ...filterState,
        subject: null,
        topic: null,
        testNumber: null,
        status: null,
      });
    } else {
      setFilterState({
        ...filterState,
        status: null,
      });
    }
  };

  return (
    <div className="filter-section animate-slide-up">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Filters</h3>
        
        {testNumbers && (
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Test Number</label>
            <Select
              value={filterState.testNumber?.toString() || ""}
              onValueChange={(value) =>
                setFilterState({
                  ...filterState,
                  testNumber: value ? parseInt(value) : null,
                  subject: null,
                  topic: null,
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select test number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tests</SelectItem>
                {testNumbers.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Test {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Subject</label>
          <Select
            value={filterState.subject || ""}
            onValueChange={(value) =>
              setFilterState({
                ...filterState,
                subject: value || null,
                topic: null,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Topic</label>
          <Select
            value={filterState.topic || ""}
            onValueChange={(value) =>
              setFilterState({
                ...filterState,
                topic: value || null,
              })
            }
            disabled={!filterState.subject}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t border-border/50 my-4" />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Status</h3>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`p-2 rounded-md text-center text-xs flex flex-col items-center justify-center gap-1 transition-colors ${
              filterState.status === "correct"
                ? "bg-status-correct/20 border border-status-correct/30"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
            onClick={() =>
              setFilterState({
                ...filterState,
                status:
                  filterState.status === "correct" ? null : "correct",
              })
            }
          >
            <StatusBadge status="correct" showLabel={false} />
            <span>Correct</span>
            <span className="font-semibold">{counts.correct}</span>
          </button>
          
          <button
            className={`p-2 rounded-md text-center text-xs flex flex-col items-center justify-center gap-1 transition-colors ${
              filterState.status === "wrong"
                ? "bg-status-wrong/20 border border-status-wrong/30"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
            onClick={() =>
              setFilterState({
                ...filterState,
                status:
                  filterState.status === "wrong" ? null : "wrong",
              })
            }
          >
            <StatusBadge status="wrong" showLabel={false} />
            <span>Wrong</span>
            <span className="font-semibold">{counts.wrong}</span>
          </button>
          
          <button
            className={`p-2 rounded-md text-center text-xs flex flex-col items-center justify-center gap-1 transition-colors ${
              filterState.status === "unattempted"
                ? "bg-status-unattempted/20 border border-status-unattempted/30"
                : "bg-secondary hover:bg-secondary/80 border border-transparent"
            }`}
            onClick={() =>
              setFilterState({
                ...filterState,
                status:
                  filterState.status === "unattempted" ? null : "unattempted",
              })
            }
          >
            <StatusBadge status="unattempted" showLabel={false} />
            <span>Unattempted</span>
            <span className="font-semibold">{counts.unattempted}</span>
          </button>
        </div>
      </div>

      <div className="border-t border-border/50 my-4" />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Reset</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs"
            onClick={() => handleReset("all")}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Reset All
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs text-status-correct"
            onClick={() => handleReset("correct")}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Reset Correct
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs text-status-wrong"
            onClick={() => handleReset("wrong")}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Reset Wrong
          </Button>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-muted-foreground">
        Total Questions: {counts.total}
      </div>
    </div>
  );
};

export default Filter;
