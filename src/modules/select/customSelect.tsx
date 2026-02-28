'use client';
import './customSelect.scss';

import Select, { MultiValue, SingleValue } from 'react-select';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: string[];     
  value: string[];  
  placeholder?: string;         
  onChange: (selected: string[]) => void;
  isMulti?: boolean;          
}

export default function CustomSelect({
  options,
  value,
  placeholder,
  onChange,
  isMulti = true
}: CustomSelectProps) {
  const selectOptions: Option[] = options.map(user => ({
    value: user,
    label: user
  }));

  const selectedOptions = selectOptions.filter(opt => value.includes(opt.value));

  const handleChange = (
    newValue: MultiValue<Option> | SingleValue<Option>
  ) => {
    if (Array.isArray(newValue)) {
      const selectedValues = newValue.map(opt => opt.value);
      onChange(selectedValues);
    } else if (newValue) {
      onChange([(newValue as Option).value]);
    } else {
      onChange([]);
    }
  };

  return (
    <Select
      isMulti={isMulti}
      options={selectOptions}
      value={selectedOptions}
      onChange={handleChange}
      placeholder={placeholder}
      className="custom-select"
      classNamePrefix="custom-select"
    />
  );
}