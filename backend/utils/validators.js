export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidDNI(dni) {
  return /^\d{7,8}$/.test(dni);
}
