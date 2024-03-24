export interface Category {
  categoryID: number;
  categoryName: string;
  categoryDescription: string;
}

export interface Variant {
  variantID: number;
  variantName: string;
  variantDescription: string;
}

export interface Product {
  productID: number;
  barcode: string;
  productName: string;
  productDescription: string;
  productCategory: number;
  variantID: number;
}
