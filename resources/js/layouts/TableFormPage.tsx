import { ReactNode } from 'react';
import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/components/layout/page-header';

interface TableFormPageProps {
    headTitle: string;
    title: string;
    i18nTitle?: string;
    breadcrumbs: Array<{ label: string; href?: string; active?: boolean; i18n?: string }>;
    tableTitle: string;
    tableI18nTitle?: string;
    tableToolbar?: ReactNode;
    tableContent: ReactNode;
    formTitle: string;
    formI18nTitle?: string;
    formSubtitle?: string;
    formI18nSubtitle?: string;
    formContent: ReactNode;
    formOnSubmit?: (e: React.FormEvent) => void;
    leftColWidth?: number;
    rightColWidth?: number;
    headerActions?: ReactNode;
    pagination?: ReactNode;
}

export default function TableFormPage({
    headTitle,
    title,
    i18nTitle,
    breadcrumbs,
    tableTitle,
    tableI18nTitle,
    tableToolbar,
    tableContent,
    formTitle,
    formI18nTitle,
    formSubtitle,
    formI18nSubtitle,
    formContent,
    formOnSubmit,
    leftColWidth = 6,
    rightColWidth = 6,
    headerActions,
    pagination,
}: TableFormPageProps) {
    return (
        <TemplateLayout>
            <Head title={headTitle} />

            <div className="container-fluid">
                <PageHeader
                    title={title}
                    i18nTitle={i18nTitle}
                    breadcrumbs={breadcrumbs}
                    actions={headerActions}
                />

                <div className="row">
                    <div className={`col-md-${leftColWidth}`}>
                        <div className="card">
                            <div className="card-body">
                                <div className="toolbar card-title mb-4">
                                    <h4 className="d-inline" data-i18n={tableI18nTitle}>{tableTitle}</h4>
                                    {tableToolbar}
                                </div>
                                <div className="table-responsive">
                                    {tableContent}
                                </div>
                                {pagination}
                            </div>
                        </div>
                    </div>

                    <div className={`col-md-${rightColWidth}`}>
                        <div className="card">
                            <div className="card-body">
                                <form
                                    onSubmit={(e) => {
                                        if (formOnSubmit) {
                                            e.preventDefault();
                                            formOnSubmit(e);
                                        }
                                    }}
                                >
                                    <div className="row card-title mb-4">
                                        <div className="col-12">
                                            <h4 data-i18n={formI18nTitle}>{formTitle}</h4>
                                            {formSubtitle && (
                                                <h6 data-i18n={formI18nSubtitle}>{formSubtitle}</h6>
                                            )}
                                        </div>
                                    </div>
                                    <div className="basic-form">
                                        {formContent}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
