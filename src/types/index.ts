export * from './airtable';
// Export other types 

export interface Fabric {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    type: string;
    width: string;
    weight: string;
    careInstructions: string;
    stock: number;
    colors: string[];
    sku: string;
    tags: string[];
}