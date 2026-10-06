import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MainCategory from './models/mainCategory.js';
import SubCategory from './models/subCategory.js';
import Product from './models/product.js';

dotenv.config();

const mainCategoriesData = [
  { name: "Ladies Wear", slug: "women", image: "/assets/categories/women/dresses/image-1.jpg" },
  { name: "Gents Wear", slug: "mens", image: "/assets/categories/mens/mens-shirts/image-1.jpg" },
  { name: "Kids Wear", slug: "kids", image: "/assets/categories/kids/kids-dresses/image-1.jpg" },
  { name: "Accessories", slug: "accessories", image: "/assets/categories/accessories/bags/image-1.jpg" },
  { name: "Bridal Wear", slug: "bridal-wear", image: "/assets/categories/bridal-wear/bridal-gowns/image-1.jpg" },
  { name: "GYM & Activewear", slug: "gym-activewear", image: "/assets/categories/gym-activewear/sports-bras/image-1.jpg" }
];

const subCategoriesMap = {
  "women": [
    { name: "Dresses", slug: "dresses", folder: "dresses" },
    { name: "Skirts", slug: "skirts", folder: "skirts" },
    { name: "Women's Jeans", slug: "womens-jeans", folder: "womens-jeans" },
    { name: "Tops & Blouses", slug: "tops-blouses", folder: "tops-blouses" },
    { name: "Jackets & Coats", slug: "jackets-coats", folder: "jackets-coats" }
  ],
  "mens": [
    { name: "Men's Shirts", slug: "mens-shirts", folder: "mens-shirts" },
    { name: "Men's T-Shirts", slug: "mens-t-shirts", folder: "mens-t-shirts" },
    { name: "Men's Jeans", slug: "mens-jeans", folder: "mens-jeans" },
    { name: "Men's Trousers", slug: "mens-trousers", folder: "mens-trousers" },
    { name: "Suits & Blazers", slug: "suits-blazers", folder: "suits-blazers" }
  ],
  "kids": [
    { name: "Kids T-Shirts", slug: "kids-t-shirts", folder: "kids-t-shirts" },
    { name: "Kids Dresses", slug: "kids-dresses", folder: "kids-dresses" },
    { name: "School Wear", slug: "school-wear", folder: "school-wear" },
    { name: "Kids Bottoms", slug: "kids-bottoms", folder: "kids-bottoms" }
  ],
  "accessories": [
    { name: "Bags", slug: "bags", folder: "bags" },
    { name: "Belts", slug: "belts", folder: "belts" },
    { name: "Caps", slug: "caps", folder: "caps" },
    { name: "Sunglasses", slug: "sunglasses", folder: "sunglasses" }
  ],
  "bridal-wear": [
    { name: "Bridal Gowns", slug: "bridal-gowns", folder: "bridal-gowns" },
    { name: "Bridesmaid Dresses", slug: "bridesmaid-dresses", folder: "bridesmaid-dresses" },
    { name: "Bridal Accessories", slug: "bridal-accessories", folder: "bridal-accessories" }
  ],
  "gym-activewear": [
    { name: "Sports Bras", slug: "sports-bras", folder: "sports-bras" },
    { name: "Leggings & Tights", slug: "leggings-tights", folder: "leggings-tights" },
    { name: "Workout Tops", slug: "workout-tops", folder: "workout-tops" }
  ]
};

const priceRanges = [2990, 3490, 4990, 5990, 6990, 7890, 8490, 9990, 12490, 15990];
const colors = ["Black", "White", "Navy Blue", "Emerald Green", "Ruby Red", "Beige", "Pastel Pink", "Charcoal", "Olive", "Gold"];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await MainCategory.deleteMany({});
    await SubCategory.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing MainCategory, SubCategory, Product documents.");

    const createdMainCats = {};

    for (const mainCatData of mainCategoriesData) {
      const createdMain = await MainCategory.create(mainCatData);
      createdMainCats[mainCatData.slug] = createdMain;
      console.log(`Created MainCategory: ${createdMain.name}`);
    }

    let totalProductsCount = 0;

    for (const [mainSlug, subList] of Object.entries(subCategoriesMap)) {
      const mainCat = createdMainCats[mainSlug];
      if (!mainCat) continue;

      for (const subItem of subList) {
        const coverImagePath = `/assets/categories/${mainSlug}/${subItem.folder}/image-1.jpg`;
        const subCat = await SubCategory.create({
          name: subItem.name,
          slug: subItem.slug,
          mainCategory: mainCat._id,
          image: coverImagePath
        });

        console.log(`Created SubCategory: ${subCat.name}`);

        // Create 10 products for each subcategory, each product with 10 sub-related images
        for (let i = 1; i <= 10; i++) {
          const productImages = [];
          for (let imgNum = 1; imgNum <= 10; imgNum++) {
            const idx = ((i - 1 + imgNum - 1) % 10) + 1;
            productImages.push(`/assets/categories/${mainSlug}/${subItem.folder}/image-${idx}.jpg`);
          }

          const price = priceRanges[(i - 1) % priceRanges.length];
          const color = colors[(i - 1) % colors.length];

          const product = new Product({
            name: `${subItem.name} - ${color} Edition ${i}`,
            sku: `${subItem.slug.toUpperCase()}-SKU-${i.toString().padStart(3, '0')}`,
            price: price,
            currency: "Rs ",
            colorLabel: color,
            images: productImages, // 10 sub-related images per product
            category: mainCat._id,
            subCategory: subCat._id
          });

          await product.save();
          totalProductsCount++;
        }
      }
    }

    console.log(`Seeding complete! Total products created: ${totalProductsCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
