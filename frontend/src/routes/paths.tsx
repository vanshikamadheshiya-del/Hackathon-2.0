import type { ElementType } from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export interface NavItem {
    title: string;
    path: string;
    icon: ElementType;
    permission?: string;
    children?: NavItem[];
}

export const navConfig: NavItem[] = [
    {
        title: 'Product Management',
        path: '/products',
        icon: LocalOfferIcon,
    },
];
