insert into public.products (
  name,
  description,
  price,
  original_price,
  category,
  images,
  sizes,
  colors,
  stock,
  rating,
  is_new,
  is_featured
)
values
  (
    'Silk Evening Gown',
    'Elegant silk gown perfect for special occasions.',
    450000,
    550000,
    'Evening Wear',
    array['linear-gradient(135deg, #D4AF37 0%, #E8C4C4 100%)'],
    array['XS', 'S', 'M', 'L', 'XL'],
    array['Black', 'Ivory', 'Navy', 'Blush'],
    15,
    5,
    true,
    true
  ),
  (
    'Classic Wool Blazer',
    'A tailored blazer with clean structure and a polished finish.',
    320000,
    400000,
    'Casual Chic',
    array['linear-gradient(135deg, #E8C4C4 0%, #F8F5F0 100%)'],
    array['S', 'M', 'L', 'XL'],
    array['Black', 'Camel', 'Cream'],
    8,
    5,
    true,
    true
  ),
  (
    'Leather Structured Bag',
    'Handcrafted structured bag designed for everyday luxury.',
    380000,
    null,
    'Accessories',
    array['linear-gradient(135deg, #1A1A1A 0%, #D4AF37 100%)'],
    array['One Size'],
    array['Black', 'Brown'],
    5,
    5,
    false,
    true
  )
on conflict do nothing;
