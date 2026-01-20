import { ReactNode } from 'react';
import { Breadcrumb } from 'react-bootstrap';

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
    i18n?: string;
}

interface PageHeaderProps {
    title: string;
    i18nTitle?: string;
    breadcrumbs: BreadcrumbItem[];
    actions?: ReactNode;
}

export default function PageHeader({ title, i18nTitle, breadcrumbs, actions }: PageHeaderProps) {
    return (
        <div className="row page-titles mx-0">
            <div className={`col-sm-6 p-md-0 ${actions ? 'd-flex align-items-center' : ''}`}>
                <h3 className="text-primary d-inline" data-i18n={i18nTitle}>
                    {title}
                </h3>
                {actions && <div className="ms-3">{actions}</div>}
            </div>
            <div className="col-sm-6 p-md-0 justify-content-sm-end mt-2 mt-sm-0 d-flex">
                <Breadcrumb>
                    {breadcrumbs.map((item, index) => (
                        <Breadcrumb.Item key={index} href={item.href}>
                            {item.label}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>
        </div>
    );
}
