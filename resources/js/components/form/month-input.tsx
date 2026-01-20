import { InputHTMLAttributes } from 'react';
import FormField from './form-field';

interface MonthInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    error?: string;
    row?: boolean;
}

export default function MonthInput({
    id,
    label,
    error,
    row,
    className = '',
    ...props
}: MonthInputProps) {
    return (
        <FormField id={id} label={label} error={error} row={row} required={props.required}>
            <input
                id={id}
                type="month"
                className={`form-control ${className}`}
                {...props}
            />
        </FormField>
    );
}
