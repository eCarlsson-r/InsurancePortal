export interface MenuItem {
    title: string;
    titleKey?: string;
    type: 'label' | 'link';
    href?: string;
    icon?: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        title: 'Penjualan',
        titleKey: 'common.sales',
        type: 'link',
        icon: 'fa fa-briefcase',
        children: [
            {
                title: 'SP / Polis',
                titleKey: 'policy.title',
                type: 'link',
                href: '/sales/policy'
            },
            {
                title: 'Kwitansi',
                titleKey: 'receipt.title',
                type: 'link',
                href: '/sales/receipt'
            },
            {
                title: 'Klaim',
                titleKey: 'claim.title',
                type: 'link',
                href: '/sales/claim'
            }
        ],
    },
    {
        title: 'Master',
        titleKey: 'common.master',
        type: 'link',
        icon: 'fa fa-database',
        children: [
            {
                title: 'Nasabah',
                titleKey: 'customer.title',
                type: 'link',
                href: '/master/customer'
            },
            {
                title: 'Agen',
                titleKey: 'agent.title',
                type: 'link',
                href: '/master/agent'
            },
            {
                title: 'Program',
                titleKey: 'program.title',
                type: 'link',
                href: '/master/program'
            },
            {
                title: 'Produk',
                titleKey: 'product.title',
                type: 'link',
                href: '/master/product'
            },
            {
                title: 'Jenis Dana',
                titleKey: 'fund.title',
                type: 'link',
                href: '/master/fund'
            },
            {
                title: 'Agency',
                titleKey: 'agency.title',
                type: 'link',
                href: '/master/agency'
            },
            {
                title: 'Kontes',
                titleKey: 'contest.title',
                type: 'link',
                href: '/master/contest'
            }
        ],
    },
    {
        title: 'Laporan',
        titleKey: 'common.reports',
        type: 'link',
        icon: 'fa fa-file-text',
        children: [
            {
                title: 'Laporan Produksi',
                titleKey: 'report.production-report',
                type: 'link',
                href: '/reports/production'
            },
            {
                title: 'Laporan Gap Bonus',
                titleKey: 'report.bonus-gap-report',
                type: 'link',
                href: '/reports/bonusgap'
            },
            {
                title: 'Laporan MDRT',
                titleKey: 'report.mdrt-report',
                type: 'link',
                href: '/reports/mdrt'
            },
            {
                title: 'Laporan Empire Club',
                titleKey: 'report.empire-club-report',
                type: 'link',
                href: '/reports/empire'
            },
            {
                title: 'Laporan Financing',
                titleKey: 'report.financing_report',
                type: 'link',
                href: '/reports/financing'
            },
            {
                title: 'Laporan Jatuh Tempo',
                titleKey: 'report.due-report',
                type: 'link',
                href: '/reports/duedate'
            },
            {
                title: 'Laporan Ulang Tahun',
                titleKey: 'report.birthday-report',
                type: 'link',
                href: '/reports/birthday'
            },
            {
                title: 'Laporan Agama',
                titleKey: 'report.religion-report',
                type: 'link',
                href: '/reports/religion'
            },
            {
                title: 'Income List Bulanan',
                titleKey: 'report.monthly_income',
                type: 'link',
                href: '/reports/monthly'
            },
            {
                title: 'Income List Semester',
                titleKey: 'report.semester_income',
                type:'link',
                href:'/reports/semester'
            },
            {
                title:'Income List Tahunan',
                titleKey:'report.annual_income',
                type:'link',
                href:'/reports/annual'
            }
        ]
    }
];
