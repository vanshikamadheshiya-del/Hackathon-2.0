export interface Product {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    image?: string;
    isPublished?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
