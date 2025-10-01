export function formatDate(date) {
  return new Date(date).toLocaleDateString("es-AR");
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
