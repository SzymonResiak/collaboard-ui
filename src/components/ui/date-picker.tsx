'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  label?: string;
}

export function DatePicker({ value, onChange, label }: DatePickerProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-between text-left font-normal rounded-md bg-white',
              !value && 'text-muted-foreground'
            )}
          >
            <span>{value ? format(value, 'dd/MM/yyyy') : 'Pick a date'}</span>
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="end">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className="bg-white rounded-md border"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
