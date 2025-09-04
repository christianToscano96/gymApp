import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "w-[180px]",
}) => {
  const [open, setOpen] = React.useState(false);
  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };
  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
        )}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate w-full text-left">
          {options.find((opt) => opt.value === value)?.label || placeholder}
        </span>
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <path stroke="#333" strokeWidth="1.5" d="M6 8l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
          role="listbox"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                value === opt.value ? "bg-gray-200" : ""
              }`}
              role="option"
              aria-selected={value === opt.value}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
