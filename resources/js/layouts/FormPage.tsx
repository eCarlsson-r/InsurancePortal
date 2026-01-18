import { ReactNode } from 'react';
import TemplateLayout from '@/layouts/TemplateLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/components/layout/page-header';

interface FormPageProps {
    headTitle: string;
    title: string;
    i18nTitle?: string;
    breadcrumbs: Array<{ label: string; href?: string; active?: boolean; i18n?: string }>;
    headerActions?: ReactNode;
    children: ReactNode;
}

export default function FormPage({
    headTitle,
    title,
    i18nTitle,
    breadcrumbs,
    headerActions,
    children,
}: FormPageProps) {
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

                {children}
            </div>
        </TemplateLayout>
    );
}
