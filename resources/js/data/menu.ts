export interface MenuItem {
    title: string;
    type: 'label' | 'link';
    href?: string;
    icon?: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        title: 'Penjualan',
        type: 'link',
        icon: 'fa fa-briefcase',
        children: [
            {
                title: 'SP / Polis',
                type: 'link',
                href: '/sales/policy'
            },
            {
                title: 'Kwitansi',
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
                title: 'Nasabah',
                type: 'link',
                href: '/master/customer'
            },
            {
                title: 'Agen',
                type: 'link',
                href: '/master/agent'
            },
            {
                title: 'Program',
                type: 'link',
                href: '/master/program'
            },
            {
                title: 'Produk',
                type: 'link',
                href: '/master/product'
            },
            {
                title: 'Jenis Dana',
                type: 'link',
                href: '/master/fund'
            },
            {
                title: 'Agency',
                type: 'link',
                href: '/master/agency'
            },
            {
                title: 'Kontes',
                type: 'link',
                href: '/master/contest'
            }
        ],
    },
    {
        title: 'Laporan',
        type: 'link',
        icon: 'fa fa-file-text',
        children: [
            {
                title: 'Laporan Produksi',
                type: 'link',
                href: '/reports/production'
            },
            {
                title: 'Laporan Gap Bonus',
                type: 'link',
                href: '/reports/bonusgap'
            },
            {
                title: 'Laporan MDRT',
                type: 'link',
                href: '/reports/mdrt'
            },
            {
                title: 'Laporan Empire Club',
                type: 'link',
                href: '/reports/empire'
            },
            {
                title: 'Laporan Financing',
                type: 'link',
                href: '/reports/financing'
            },
            {
                title: 'Laporan Jatuh Tempo',
                type: 'link',
                href: '/reports/duedate'
            },
            {
                title: 'Laporan Ulang Tahun',
                type: 'link',
                href: '/reports/birthday'
            },
            {
                title: 'Laporan Agama',
                type: 'link',
                href: '/reports/religion'
            },
            {
                title: 'Income List Bulanan',
                type: 'link',
                href: '/reports/monthly'
            },
            {
                title: 'Income List Semester',
                type:'link',
                href:'/reports/semester'
            },
            {
                title:'Income List Tahunan',
                type:'link',
                href:'/reports/annual'
            }
        ]
    }
];
