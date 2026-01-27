import { router } from '@inertiajs/react';
import { ChangeEvent, useRef, useState } from 'react';

interface UploadModalProps {
    show: boolean;
    onHide: () => void;
    documentId: string;
    documentPurpose: string;
}

export default function UploadModal({
    show,
    onHide,
    documentId,
    documentPurpose,
}: UploadModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('document', selectedFile);
        formData.append('document_id', documentId);
        formData.append('purpose', documentPurpose);

        router.post('/upload', formData, {
            onSuccess: () => {
                setIsProcessing(false);
                onHide();
            },
            onError: () => setIsProcessing(false),
        });
    };

    const handleClose = () => {
        if (!isProcessing) {
            setSelectedFile(null);
            setError(null);
            onHide();
        }
    };

    return (
        <>
            {show && (
                <div
                    className="modal-backdrop fade show"
                    onClick={handleClose}
                    style={{ zIndex: 1040 }}
                ></div>
            )}
            <div
                className={`modal fade ${show ? 'show' : ''}`}
                id="uploadModal"
                tabIndex={-1}
                role="dialog"
                aria-hidden={!show}
                style={{ display: show ? 'block' : 'none', zIndex: 1050 }}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title font-weight-bold text-uppercase">
                                Unggah Berkas
                            </h5>
                            <button
                                type="button"
                                className="close"
                                onClick={handleClose}
                            >
                                <span>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div
                                className="text-center p-5 border-2 rounded-lg bg-light"
                                onClick={handleBrowseClick}
                                style={{
                                    cursor: 'pointer',
                                    borderStyle: 'dashed',
                                }}
                            >
                                <i
                                    className="la la-cloud-upload text-primary"
                                    style={{ fontSize: '50px' }}
                                ></i>
                                <p className="mt-3">
                                    {selectedFile
                                        ? selectedFile.name
                                        : 'Klik atau seret file PDF/Gambar ke sini'}
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="d-none"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBrowseClick();
                                    }}
                                >
                                    Pilih Berkas
                                </button>
                            </div>

                            {error && (
                                <div
                                    className="alert alert-danger mt-3"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={handleClose}
                                disabled={isProcessing}
                            >
                                Batal
                            </button>
                            {selectedFile && !isProcessing && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpload}
                                >
                                    Mulai Ekstraksi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
