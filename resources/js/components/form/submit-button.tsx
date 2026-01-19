import { Button, Spinner } from 'react-bootstrap';
import { ReactNode } from 'react';

interface SubmitButtonProps {
    children: ReactNode;
    processing?: boolean;
    className?: string;
    tabIndex?: number;
    disabled?: boolean;
    onClick?: () => void;
}

export default function SubmitButton({
    children,
    processing,
    className = 'btn btn-primary btn-block',
    tabIndex,
    disabled,
    onClick
}: SubmitButtonProps) {
    return (
        <Button
            type="submit"
            className={className}
            tabIndex={tabIndex}
            disabled={processing || disabled}
            onClick={onClick}
        >
            {processing && <Spinner className="mr-2" size="sm" />}
            {children}
        </Button>
    );
}
