import { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';

const OCRTracker = ({ ocrId, onFinish }: { ocrId: string, onFinish: () => void }) => {
    const [progress, setProgress] = useState({ status: 'initializing...', percentage: 0 });

    useEffect(() => {
        if (!ocrId) return;

        const interval = setInterval(async () => {
            const response = await fetch(`/extraction-status/${ocrId}`);
            const data = await response.json();

            if (data.status.toLowerCase().includes('error') || data.status === 'failed') {
                setProgress({
                    status: data.status,
                    percentage: data.percentage
                });
                if (onFinish) onFinish();
                clearInterval(interval);
                return;
            }

            setProgress({
                status: data.status,
                percentage: data.percentage
            });

            if (data.is_finished) {
                clearInterval(interval);
                if (onFinish) onFinish();
            }
        }, 3000); // Poll every 3 seconds to save CPU

        return () => clearInterval(interval);
    }, [ocrId]);

    return (
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
            <div className="text-xl font-medium text-black">Processing Policy</div>
            <p className="text-slate-500">{progress.status}</p>
            <ProgressBar className="mb-3" variant="success" now={progress.percentage} />
        </div>
    );
};

export default OCRTracker;