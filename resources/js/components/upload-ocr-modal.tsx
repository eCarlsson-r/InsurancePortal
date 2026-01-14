import { router } from '@inertiajs/react';
import { ChangeEvent, useRef, useState } from 'react';
import OCRTracker from './OCRTracker'; // The component we built earlier

interface UploadOcrModalProps {
    show: boolean;
    onHide: () => void;
}

export default function UploadOcrModal({ show, onHide }: UploadOcrModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [showPasswordField, setShowPasswordField] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeOcrId, setActiveOcrId] = useState(null);

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

    const handleStartOcr = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('document', selectedFile);
        if (password) formData.append('password', password);

        router.post('/sales/policy/process-ocr', formData, {
            onSuccess: (page) => {
                // Access flashed data from Inertia props
                const ocrId = page.props.flash?.ocr_id;
                setActiveOcrId(ocrId);
            },
            onError: () => setIsProcessing(false),
        });
    };

    const handleClose = () => {
        if (!isProcessing) {
            setSelectedFile(null);
            setPassword('');
            setShowPasswordField(false);
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
                id="uploadOcrModal"
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
                                Otomatisasi Data SP / Polis
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
                            {!isProcessing ? (
                                <>
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

                                    {showPasswordField && (
                                        <div className="mt-3">
                                            <label className="text-danger font-weight-bold">
                                                Password PDF Diperlukan:
                                            </label>
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                className="form-control"
                                                placeholder="Masukkan password PDF..."
                                            />
                                        </div>
                                    )}

                                    {error && (
                                        <div
                                            className="alert alert-danger mt-3"
                                            role="alert"
                                        >
                                            {error}
                                        </div>
                                    )}
                                </>
                            ) : (
                                activeOcrId && (
                                    <OCRTracker
                                        ocrId={activeOcrId}
                                        onFinish={() => {
                                            setActiveOcrId(null);
                                            setIsProcessing(false);
                                            setError(null);
                                            // Redirect to the final form
                                            router.get(
                                                `/sales/policy/create?ocr_id=${activeOcrId}`,
                                            );
                                        }}
                                    />
                                )
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
                                    onClick={handleStartOcr}
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
