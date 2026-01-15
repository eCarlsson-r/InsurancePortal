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
                href: '/sales/policy'
            },
            {
                title: 'Receipts',
                type: 'link',
                href: '/sales/receipt'
            }
        ],
    },
    {
        title: 'Master',
        type: 'link',
        icon: 'fa fa-database',
        children: [
            {
                title: 'Customer',
                type: 'link',
                href: '/master/customer'
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
            {
                title: 'Product',
                type: 'link',
                href: '/master/product'
            },
            {
                title: 'Fund Types',
                type: 'link',
                href: '/master/fund'
            },
            {
                title: 'Agency',
                type: 'link',
                href: '/master/agency'
            },
            {
                title: 'Contest',
                type: 'link',
                href: '/master/contest'
            }
        ],
    },
    {
        title: 'Reports',
        type: 'link',
        icon: 'fa fa-file-text',
        children: [
            {
                title: 'Production Report',
                type: 'link',
                href: '/reports/production'
            },
            {
                title: 'Bonus Gap Report',
                type: 'link',
                href: '/reports/bonus-gap'
            },
            {
                title: 'MDRT Report',
                type: 'link',
                href: '/reports/mdrt'
            },
            {
                title: 'Empire Club Report',
                type: 'link',
                href: '/reports/empire-club'
            },
            {
                title: 'Financing Report',
                type: 'link',
                href: '/reports/financing'
            },
            {
                title: 'Due Date Report',
                type: 'link',
                href: '/reports/due-date'
            },
            {
                title: "Customer's Birthday",
                type: 'link',
                href: '/reports/birthday'
            },
            {
                title: "Customer's Religion",
                type: 'link',
                href: '/reports/religion'
            },
            {
                title: "Monthly Income List",
                type: 'link',
                href: '/reports/income-monthly'
            },
            {
                title: "Semesterly Income List",
                type:'link',
                href:'/reports/income-semesterly'
            },
            {
                title:"Yearly Income List",
                type:'link',
                href:'/reports/income-yearly'
            }
        ]
    }
];
