import { useState } from 'react';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const quickOptions = [
  { label: 'Today', getValue: () => new Date() },
  { label: 'Yesterday', getValue: () => subDays(new Date(), 1) },
  { label: '1 Week Ago', getValue: () => subWeeks(new Date(), 1) },
  { label: '1 Month Ago', getValue: () => subMonths(new Date(), 1) },
];

export const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const [open, setOpen] = useState(false);

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-left font-normal gap-2 min-w-[200px] bg-card border-border hover:bg-muted',
            !isToday && 'text-primary border-primary/50'
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          <span className="flex-1">
            {isToday ? 'Today' : format(selectedDate, 'PPP')}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover border-border" align="end">
        <div className="p-3 border-b border-border">
          <div className="text-sm font-medium text-foreground mb-2">Quick Select</div>
          <div className="grid grid-cols-2 gap-2">
            {quickOptions.map((option) => (
              <Button
                key={option.label}
                variant="ghost"
                size="sm"
                className="justify-start text-xs hover:bg-muted"
                onClick={() => {
                  onDateChange(option.getValue());
                  setOpen(false);
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              onDateChange(date);
              setOpen(false);
            }
          }}
          disabled={(date) => date > new Date()}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};
