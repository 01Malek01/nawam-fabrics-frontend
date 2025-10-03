export interface AirtableRecord<T> {
  id: string;
  createdTime: string;
  fields: T;
}

// Raw Airtable record fields
export interface AirtableCategoryFields {
  Name: string;
  Image?: Array<{ url: string }>;
  SubCategories?: Array<{
    id: string;
    name: string;
  }>;
  Products?: string[];
}

// Processed category data for your app
export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  subCategories: Array<{
    id: string;
    name: string;
  }>;
  Products: string[];
  ParentCategory:string[]
}
  
  export interface ProductFields {
    id:string;  
    Name: string;
    PricePerMeter: number;
    Image?: Array<{ url: string }>;
    Category: string;
    CategoryName: Array<string>;
    Description?: string;
}
