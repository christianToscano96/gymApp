import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CalendarPickerProps {
  value?: string;
  onChange?: (date: string) => void;
  disabled?: boolean;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ value, onChange, disabled }) => {
  const [open, setOpen] = React.useState(false);
  // Sincroniza el valor externo con el estado interno
  const date = value ? new Date(value) : undefined;

  const handleSelect = (selectedDate?: Date) => {
    if (selectedDate && onChange) {
      onChange(selectedDate.toISOString().slice(0, 10));
      setOpen(false); // Cierra el calendario al seleccionar
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
