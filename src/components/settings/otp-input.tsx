
import React from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, value, onChange, disabled }: OtpInputProps) {
  const inputs = Array.from({ length });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    let newValue = value.split("");
    const c = e.target.value.replace(/\D/, '').slice(0,1); // single digit
    newValue[idx] = c;
    const str = newValue.join("").slice(0, length);
    onChange(str);

    // Move to next input if filled
    if (c && idx < length - 1) {
      const next = document.getElementById(`otp-${idx+1}`);
      if (next) (next as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      const prev = document.getElementById(`otp-${idx-1}`);
      if (prev) (prev as HTMLInputElement).focus();
    }
  };

  return (
    <div className="flex gap-2">
      {inputs.map((_, idx) => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[idx] || ""}
          onChange={(e) => handleInput(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          disabled={disabled}
          className="w-10 h-12 text-xl text-center border-b-2 border-gray-300 focus:border-charity-primary bg-transparent outline-none"
        />
      ))}
    </div>
  );
}
