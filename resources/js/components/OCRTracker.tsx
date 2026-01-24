import { useEffect, useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

interface ProgressData {
    status: string;
    percentage: number;
    is_finished: boolean;
}

const OCRTracker = ({
    ocrId,
    onFinish,
    onError
}: {
    ocrId: string;
    onFinish: () => void;
    onError: () => void;
}) => {
    const [progress, setProgress] = useState({
        status: 'initializing...',
        percentage: 0,
    });

    useEffect(() => {
        if (!ocrId) return;

        const interval = setInterval(async () => {
            try {
                // Fetch from the combined endpoint we discussed
                const response = await fetch(`/extraction-status/${ocrId}`);
                const result: ProgressData = await response.json();

                setProgress({
                    status: result.status,
                    percentage:
                        result.percentage || (result.is_finished ? 100 : 0),
                });

                if (result.is_finished || result.status === 'completed') {
                    clearInterval(interval);
                    if (onFinish) onFinish();
                } else if (result.status.includes("Error")) {
                    if (onError) onError();
                }
            } catch (e) {
                console.error('Tracker polling failed', e);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [ocrId, onFinish]);

    return (
        <div className="p-4 border rounded shadow-sm bg-white">
            <div className="d-flex justify-content-between mb-2">
                <small className="text-primary font-weight-bold text-uppercase">
                    {progress.status}
                </small>
                <small>{progress.percentage}%</small>
            </div>
            <ProgressBar
                variant="primary"
                animated
                now={progress.percentage}
                style={{ height: '10px' }}
            />
        </div>
    );
};

export default OCRTracker;
