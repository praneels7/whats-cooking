export const ACTIVITY_OPTIONS = [
  { id: 'rarely', label: 'Rarely Active — 0–1 workouts per week' },
  { id: 'lightly', label: 'Lightly Active — 2–3 workouts per week' },
  { id: 'moderate', label: 'Moderately Active — 4–5 workouts per week' },
  { id: 'very', label: 'Very Active — 6+ workouts per week' },
];

export const STRUGGLE_OPTIONS = [
  { id: 'consistency', label: 'I struggle with consistency' },
  { id: 'cravings', label: 'I give in to cravings' },
  { id: 'motivation', label: 'I lose motivation' },
  { id: 'emotions', label: 'I eat from emotions/stress' },
  { id: 'lost', label: "I don't know what to do" },
];

export const CALORIE_STATS = {
  consumed: 1456,
  remaining: 2875,
  goalTotal: 1456 + 2875,
};

export const MACRO_STATS = [
  { key: 'protein', label: 'Protein', current: 10, target: 12 },
  { key: 'carbs', label: 'Carbs', current: 10, target: 12 },
  { key: 'fats', label: 'Fats', current: 10, target: 12 },
];

export const FOOD_LOG = [
  {
    id: '1',
    name: 'Grilled Chicken',
    calories: 350,
    image:
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=240&q=80',
  },
  {
    id: '2',
    name: 'Chicken Salad',
    calories: 240,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=240&q=80',
  },
  {
    id: '3',
    name: 'Oat Meal',
    calories: 180,
    image:
      'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=240&q=80',
  },
];

const MSG_A =
  "You exceeded your calorie limit! Please ensure you're following your selected diet.";
const MSG_B =
  'You met your daily activity goal! Keep up the good work!';

export const NOTIFICATIONS = Array.from({ length: 7 }, (_, i) => ({
  id: String(i + 1),
  message: i % 2 === 0 ? MSG_A : MSG_B,
}));

export const USER = {
  displayName: 'Mr.Fugazi',
  greetingName: 'Hey Mr.Fugazi!',
  settingsName: 'Ozzie Berkstresser',
  editUsername: 'Fugazi',
  email: 'fugazi@gmail.com',
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
};

/** Seven days centered on today for the date strip */
export function getDateStrip(centerDate = new Date()) {
  const strip = [];
  for (let offset = -3; offset <= 3; offset += 1) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + offset);
    strip.push({
      id: d.toISOString().slice(0, 10),
      day: d.getDate(),
      month: d.toLocaleString('en-US', { month: 'short' }),
      isToday: offset === 0,
    });
  }
  return strip;
}
