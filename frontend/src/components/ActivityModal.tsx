import React, { useMemo, useState } from "react";

export type ActivityType = "cardio" | "strength";

export interface ActivityItem {
  id: number;
  name: string;
  caloriesPerSession: number; // ví dụ 30 phút
}

interface ActivityModalProps {
  open: boolean;
  activityType: ActivityType | null;
  onClose: () => void;
  onAddActivity: (type: ActivityType, activity: ActivityItem) => void;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: 1, name: "Jogging", caloriesPerSession: 250 },
  { id: 2, name: "Cycling", caloriesPerSession: 200 },
  { id: 3, name: "Strength training", caloriesPerSession: 300 },
];

const activityTypeLabel: Record<ActivityType, string> = {
  cardio: "Cardiovascular",
  strength: "Strength Training",
};

const ActivityModal: React.FC<ActivityModalProps> = ({
  open,
  activityType,
  onClose,
  onAddActivity,
}) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return MOCK_ACTIVITIES.filter((a) =>
      a.name.toLowerCase().includes(term)
    );
  }, [search]);

  if (!open || !activityType) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title">{activityTypeLabel[activityType]}</div>
          <button className="modal-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="modal-search">
          <span className="modal-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search activity"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="modal-list">
          {filtered.map((act) => (
            <div key={act.id} className="modal-food-row">
              <div className="modal-food-main">
                <div className="modal-food-avatar" />
                <div>
                  <div className="modal-food-name">{act.name}</div>
                  <div className="modal-food-sub">
                    Per session, {act.caloriesPerSession} kcal
                  </div>
                </div>
              </div>
              <div className="modal-food-actions">
                <button
                  type="button"
                  className="modal-add-btn"
                  onClick={() => onAddActivity(activityType, act)}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="modal-empty">No activity found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
