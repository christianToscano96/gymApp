import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabsProps {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-2 p-1 rounded-lg bg-muted w-fit", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium border transition-colors",
            value === tab.value
              ? "bg-white text-primary  shadow-md"
              : "bg-muted text-muted-foreground border-transparent hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
