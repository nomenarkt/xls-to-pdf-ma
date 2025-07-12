import { useState } from "react";

export interface SeatClassInput {
  value: string;
  error: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
}

export function useSeatClassInput(
  initial: number,
  onValidChange: (value: number) => void,
): SeatClassInput {
  const [value, setValue] = useState(String(initial));
  const [error, setError] = useState(false);

  const validate = (val: string) => {
    if (val === "") return false;
    const num = parseInt(val, 10);
    return !Number.isNaN(num) && num >= 0 && num <= 99;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) {
      return; // block letters and decimals
    }
    setValue(val);
    if (validate(val)) {
      setError(false);
      onValidChange(parseInt(val, 10));
    } else {
      setError(true);
    }
  };

  const handleBlur = () => {
    setError(!validate(value));
  };

  return { value, error, handleChange, handleBlur };
}
