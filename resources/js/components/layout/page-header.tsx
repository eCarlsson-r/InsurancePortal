import { ReactNode } from 'react';

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
                <ol className="breadcrumb">
                    {breadcrumbs.map((item, index) => (
                        <li
                            key={index}
                            className={`breadcrumb-item ${item.active ? 'active' : ''}`}
                            data-i18n={item.i18n}
                        >
                            {item.href ? (
                                <a href={item.href}>{item.label}</a>
                            ) : (
                                item.label
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
