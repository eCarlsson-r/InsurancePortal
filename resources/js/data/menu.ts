export interface MenuItem {
    title: string;
    type: 'label' | 'link';
    href?: string;
    icon?: string;
    children?: MenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        title: 'Dashboard',
        type: 'link',
        href: '/dashboard',
        icon: 'icon icon-single-04',
        children: [
            {
                title: 'Dashboard 1',
                type: 'link',
                href: '/dashboard',
            },
        ],
    }
];
