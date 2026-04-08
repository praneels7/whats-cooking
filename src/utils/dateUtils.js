/**
 * Generates a strip of dates centered on today.
 * @param {Date} centerDate - The date to center the strip on.
 * @returns {Array} - Array of date objects {id, day, month, isToday}.
 */
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
