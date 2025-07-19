export type ProductType =
  | "jar"
  | "card"
  | "flower_stem"
  | "bouquet";

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  theme?: string; // e.g., "Romantic", "Birthday", "Anniversary", "Apology"
  description?: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  isFavorite?: boolean;
  size?: "regular" | "mega" | "super";
  tags?: string[];
}

export const products: Product[] = [
  // Jars
  {
    id: "jar-romantic",
    name: "Romantic Jar",
    type: "jar",
    theme: "Romantic",
    description: "A jar filled with romantic notes and keepsakes.",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 39.99,
    isOnSale: true,
    tags: ["romantic", "jar", "gift"]
  },
  {
    id: "jar-birthday",
    name: "Birthday Jar",
    type: "jar",
    theme: "Birthday",
    description: "A special jar for birthdays, filled with cheerful notes.",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
    ],
    price: 34.99,
    tags: ["birthday", "jar", "gift"]
  },
  {
    id: "jar-anniversary",
    name: "Anniversary Jar",
    type: "jar",
    theme: "Anniversary",
    description: "Celebrate anniversaries with heartfelt messages in a jar.",
    image: "https://images.unsplash.com/photo-1455659817273-f2fd6aaa3e8d?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1455659817273-f2fd6aaa3e8d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 44.99,
    tags: ["anniversary", "jar", "gift"]
  },
  {
    id: "jar-apology",
    name: "Apology Jar",
    type: "jar",
    theme: "Apology",
    description: "A thoughtful jar to say 'I'm sorry' with meaningful notes.",
    image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 32.99,
    tags: ["apology", "jar", "gift"]
  },
  // Cards
  {
    id: "card-romantic",
    name: "Romantic Card",
    type: "card",
    theme: "Romantic",
    description: "A romantic card for special occasions.",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 7.99,
    tags: ["romantic", "card"]
  },
  {
    id: "card-birthday",
    name: "Birthday Card",
    type: "card",
    theme: "Birthday",
    description: "A cheerful birthday card.",
    image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 6.99,
    tags: ["birthday", "card"]
  },
  {
    id: "card-anniversary",
    name: "Anniversary Card",
    type: "card",
    theme: "Anniversary",
    description: "A card to celebrate anniversaries.",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 8.99,
    tags: ["anniversary", "card"]
  },
  {
    id: "card-apology",
    name: "Apology Card",
    type: "card",
    theme: "Apology",
    description: "A card to say 'I'm sorry' in a heartfelt way.",
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 6.49,
    tags: ["apology", "card"]
  },
  {
    id: "card-custom",
    name: "Custom Card",
    type: "card",
    theme: "Custom",
    description: "A card you can personalize with your own message and playlist.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 12.99,
    tags: ["custom", "card"]
  },
  {
    id: "jar-custom",
    name: "Custom Jar",
    type: "jar",
    theme: "Custom",
    description: "A jar you can personalize with your own notes.",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 54.99,
    tags: ["custom", "jar"]
  },
  // Individual Glitter Roses
  {
    id: "rose-glitter",
    name: "Individual Glitter Rose",
    type: "flower_stem",
    description: "A single rose stem with a touch of glitter.",
    image: "https://images.unsplash.com/photo-1455659817273-f2fd6aaa3e8d?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1455659817273-f2fd6aaa3e8d?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 9.99,
    tags: ["rose", "glitter", "flower_stem"]
  },
  // Bouquets
  {
    id: "bouquet-regular",
    name: "Regular Bouquet",
    type: "bouquet",
    size: "regular",
    description: "A beautiful regular-sized bouquet.",
    image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 49.99,
    tags: ["bouquet", "regular"]
  },
  {
    id: "bouquet-mega",
    name: "Mega Bouquet",
    type: "bouquet",
    size: "mega",
    description: "A large, impressive bouquet for special occasions.",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 79.99,
    tags: ["bouquet", "mega"]
  },
  {
    id: "bouquet-super",
    name: "Super Big Bouquet",
    type: "bouquet",
    size: "super",
    description: "Our biggest bouquet, overflowing with flowers!",
    image: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
    ],
    price: 119.99,
    tags: ["bouquet", "super"]
  }
]; 