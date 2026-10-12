import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MainCategory from './models/mainCategory.js';
import SubCategory from './models/subCategory.js';
import Product from './models/product.js';

dotenv.config();

const sampleProducts = [
  // ── LADIES WEAR ──
  {
    name: 'Graceful Structure WW Dress',
    sku: 'LW-SKU-001',
    price: 8790,
    currency: 'Rs ',
    colorLabel: 'Ivory',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['XS', 'S', 'M', 'L'],
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Riviera Pinstripe WW Dress',
    sku: 'LW-SKU-002',
    price: 8990,
    currency: 'Rs ',
    colorLabel: 'Navy Stripe',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Nova Bubble Mini',
    sku: 'LW-SKU-003',
    price: 7150,
    currency: 'Rs ',
    colorLabel: 'Blush Pink',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Clara Check Midi',
    sku: 'LW-SKU-004',
    price: 8190,
    currency: 'Rs ',
    colorLabel: 'Checkered',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['XS', 'S', 'M', 'L'],
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Isla Tiered Midi',
    sku: 'LW-SKU-005',
    price: 9490,
    currency: 'Rs ',
    colorLabel: 'Emerald',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L', 'XL'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Luna Lace Midi Dress',
    sku: 'LW-SKU-006',
    price: 9990,
    currency: 'Rs ',
    colorLabel: 'Noir Black',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Seraph Draped Gown',
    sku: 'LW-SKU-007',
    price: 12490,
    currency: 'Rs ',
    colorLabel: 'Midnight Blue',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Celeste Wrap Dress',
    sku: 'LW-SKU-008',
    price: 7890,
    currency: 'Rs ',
    sale: true,
    originalPrice: 9890,
    colorLabel: 'Rose',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['XS', 'S', 'M'],
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Amber Floral Midi',
    sku: 'LW-SKU-009',
    price: 8490,
    currency: 'Rs ',
    colorLabel: 'Floral Gold',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1497339100541-5b1b8b7a6f4b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Stella Ruffle Mini',
    sku: 'LW-SKU-010',
    price: 6990,
    currency: 'Rs ',
    colorLabel: 'Ruby Red',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['XS', 'S', 'M'],
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Ophelia Satin Slip Dress',
    sku: 'LW-SKU-011',
    price: 10490,
    currency: 'Rs ',
    colorLabel: 'Champagne',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Aurora Belted Midi',
    sku: 'LW-SKU-012',
    price: 9190,
    currency: 'Rs ',
    sale: true,
    originalPrice: 11490,
    colorLabel: 'Teal Blue',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L', 'XL'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Violet Peplum Dress',
    sku: 'LW-SKU-013',
    price: 7490,
    currency: 'Rs ',
    colorLabel: 'Violet',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1551163943-3f7253a97938?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Bianca Linen Shirt Dress',
    sku: 'LW-SKU-014',
    price: 8290,
    currency: 'Rs ',
    colorLabel: 'Pure White',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Rosette Bodycon Midi',
    sku: 'LW-SKU-015',
    price: 9890,
    currency: 'Rs ',
    colorLabel: 'Wine Red',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['XS', 'S', 'M'],
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Cleo Wrap Maxi',
    sku: 'LW-SKU-016',
    price: 11990,
    currency: 'Rs ',
    colorLabel: 'Cobalt Blue',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L', 'XL'],
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Delphi Pleated Midi',
    sku: 'LW-SKU-017',
    price: 8690,
    currency: 'Rs ',
    colorLabel: 'Charcoal Grey',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Elara Floral Maxi',
    sku: 'LW-SKU-018',
    price: 12990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 14990,
    colorLabel: 'Meadow Floral',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Freya Corset Dress',
    sku: 'LW-SKU-019',
    price: 10990,
    currency: 'Rs ',
    colorLabel: 'Scarlet',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['XS', 'S', 'M', 'L'],
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Gemma A-Line Dress',
    sku: 'LW-SKU-020',
    price: 7990,
    currency: 'Rs ',
    colorLabel: 'Sunflower Yellow',
    categorySlug: 'women',
    subCategorySlug: 'dresses',
    size: ['S', 'M', 'L'],
    stock: 17,
    images: [
      'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1497339100541-5b1b8b7a6f4b?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Contour Seam Denim Corset Top',
    sku: 'LW-SKU-021',
    price: 4990,
    currency: 'Rs ',
    colorLabel: 'Washed Denim',
    categorySlug: 'women',
    subCategorySlug: 'tops-blouses',
    size: ['XS', 'S', 'M', 'L'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600'
    ],
  },

  // ── GENTS WEAR ──
  {
    name: 'Oxford Classic Slim Shirt',
    sku: 'GW-SKU-001',
    price: 4990,
    currency: 'Rs ',
    colorLabel: 'Sky Blue',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L', 'XL'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Tailored Charcoal Blazer',
    sku: 'GW-SKU-002',
    price: 12990,
    currency: 'Rs ',
    colorLabel: 'Charcoal Grey',
    categorySlug: 'mens',
    subCategorySlug: 'suits-blazers',
    size: ['38R', '40R', '42R', '44R'],
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Linen Relaxed Trousers',
    sku: 'GW-SKU-003',
    price: 6490,
    currency: 'Rs ',
    colorLabel: 'Natural Beige',
    categorySlug: 'mens',
    subCategorySlug: 'mens-trousers',
    size: ['30', '32', '34', '36'],
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Navy Double-Breasted Suit',
    sku: 'GW-SKU-004',
    price: 24990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 29990,
    colorLabel: 'Navy Blue',
    categorySlug: 'mens',
    subCategorySlug: 'suits-blazers',
    size: ['38R', '40R', '42R'],
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Classic White Dress Shirt',
    sku: 'GW-SKU-005',
    price: 3990,
    currency: 'Rs ',
    colorLabel: 'Crisp White',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L', 'XL'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Merino Crew Neck Sweater',
    sku: 'GW-SKU-006',
    price: 7990,
    currency: 'Rs ',
    colorLabel: 'Burgundy',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Slim Fit Chino Trousers',
    sku: 'GW-SKU-007',
    price: 5490,
    currency: 'Rs ',
    colorLabel: 'Khaki',
    categorySlug: 'mens',
    subCategorySlug: 'mens-trousers',
    size: ['30', '32', '34'],
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Leather Biker Jacket',
    sku: 'GW-SKU-008',
    price: 18990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 22990,
    colorLabel: 'Onyx Black',
    categorySlug: 'mens',
    subCategorySlug: 'suits-blazers',
    size: ['M', 'L', 'XL'],
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Flannel Check Overshirt',
    sku: 'GW-SKU-009',
    price: 5990,
    currency: 'Rs ',
    colorLabel: 'Buffalo Red & Black',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L', 'XL'],
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4547?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Essential Polo Shirt',
    sku: 'GW-SKU-010',
    price: 3490,
    currency: 'Rs ',
    colorLabel: 'Forest Green',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L', 'XL'],
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Formal Pinstripe Trousers',
    sku: 'GW-SKU-011',
    price: 7490,
    currency: 'Rs ',
    colorLabel: 'Dark Grey Stripe',
    categorySlug: 'mens',
    subCategorySlug: 'mens-trousers',
    size: ['30', '32', '34', '36'],
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Quilted Puffer Jacket',
    sku: 'GW-SKU-012',
    price: 9990,
    currency: 'Rs ',
    colorLabel: 'Matte Olive',
    categorySlug: 'mens',
    subCategorySlug: 'suits-blazers',
    size: ['M', 'L', 'XL'],
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Stretch Denim Jeans',
    sku: 'GW-SKU-013',
    price: 6990,
    currency: 'Rs ',
    colorLabel: 'Dark Indigo',
    categorySlug: 'mens',
    subCategorySlug: 'mens-jeans',
    size: ['30', '32', '34', '36'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Herringbone Tweed Blazer',
    sku: 'GW-SKU-014',
    price: 15490,
    currency: 'Rs ',
    colorLabel: 'Earthy Brown',
    categorySlug: 'mens',
    subCategorySlug: 'suits-blazers',
    size: ['40R', '42R', '44R'],
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Cotton Turtleneck',
    sku: 'GW-SKU-015',
    price: 4490,
    currency: 'Rs ',
    colorLabel: 'Camel',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L'],
    stock: 0,
    images: [
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Tech Bomber Jacket',
    sku: 'GW-SKU-016',
    price: 11990,
    currency: 'Rs ',
    sale: true,
    originalPrice: 14490,
    colorLabel: 'Gunmetal',
    categorySlug: 'mens',
    subCategorySlug: 'suits-blazers',
    size: ['S', 'M', 'L', 'XL'],
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Linen Resort Shirt',
    sku: 'GW-SKU-017',
    price: 4290,
    currency: 'Rs ',
    colorLabel: 'Sea Salt White',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L', 'XL'],
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Structured Overcoat',
    sku: 'GW-SKU-018',
    price: 19990,
    currency: 'Rs ',
    colorLabel: 'Camel Brown',
    categorySlug: 'mens',
    subCategorySlug: 'suits-blazers',
    size: ['38R', '40R', '42R'],
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Slim Fit Cargo Trousers',
    sku: 'GW-SKU-019',
    price: 5990,
    currency: 'Rs ',
    colorLabel: 'Dark Slate',
    categorySlug: 'mens',
    subCategorySlug: 'mens-trousers',
    size: ['30', '32', '34', '36'],
    stock: 21,
    images: [
      'https://images.unsplash.com/photo-1584865288642-42078afe6942?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Premium Knit Cardigan',
    sku: 'GW-SKU-020',
    price: 8490,
    currency: 'Rs ',
    colorLabel: 'Oatmeal',
    categorySlug: 'mens',
    subCategorySlug: 'mens-shirts',
    size: ['S', 'M', 'L'],
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1548126032-079a0fb0099d?auto=format&fit=crop&q=80&w=600',
    ],
  },

  // ── ACCESSORIES ──
  {
    name: 'Siena Drape Earrings',
    sku: 'ACC-SKU-001',
    price: 1750,
    currency: 'Rs ',
    colorLabel: 'Gold',
    categorySlug: 'accessories',
    subCategorySlug: 'jewellery',
    size: ['One Size'],
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1582213797685-69bc3df874bb?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Nova Gleam Earrings',
    sku: 'ACC-SKU-002',
    price: 1900,
    currency: 'Rs ',
    colorLabel: 'Silver',
    categorySlug: 'accessories',
    subCategorySlug: 'jewellery',
    size: ['One Size'],
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Vlona Necklace',
    sku: 'ACC-SKU-003',
    price: 3500,
    currency: 'Rs ',
    colorLabel: 'Gold Plated',
    categorySlug: 'accessories',
    subCategorySlug: 'jewellery',
    size: ['One Size'],
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
    ],
  },
  {
    name: 'Celeste Necklace',
    sku: 'ACC-SKU-004',
    price: 3500,
    currency: 'Rs ',
    colorLabel: 'Rose Gold',
    categorySlug: 'accessories',
    subCategorySlug: 'jewellery',
    size: ['One Size'],
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?auto=format&fit=crop&q=80&w=600',
    ],
  },
];

async function run() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Ensure Main Categories exist
    const mainCategoriesMap = {
      women: { name: 'Ladies Wear', slug: 'women', image: '/assets/categories/women/dresses/image-1.jpg' },
      mens: { name: 'Gents Wear', slug: 'mens', image: '/assets/categories/mens/mens-shirts/image-1.jpg' },
      accessories: { name: 'Accessories', slug: 'accessories', image: '/assets/categories/accessories/bags/image-1.jpg' },
      kids: { name: 'Kids Wear', slug: 'kids', image: '/assets/categories/kids/kids-dresses/image-1.jpg' },
      'bridal-wear': { name: 'Bridal Wear', slug: 'bridal-wear', image: '/assets/categories/bridal-wear/bridal-gowns/image-1.jpg' },
      'gym-activewear': { name: 'GYM & Activewear', slug: 'gym-activewear', image: '/assets/categories/gym-activewear/sports-bras/image-1.jpg' },
    };

    const mainCategoryDocs = {};
    for (const [slug, data] of Object.entries(mainCategoriesMap)) {
      let doc = await MainCategory.findOne({ slug });
      if (!doc) {
        doc = await MainCategory.create(data);
        console.log(`Created MainCategory: ${doc.name}`);
      }
      mainCategoryDocs[slug] = doc;
    }

    // Ensure Sub Categories exist
    const subCategoriesMap = {
      dresses: { name: 'Dresses', slug: 'dresses', mainCategory: mainCategoryDocs['women']._id, image: '/assets/categories/women/dresses/image-1.jpg' },
      'tops-blouses': { name: 'Tops & Blouses', slug: 'tops-blouses', mainCategory: mainCategoryDocs['women']._id, image: '/assets/categories/women/tops-blouses/image-1.jpg' },
      'mens-shirts': { name: "Men's Shirts", slug: 'mens-shirts', mainCategory: mainCategoryDocs['mens']._id, image: '/assets/categories/mens/mens-shirts/image-1.jpg' },
      'suits-blazers': { name: 'Suits & Blazers', slug: 'suits-blazers', mainCategory: mainCategoryDocs['mens']._id, image: '/assets/categories/mens/suits-blazers/image-1.jpg' },
      'mens-trousers': { name: "Men's Trousers", slug: 'mens-trousers', mainCategory: mainCategoryDocs['mens']._id, image: '/assets/categories/mens/mens-trousers/image-1.jpg' },
      'mens-jeans': { name: "Men's Jeans", slug: 'mens-jeans', mainCategory: mainCategoryDocs['mens']._id, image: '/assets/categories/mens/mens-jeans/image-1.jpg' },
      jewellery: { name: 'Jewellery', slug: 'jewellery', mainCategory: mainCategoryDocs['accessories']._id, image: '/assets/categories/accessories/bags/image-1.jpg' },
      bags: { name: 'Bags', slug: 'bags', mainCategory: mainCategoryDocs['accessories']._id, image: '/assets/categories/accessories/bags/image-1.jpg' },
    };

    const subCategoryDocs = {};
    for (const [slug, data] of Object.entries(subCategoriesMap)) {
      let doc = await SubCategory.findOne({ slug });
      if (!doc) {
        doc = await SubCategory.create(data);
        console.log(`Created SubCategory: ${doc.name}`);
      }
      subCategoryDocs[slug] = doc;
    }

    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of sampleProducts) {
      const cat = mainCategoryDocs[item.categorySlug];
      const sub = subCategoryDocs[item.subCategorySlug];

      const productData = {
        name: item.name,
        sku: item.sku,
        price: item.price,
        currency: item.currency,
        colorLabel: item.colorLabel,
        images: item.images,
        category: cat._id,
        subCategory: sub._id,
        size: item.size || ['S', 'M', 'L'],
        stock: item.stock !== undefined ? item.stock : 20,
        sale: item.sale || false,
        originalPrice: item.originalPrice || undefined,
        description: `${item.name} is meticulously designed from premium fabric tailored to elevate your wardrobe for everyday elegance and upscale occasions.`
      };

      const existing = await Product.findOne({
        $or: [{ sku: item.sku }, { name: item.name }]
      });

      if (existing) {
        await Product.findByIdAndUpdate(existing._id, productData);
        updatedCount++;
      } else {
        await Product.create(productData);
        insertedCount++;
      }
    }

    const totalCount = await Product.countDocuments();
    console.log(`\n========================================`);
    console.log(`SUCCESS: Sample products synced to MongoDB!`);
    console.log(`Newly Inserted: ${insertedCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Total Products in Database: ${totalCount}`);
    console.log(`========================================\n`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error syncing sample products to MongoDB:', error);
    process.exit(1);
  }
}

run();
