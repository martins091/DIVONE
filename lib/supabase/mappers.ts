// lib/supabase/mappers.ts

type ProductRow = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  original_price: number | string | null;
  category: string;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  stock: number;
  rating: number | string;
  reviews: unknown;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // NEW FIELDS - Add these to the type
  is_sold?: boolean;
  status?: string;
  sold_date?: string | null;
};

export function mapProduct(row: ProductRow) {
  const reviews = Array.isArray(row.reviews) ? row.reviews : [];
  const images = row.images || [];

  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    originalPrice: row.original_price == null ? null : Number(row.original_price),
    category: row.category,
    images,
    image: images[0] || 'linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)',
    sizes: row.sizes || [],
    colors: row.colors || [],
    stock: row.stock,
    rating: Number(row.rating),
    reviews,
    reviewCount: reviews.length,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    // NEW FIELDS - Add these to the returned object
    isSold: row.is_sold || false,
    status: row.status || 'available',
    soldDate: row.sold_date || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toProductInsert(body: any) {
  const insertData: any = {
    name: body.name,
    description: body.description,
    price: Number(body.price),
    original_price: body.originalPrice ? Number(body.originalPrice) : null,
    category: body.category,
    images: body.images || (body.image ? [body.image] : []),
    sizes: body.sizes || [],
    colors: body.colors || [],
    stock: Number(body.stock || 0),
    rating: Number(body.rating || 0),
    is_new: body.isNew ?? true,
    is_featured: body.isFeatured ?? false,
    is_active: body.isActive ?? true,
  };
  
  // NEW FIELDS - Add these to the insert data if they exist
  if (body.isSold !== undefined) {
    insertData.is_sold = body.isSold;
  }
  
  if (body.status !== undefined) {
    insertData.status = body.status;
  }
  
  if (body.soldDate !== undefined) {
    insertData.sold_date = body.soldDate;
  }
  
  return insertData;
}

export function mapCartItem(row: any) {
  return {
    id: row.id,
    _id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    name: row.product_name,
    price: Number(row.price),
    quantity: row.quantity,
    size: row.size,
    color: row.color,
    image: row.image,
  };
}

export function mapOrder(row: any) {
  const items = (row.order_items || []).map((item: any) => ({
    id: item.id,
    productId: item.product_id,
    productName: item.product_name,
    name: item.product_name,
    price: Number(item.price),
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    image: item.image,
  }));

  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    guestAccessToken: row.guest_access_token,
    items,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    shipping: Number(row.shipping),
    total: Number(row.total),
    status: row.status,
    shippingAddress: row.shipping_address,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    trackingNumber: row.tracking_number,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

// Optional: Helper function to check if a product is sold
export function isProductSold(product: any) {
  return product.isSold || product.status === 'sold' || product.stock === 0;
}