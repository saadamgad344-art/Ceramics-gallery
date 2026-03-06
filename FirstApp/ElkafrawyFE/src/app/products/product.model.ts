export interface ProductImage {
  id: number;
  imageUrl?: string | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  pricePerMeter: number;
  size: string;
  color: string;
  texture: string;
  stockQuantity: number;
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  productImages?: ProductImage[];
}
