export function validatePassword(password) {
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres";
  }

  const safePasswordRegex = /^[A-Za-z0-9@._-]+$/;
  if (!safePasswordRegex.test(password)) {
    return "La contraseña solo puede contener letras, números y los símbolos: @ . _ -";
  }

  return null; // ✅ válido
}