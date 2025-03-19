
import React from "react";
import { CheckCircle, XCircle, Circle, HelpCircle } from "lucide-react";
import { QuestionStatus } from "@/utils/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: QuestionStatus;
  className?: string;
  showLabel?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className,
  showLabel = true
}) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        status === "correct" && "bg-status-correct/10 text-status-correct",
        status === "wrong" && "bg-status-wrong/10 text-status-wrong",
        status === "unattempted" && "bg-status-unattempted/10 text-status-unattempted",
        className
      )}
    >
      {status === "correct" ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : status === "wrong" ? (
        <XCircle className="h-3.5 w-3.5" />
      ) : (
        <HelpCircle className="h-3.5 w-3.5" />
      )}
      {showLabel && (
        <span className="capitalize">
          {status}
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
