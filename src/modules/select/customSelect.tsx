import Select from 'react-select';

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
  error?: boolean; 
}

export default function CustomSelect({
  options,
  value,
  placeholder,
  onChange,
  isMulti = true,
  error = false
}: CustomSelectProps) {

  const selectOptions: Option[] = options.map(opt => ({ value: opt, label: opt }));
  const selectedOptions = selectOptions.filter(opt => value.includes(opt.value));

  const handleChange = (newValue: any) => {
    if (Array.isArray(newValue)) {
      onChange(newValue.map((opt: Option) => opt.value));
    } else if (newValue) {
      onChange([newValue.value]);
    } else {
      onChange([]);
    }
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      border: error
        ? '2px solid #ff6b6b'
        : state.isFocused
          ? '2px solid #e8e7e7'
          : '2px solid #ccc',
      boxShadow: error
        ? '0 0 0 2px rgba(255, 107, 107, 0.3)'
        : state.isFocused
          ? '0 0 0 2px rgba(255, 200, 0, 0.2)'
          : 'none',
      backgroundColor: '#e8e7e7',
      borderRadius: 4,
      height: 50,
      cursor: 'pointer',
      transition: 'all 0.3s',
      '&:hover': {
        borderColor: '#e8e7e7',
      },
    }),

    singleValue: (provided: any) => ({
      ...provided,
      color: error ? '#ff6b6b' : '#333',
    }),

    multiValueLabel: (provided: any) => ({
      ...provided,
      color: error ? '#ff6b6b' : '#333',
    }),

    placeholder: (provided: any) => ({
      ...provided,
      color: error ? '#ff6b6b' : '#8b6649',
    }),

    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#e8e7e7' // совпадает с фоном самого селекта
        : state.isFocused
          ? '#e8e7e7' // такой же фон при hover
          : '#e8e7e7', // стандартный фон
      border: 'none',  // однотонный бордер для каждой опции
      color: state.isSelected
        ? '#ff6b6b'  // цвет текста выбранной опции
        : '#8b6649',     // обычный цвет текста
      cursor: 'pointer',
    })
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
      styles={customStyles}
    />
  );
}