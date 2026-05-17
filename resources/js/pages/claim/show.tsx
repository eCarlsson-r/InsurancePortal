import TemplateLayout from '@/layouts/TemplateLayout';
import PageHeader from '@/components/layout/page-header';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Badge, Button, Card, Col, Modal, Row, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface ClaimShowData {
    id: string;
    claim_number: string;
    claim_type: string;
    claim_date: string;
    incident_date?: string;
    claim_amount: number;
    approved_amount?: number;
    status: 'pending' | 'approved' | 'rejected' | 'paid';
    description?: string;
    rejection_reason?: string;
    approved_at?: string;
    paid_at?: string;
    created_at: string;
    updated_at: string;
    policy: {
        id: string;
        policy_no: string;
        case_code: string;
        premium: number;
        base_insure: number;
        holder: { name: string; identity: string; mobile?: string };
        insured: { name: string; identity: string; birth_date: string };
        agent: { name: string; agent_no: string };
        product: { name: string };
        files?: Array<{ id: string; name: string; path: string }>;
    };
    user: { name: string; email: string };
}

interface ClaimShowProps {
    claim: ClaimShowData;
}

export default function ClaimShow({ claim }: ClaimShowProps) {
    const { t } = useTranslation();
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showPayModal, setShowPayModal] = useState(false);
    const [approvedAmount, setApprovedAmount] = useState(claim.claim_amount);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const canApprove = claim.status === 'pending';
    const canReject = claim.status === 'pending';
    const canMarkPaid = claim.status === 'approved';

    const handleApprove = () => {
        setProcessing(true);
        router.put(
            `/sales/claim/${claim.id}/approve`,
            {
                approved_amount: approvedAmount,
            },
            {
                onFinish: () => {
                    setProcessing(false);
                    setShowApproveModal(false);
                },
            },
        );
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        setProcessing(true);
        router.put(
            `/sales/claim/${claim.id}/reject`,
            {
                rejection_reason: rejectionReason,
            },
            {
                onFinish: () => {
                    setProcessing(false);
                    setShowRejectModal(false);
                },
            },
        );
    };

    const handleMarkPaid = () => {
        setProcessing(true);
        router.put(`/sales/claim/${claim.id}/mark-paid`, {}, {
            onFinish: () => {
                setProcessing(false);
                setShowPayModal(false);
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { bg: 'warning', icon: 'la-clock', text: 'Pending' },
            approved: { bg: 'info', icon: 'la-check-circle', text: 'Approved' },
            rejected: { bg: 'danger', icon: 'la-times-circle', text: 'Rejected' },
            paid: { bg: 'success', icon: 'la-money-bill', text: 'Paid' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

        return (
            <Badge bg={config.bg} className="d-flex align-items-center gap-1" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                <i className={`la ${config.icon}`}></i>
                {config.text}
            </Badge>
        );
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <TemplateLayout>
            <Head title={`Claim ${claim.claim_number}`} />

            <div className="container-fluid">
                <PageHeader
                    title={`Claim Details: ${claim.claim_number}`}
                    breadcrumbs={[
                        { label: t('common.sales'), i18n: 'sales' },
                        { label: t('claim.title'), href: '/sales/claim', i18n: 'claim' },
                        { label: claim.claim_number, active: true },
                    ]}
                />

                {/* Action Buttons */}
                <Row className="mb-3">
                    <Col>
                        <div className="d-flex gap-2">
                            {canApprove && (
                                <Button
                                    variant="success"
                                    onClick={() => setShowApproveModal(true)}
                                >
                                    <i className="la la-check me-2"></i>
                                    Approve Claim
                                </Button>
                            )}
                            {canReject && (
                                <Button
                                    variant="danger"
                                    onClick={() => setShowRejectModal(true)}
                                >
                                    <i className="la la-times me-2"></i>
                                    Reject Claim
                                </Button>
                            )}
                            {canMarkPaid && (
                                <Button
                                    variant="primary"
                                    onClick={() => setShowPayModal(true)}
                                >
                                    <i className="la la-money-bill me-2"></i>
                                    Mark as Paid
                                </Button>
                            )}
                            <Button
                                variant="secondary"
                                onClick={() => router.get('/sales/claim')}
                            >
                                <i className="la la-arrow-left me-2"></i>
                                Back to List
                            </Button>
                        </div>
                    </Col>
                </Row>

                <Row>
                    {/* Claim Information */}
                    <Col xl={8}>
                        <Card className="mb-4">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <h4 className="card-title mb-0">Claim Information</h4>
                                {getStatusBadge(claim.status)}
                            </Card.Header>
                            <Card.Body>
                                <Table borderless>
                                    <tbody>
                                        <tr>
                                            <td width="200"><strong>Claim Number:</strong></td>
                                            <td>{claim.claim_number}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Claim Type:</strong></td>
                                            <td className="text-capitalize">{claim.claim_type.replace(/_/g, ' ')}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Claim Date:</strong></td>
                                            <td>{formatDate(claim.claim_date)}</td>
                                        </tr>
                                        {claim.incident_date && (
                                            <tr>
                                                <td><strong>Incident Date:</strong></td>
                                                <td>{formatDate(claim.incident_date)}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td><strong>Claim Amount:</strong></td>
                                            <td><strong className="text-primary">{formatCurrency(claim.claim_amount)}</strong></td>
                                        </tr>
                                        {claim.approved_amount && (
                                            <tr>
                                                <td><strong>Approved Amount:</strong></td>
                                                <td><strong className="text-success">{formatCurrency(claim.approved_amount)}</strong></td>
                                            </tr>
                                        )}
                                        {claim.description && (
                                            <tr>
                                                <td><strong>Description:</strong></td>
                                                <td>{claim.description}</td>
                                            </tr>
                                        )}
                                        {claim.rejection_reason && (
                                            <tr>
                                                <td><strong>Rejection Reason:</strong></td>
                                                <td className="text-danger">{claim.rejection_reason}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td><strong>Processed By:</strong></td>
                                            <td>{claim.user.name} ({claim.user.email})</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        {/* Policy Information */}
                        <Card className="mb-4">
                            <Card.Header>
                                <h4 className="card-title mb-0">Policy Information</h4>
                            </Card.Header>
                            <Card.Body>
                                <Table borderless>
                                    <tbody>
                                        <tr>
                                            <td width="200"><strong>Policy Number:</strong></td>
                                            <td>{claim.policy.policy_no}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Case Code:</strong></td>
                                            <td>{claim.policy.case_code}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Product:</strong></td>
                                            <td>{claim.policy.product.name}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Policyholder:</strong></td>
                                            <td>
                                                {claim.policy.holder.name}<br />
                                                <small className="text-muted">ID: {claim.policy.holder.identity}</small>
                                                {claim.policy.holder.mobile && (
                                                    <><br /><small className="text-muted">Mobile: {claim.policy.holder.mobile}</small></>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Insured:</strong></td>
                                            <td>
                                                {claim.policy.insured.name}<br />
                                                <small className="text-muted">ID: {claim.policy.insured.identity}</small><br />
                                                <small className="text-muted">DOB: {formatDate(claim.policy.insured.birth_date)}</small>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Agent:</strong></td>
                                            <td>{claim.policy.agent.name} ({claim.policy.agent.agent_no})</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Premium:</strong></td>
                                            <td>{formatCurrency(claim.policy.premium)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Sum Insured:</strong></td>
                                            <td>{formatCurrency(claim.policy.base_insure)}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        {/* Documents */}
                        {claim.policy.files && claim.policy.files.length > 0 && (
                            <Card className="mb-4">
                                <Card.Header>
                                    <h4 className="card-title mb-0">Attached Documents</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="list-group">
                                        {claim.policy.files.map((file) => (
                                            <a
                                                key={file.id}
                                                href={`/file/${file.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="list-group-item list-group-item-action"
                                            >
                                                <i className="la la-file me-2"></i>
                                                {file.name}
                                            </a>
                                        ))}
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>

                    {/* Timeline */}
                    <Col xl={4}>
                        <Card>
                            <Card.Header>
                                <h4 className="card-title mb-0">Timeline</h4>
                            </Card.Header>
                            <Card.Body>
                                <div className="timeline">
                                    <div className="timeline-item">
                                        <div className="timeline-badge bg-primary">
                                            <i className="la la-plus"></i>
                                        </div>
                                        <div className="timeline-content">
                                            <h6>Claim Created</h6>
                                            <p className="mb-0 text-muted small">
                                                {formatDateTime(claim.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    {claim.approved_at && (
                                        <div className="timeline-item">
                                            <div className="timeline-badge bg-info">
                                                <i className="la la-check"></i>
                                            </div>
                                            <div className="timeline-content">
                                                <h6>Claim Approved</h6>
                                                <p className="mb-0 text-muted small">
                                                    {formatDateTime(claim.approved_at)}
                                                </p>
                                                {claim.approved_amount && (
                                                    <p className="mb-0 small">
                                                        Amount: {formatCurrency(claim.approved_amount)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {claim.rejection_reason && (
                                        <div className="timeline-item">
                                            <div className="timeline-badge bg-danger">
                                                <i className="la la-times"></i>
                                            </div>
                                            <div className="timeline-content">
                                                <h6>Claim Rejected</h6>
                                                <p className="mb-0 text-muted small">
                                                    {formatDateTime(claim.updated_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {claim.paid_at && (
                                        <div className="timeline-item">
                                            <div className="timeline-badge bg-success">
                                                <i className="la la-money-bill"></i>
                                            </div>
                                            <div className="timeline-content">
                                                <h6>Payment Completed</h6>
                                                <p className="mb-0 text-muted small">
                                                    {formatDateTime(claim.paid_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Approve Modal */}
            <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Approve Claim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Claim Amount</label>
                        <input
                            type="text"
                            className="form-control"
                            value={formatCurrency(claim.claim_amount)}
                            disabled
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Approved Amount *</label>
                        <input
                            type="number"
                            className="form-control"
                            value={approvedAmount}
                            onChange={(e) => setApprovedAmount(Number(e.target.value))}
                            min="0"
                            max={claim.claim_amount}
                        />
                        <small className="text-muted">
                            Maximum: {formatCurrency(claim.claim_amount)}
                        </small>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowApproveModal(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleApprove} disabled={processing}>
                        {processing ? 'Processing...' : 'Approve Claim'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Reject Modal */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Reject Claim</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Rejection Reason *</label>
                        <textarea
                            className="form-control"
                            rows={4}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a detailed reason for rejection..."
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleReject} disabled={processing}>
                        {processing ? 'Processing...' : 'Reject Claim'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Mark Paid Modal */}
            <Modal show={showPayModal} onHide={() => setShowPayModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Mark as Paid</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to mark this claim as paid?</p>
                    <div className="alert alert-info">
                        <strong>Approved Amount:</strong> {claim.approved_amount ? formatCurrency(claim.approved_amount) : 'N/A'}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPayModal(false)} disabled={processing}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleMarkPaid} disabled={processing}>
                        {processing ? 'Processing...' : 'Confirm Payment'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </TemplateLayout>
    );
}

// Made with Bob
