import InputError from '@/components/input-error';
import { ReactNode } from 'react';

interface FormFieldProps {
    id: string;
    label?: string;
    error?: string;
    children: ReactNode;
    className?: string;
    labelClassName?: string;
    required?: boolean;
    row?: boolean;
}

export default function FormField({
    id,
    label,
    error,
    children,
    className = 'mb-3',
    labelClassName = 'mb-1',
    required,
    row = false,
}: FormFieldProps) {
    if (row) {
        return (
            <div className={`row form-group ${className}`}>
                {label && (
                    <label
                        htmlFor={id}
                        className="col-sm-3 col-form-label"
                    >
                        {label}
                        {required && <span className="text-danger">*</span>}
                    </label>
                )}
                <div className={label ? 'col-sm-9' : 'col-sm-12'}>
                    {children}
                    <InputError message={error} />
                </div>
            </div>
        );
    }

    return (
        <div className={`form-group ${className}`}>
            {label && (
                <label htmlFor={id} className={labelClassName}>
                    <strong>
                        {label}
                        {required && <span className="text-danger">*</span>}
                    </strong>
                </label>
            )}
            {children}
            <InputError message={error} />
        </div>
    );
}
