import { SelectHTMLAttributes } from 'react';
import FormField from './form-field';

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label?: string;
    error?: string;
    row?: boolean;
    options?: { value: string | number; label: string; [key: string]: string | number | boolean | undefined }[];
}

export default function SelectInput({
    id,
    label,
    error,
    row,
    className = '',
    options,
    children,
    ...props
}: SelectInputProps) {
    return (
        <FormField id={id} label={label} error={error} row={row} required={props.required}>
            <select
                id={id}
                className={`form-control ${className}`}
                {...props}
            >
                {options
                    ? options.map(({ value, label, ...rest }) => (
                          <option key={value} value={value} {...rest}>
                              {label}
                          </option>
                      ))
                    : children}
            </select>
        </FormField>
    );
}
