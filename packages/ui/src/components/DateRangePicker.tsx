import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange, DayPicker } from 'react-day-picker';
import * as RadixPopover from '@radix-ui/react-popover';
import { cn } from '../lib/utils';

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (date?: DateRange) => void;
  label?: string;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value, onChange, label, error, hint, placeholder = 'Pick a date range', disabled, required, className
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[#2C3E50]">
          {label}{required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <RadixPopover.Root>
        <RadixPopover.Trigger asChild>
          <button
            disabled={disabled}
            className={cn(
              'flex h-9 w-full items-center justify-between rounded-md border border-[#BDC3C7] bg-white px-3 py-1 text-sm text-[#2C3E50] transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:border-transparent',
              'disabled:cursor-not-allowed disabled:bg-[#F4F6F7] disabled:opacity-60',
              !value?.from && 'text-[#BDC3C7]',
              error && 'border-red-500',
              className
            )}
          >
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, 'LLL dd, y')} - {format(value.to, 'LLL dd, y')}
                </>
              ) : (
                format(value.from, 'LLL dd, y')
              )
            ) : (
              <span>{placeholder}</span>
            )}
            <CalendarIcon className="h-4 w-4 opacity-60" />
          </button>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content className="z-50 rounded-md border border-[#BDC3C7] bg-white p-2 shadow-lg animate-in fade-in-0 zoom-in-95" align="start">
            <DayPicker
              mode="range"
              defaultMonth={value?.from}
              selected={value}
              onSelect={onChange}
              numberOfMonths={2}
              className="p-3"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-[#F4F6F7]/50 [&:has([aria-selected])]:bg-[#F4F6F7] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: cn(
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#F4F6F7] rounded-md transition-colors"
                ),
                day_range_end: "day-range-end",
                day_selected: "bg-[#E67E22] text-white hover:bg-[#D35400] hover:text-white focus:bg-[#E67E22] focus:text-white rounded-md",
                day_today: "bg-[#F4F6F7] text-[#2C3E50]",
                day_outside: "day-outside text-gray-500 opacity-50 aria-selected:bg-[#F4F6F7]/50 aria-selected:text-gray-500 aria-selected:opacity-30",
                day_disabled: "text-gray-500 opacity-50",
                day_range_middle: "aria-selected:bg-[#F4F6F7] aria-selected:text-[#2C3E50] rounded-none",
                day_hidden: "invisible",
              }}
            />
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
};