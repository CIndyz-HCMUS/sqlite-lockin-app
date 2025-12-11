// frontend/src/components/MealFoodModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { fetchFoods, FoodDto } from "../services/foodService";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface FoodItem {
  id: number;
  name: string;
  caloriesPerServing: number;
  servingSize: number;
  servingUnit: string;
}

interface MealFoodModalProps {
  open: boolean;
  mealType: MealType | null;
  onClose: () => void;
  onAddFood: (mealType: MealType, food: FoodItem) => void;
}

const mealTypeLabel: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snacks",
};

const MealFoodModal: React.FC<MealFoodModalProps> = ({
  open,
  mealType,
  onClose,
  onAddFood,
}) => {
  const [activeTab, setActiveTab] = useState<"recent" | "favorite" | "myitems">(
    "recent"
  );
  const [search, setSearch] = useState("");
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Khi modal mở thì gọi GET /foods
  useEffect(() => {
    async function load() {
      if (!open) return;
      try {
        setLoading(true);
        setError(null);

        const data: FoodDto[] = await fetchFoods();

        setFoods(
          data.map((f) => ({
            id: f.id,
            name: f.name,
            caloriesPerServing: f.calories,
            servingSize: f.servingSize,
            servingUnit: f.servingUnit,
          }))
        );
      } catch (err: any) {
        setError(err.message || "Failed to load foods");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [open]);

  const filteredFoods = useMemo(() => {
    const term = search.toLowerCase();
    return foods.filter((f) => f.name.toLowerCase().includes(term));
  }, [foods, search]);

  if (!open || !mealType) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">{mealTypeLabel[mealType]}</div>
          <button className="modal-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="modal-search">
          <span className="modal-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search food"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs (UI là chính) */}
        <div className="modal-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("recent")}
            className={`modal-tab ${activeTab === "recent" ? "active" : ""}`}
          >
            Recently
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("favorite")}
            className={`modal-tab ${activeTab === "favorite" ? "active" : ""}`}
          >
            Favorite
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("myitems")}
            className={`modal-tab ${activeTab === "myitems" ? "active" : ""}`}
          >
            My Items
          </button>
        </div>

        {/* List */}
        <div className="modal-list">
          {loading && <div className="modal-empty">Loading foods...</div>}
          {error && <div className="modal-empty">{error}</div>}

          {!loading &&
            !error &&
            filteredFoods.map((food) => (
              <div key={food.id} className="modal-food-row">
                <div className="modal-food-main">
                  <div className="modal-food-avatar" />
                  <div>
                    <div className="modal-food-name">{food.name}</div>
                    <div className="modal-food-sub">
                      {food.servingSize} {food.servingUnit},{" "}
                      {food.caloriesPerServing} kcal
                    </div>
                  </div>
                </div>
                <div className="modal-food-actions">
                  {/* favorite tạm để sau */}
                  <button
                    type="button"
                    className="modal-add-btn"
                    onClick={() => onAddFood(mealType, food)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

          {!loading && !error && filteredFoods.length === 0 && (
            <div className="modal-empty">No food found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealFoodModal;
