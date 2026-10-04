export type Category = 'starters' | 'mains' | 'desserts';

export type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
};

export type GuestProfile = {
  firstName: string;
  lastName: string;
  email: string;
  orderUpdates: boolean;
  specialOffers: boolean;
};
