import { TextareaHTMLAttributes } from 'react';
import FormField from './form-field';

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label?: string;
    error?: string;
    row?: boolean;
}

export default function TextareaInput({
    id,
    label,
    error,
    row,
    className = '',
    ...props
}: TextareaInputProps) {
    return (
        <FormField id={id} label={label} error={error} row={row} required={props.required}>
            <textarea
                id={id}
                className={`form-control ${className}`}
                {...props}
            />
        </FormField>
    );
}
