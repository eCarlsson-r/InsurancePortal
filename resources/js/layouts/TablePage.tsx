import { ReactNode } from 'react';
import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/components/layout/page-header';

interface TablePageProps {
    headTitle: string;
    title: string;
    i18nTitle?: string;
    breadcrumbs: Array<{ label: string; href?: string; active?: boolean; i18n?: string }>;
    toolbar?: ReactNode;
    children: ReactNode;
}

export default function TablePage({
    headTitle,
    title,
    i18nTitle,
    breadcrumbs,
    toolbar,
    children,
}: TablePageProps) {
    return (
        <TemplateLayout>
            <Head title={headTitle} />

            <div className="container-fluid">
                <PageHeader
                    title={title}
                    i18nTitle={i18nTitle}
                    breadcrumbs={breadcrumbs}
                />

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                {toolbar && (
                                    <div className="toolbar card-title mb-4">
                                        {toolbar}
                                    </div>
                                )}
                                <div className="table-responsive">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TemplateLayout>
    );
}
