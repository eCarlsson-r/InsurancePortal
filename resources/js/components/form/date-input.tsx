import { InputHTMLAttributes } from 'react';
import FormField from './form-field';

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    error?: string;
    row?: boolean;
}

export default function DateInput({
    id,
    label,
    error,
    row,
    className = '',
    ...props
}: DateInputProps) {
    return (
        <FormField id={id} label={label} error={error} row={row} required={props.required}>
            <input
                id={id}
                type="date"
                className={`form-control ${className}`}
                {...props}
            />
        </FormField>
    );
}
