import type { ElementType } from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';

export interface NavItem {
    title: string;
    path: string;
    icon: ElementType;
    permission?: string;
    children?: NavItem[];
}

export const navConfig: NavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: DashboardIcon,
    },
    {
        title: 'Product Management',
        path: '/products',
        icon: LocalOfferIcon,
    },
    {
        title: 'User Management',
        path: '/users',
        icon: PeopleIcon,
    },
];

