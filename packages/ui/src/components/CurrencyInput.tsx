import React from 'react';
import { cn } from '../lib/utils';
import { Input } from './Input';

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  hint?: string;
  currencyCode?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, label, error, hint, currencyCode = 'ZMW', value, onChange, id, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState<string>(value?.toString() || '');

    React.useEffect(() => {
      if (value !== undefined && value !== null) {
        setInputValue(value.toString());
      } else if (value === null) {
        setInputValue('');
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Allow empty string or valid numbers (including decimals)
      if (val === '' || /^\d*\.?\d*$/.test(val)) {
        setInputValue(val);
        if (onChange) {
          onChange(val === '' ? null : parseFloat(val));
        }
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (inputValue) {
        const parsed = parseFloat(inputValue);
        if (!isNaN(parsed)) {
          setInputValue(parsed.toFixed(2));
          if (onChange) {
             onChange(parsed);
          }
        }
      }
      if (props.onBlur) props.onBlur(e);
    };

    return (
      <Input
        ref={ref}
        id={id}
        label={label}
        error={error}
        hint={hint}
        leftIcon={<span className="text-xs font-semibold">{currencyCode}</span>}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn('text-right', className)}
        {...props}
      />
    );
  }
);
CurrencyInput.displayName = 'CurrencyInput';