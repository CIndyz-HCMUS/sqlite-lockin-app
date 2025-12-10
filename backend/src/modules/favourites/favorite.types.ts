export type FavoriteItemType = "food" | "exercise";

export interface FavoriteRow {
  id: number;
  user_id: number;
  item_type: string;
  item_id: number;
  created_at: string;
}

export interface FavoriteDTO {
  id: number;
  userId: number;
  itemType: FavoriteItemType;
  itemId: number;
  createdAt: string;
  item?: {
    id: number;
    name: string;
    imageUrl?: string | null;
    tags?: string[];
    type: FavoriteItemType;
  };
}

export interface CreateFavoriteInput {
  userId: number;
  itemType: FavoriteItemType;
  itemId: number;
}
