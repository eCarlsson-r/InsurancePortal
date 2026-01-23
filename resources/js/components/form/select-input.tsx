import { SelectHTMLAttributes } from 'react';
import ReactSelect, { StylesConfig, CSSObjectWithLabel, SingleValue } from 'react-select';
import FormField from './form-field';

interface SelectOption {
    value: string | number;
    label: string;
    [key: string]: string | number | boolean | undefined;
}

interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
    id: string;
    label?: string;
    error?: string;
    row?: boolean;
    options?: SelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
}

interface ControlState {
    isFocused: boolean;
}

interface OptionState {
    isSelected: boolean;
    isFocused: boolean;
}

const customStyles: StylesConfig<SelectOption, false> = {
    control: (base: CSSObjectWithLabel, state: ControlState) => ({
        ...base,
        minHeight: 'calc(1.5em + 0.75rem + 2px)',
        fontSize: '0.937rem',
        fontWeight: 400,
        lineHeight: 1.5,
        color: '#495057',
        backgroundColor: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '0.25rem',
        borderColor: state.isFocused ? '#d5ccfb' : '#eaeaea',
        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(115, 86, 241, 0.25)' : 'none',
        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        '&:hover': {
            borderColor: state.isFocused ? '#d5ccfb' : '#eaeaea',
        },
    }),
    option: (base: CSSObjectWithLabel, state: OptionState) => ({
        ...base,
        backgroundColor: state.isSelected ? '#e8e0ff' : state.isFocused ? '#f0ecff' : '#fff',
        color: state.isSelected || state.isFocused ? '#7356f1' : '#495057',
        cursor: 'pointer',
        fontSize: '0.937rem',
        padding: '0.375rem 0.75rem',
        fontWeight: state.isSelected ? 500 : 400,
    }),
    menu: (base: CSSObjectWithLabel) => ({
        ...base,
        backgroundColor: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: '0.25rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 50,
    }),
    menuList: (base: CSSObjectWithLabel) => ({
        ...base,
        maxHeight: '300px',
    }),
    input: (base: CSSObjectWithLabel) => ({
        ...base,
        fontSize: '0.937rem',
        color: '#495057',
    }),
    placeholder: (base: CSSObjectWithLabel) => ({
        ...base,
        color: '#6c757d',
    }),
    singleValue: (base: CSSObjectWithLabel) => ({
        ...base,
        color: '#495057',
    }),
};

export default function SelectInput({
    id,
    label,
    error,
    row,
    className = '',
    options,
    value,
    placeholder,
    onChange,
    style,
    ...props
}: SelectInputProps) {
    const selectedOption = options?.find(
        (opt) => String(opt.value) === String(value)
    ) || null;

    return (
        <FormField id={id} label={label} error={error} row={row} required={props.required}>
            <div style={style}>
                <ReactSelect<SelectOption>
                    inputId={id}
                    options={options}
                    value={selectedOption}
                    onChange={(option: SingleValue<SelectOption>) => {
                        if (option && onChange) {
                            onChange(option.value);
                        }
                    }}
                    isClearable={false}
                    isSearchable={true}
                    styles={customStyles}
                    className={`react-select-container ${className}`}
                    classNamePrefix="react-select"
                    placeholder={placeholder || "Select an option"}
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    menuPosition="fixed"
                />
            </div>
        </FormField>
    );
}
