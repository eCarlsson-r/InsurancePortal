import { Button, Spinner } from 'react-bootstrap';
import { ReactNode } from 'react';

interface SubmitButtonProps {
    children: ReactNode;
    processing?: boolean;
    className?: string;
    tabIndex?: number;
    disabled?: boolean;
}

export default function SubmitButton({
    children,
    processing,
    className = 'btn btn-primary btn-block',
    tabIndex,
    disabled,
}: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            className={className}
            tabIndex={tabIndex}
            disabled={processing || disabled}
        >
            {processing && <Spinner className="mr-2" size="sm" />}
            {children}
        </Button>
    );
}
