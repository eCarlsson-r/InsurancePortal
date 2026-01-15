import { InputHTMLAttributes } from 'react';
import InputError from '@/components/input-error';

interface CheckboxInputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    error?: string;
}

export default function CheckboxInput({
    id,
    label,
    error,
    className = '',
    ...props
}: CheckboxInputProps) {
    return (
        <div className="form-group">
            <div className="custom-control custom-checkbox ml-1">
                <input
                    type="checkbox"
                    id={id}
                    className={`custom-control-input ${className}`}
                    {...props}
                />
                <label className="custom-control-label" htmlFor={id}>
                    {label}
                </label>
            </div>
            <InputError message={error} />
        </div>
    );
}
