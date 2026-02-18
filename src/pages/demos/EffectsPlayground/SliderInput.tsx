import { useState } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

function SliderInput({ label, value, onChange, min, max, step }: SliderInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let num = parseFloat(inputValue);
    if (isNaN(num)) {
      num = value;
    }
    onChange(num);
    setInputValue(num.toString());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div>
      <span className="block text-sm mb-1">{label}: {value}</span>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="w-24"
        />
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="w-24 px-2 py-1 text-sm bg-bg dark:bg-bg-dark border border-borderMuted dark:border-borderMuted"
        />
      </div>
    </div>
  );
}

export default SliderInput;
