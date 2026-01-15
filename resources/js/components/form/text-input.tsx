import { InputHTMLAttributes } from 'react';
import FormField from './form-field';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    error?: string;
    row?: boolean;
}

export default function TextInput({
    id,
    label,
    error,
    row,
    className = '',
    ...props
}: TextInputProps) {
    return (
        <FormField id={id} label={label} error={error} row={row} required={props.required}>
            <input
                id={id}
                className={`form-control ${className}`}
                {...props}
            />
        </FormField>
    );
}
