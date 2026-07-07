export type Category = {
  id: number;
  slug: string;
  label: string;
  display_order: number;
};

export type UserRole = 'client' | 'prestataire' | 'admin';

export type ProjectSize = 'standard' | 'grand_projet';
