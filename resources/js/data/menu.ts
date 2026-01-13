export interface MenuItem {
    title: string;
    type: 'label' | 'link';
    href?: string;
    icon?: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        title: 'Sales',
        type: 'link',
        icon: 'fa fa-briefcase',
        children: [
            {
                title: 'Cases / Policies',
                type: 'link',
                href: '/sales/policy',
            }
        ]
    },
    {
        title: 'Master',
        type: 'link',
        icon: 'fa fa-database',
        children: [
            {
                title: 'Agency',
                type: 'link',
                href: '/master/agency'
            },
            {
                title: 'Agent',
                type: 'link',
                href: '/master/agent'
            },
            {
                title: 'Program',
                type: 'link',
                href: '/master/program'
            },
            ,
            {
                title: 'Product',
                type: 'link',
                href: '/master/product'
            }
        ]
    }
];
