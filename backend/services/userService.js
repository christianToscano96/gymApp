// Actualiza la última visita del usuario
export const updateLastVisit = async (id, lastVisit) => {
  const user = await User.findById(id);
  if (!user) return null;
  user.lastVisit = lastVisit;
  await user.save();
  return user;
};
import User from "../models/User.js";

export const findByQrCode = async (qrCode) => {
  return await User.findOne({ qrCode: String(qrCode) });
};

export const createOrUpdateUser = async (userData) => {
  const { email } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) {
    // No modificar el rol si ya es administrator
    if (userExists.role === "administrator") {
      throw new Error(
        "El usuario ya es administrador y no se puede cambiar el rol."
      );
    }
    // Actualizar otros campos pero no el rol
    Object.assign(userExists, userData, { role: userExists.role });
    await userExists.save();
    return userExists;
  }
  // Si es nuevo usuario, respeta el rol enviado
  const user = new User(userData);
  await user.save();
  return user;
};

export const updateUser = async (id, updateData) => {
  const user = await User.findById(id);
  if (!user) throw new Error("Usuario no encontrado");

  // Solo permitir actualizar dueDate y expirationType si el rol es 'user'
  if (user.role === "user") {
    if (updateData.dueDate !== undefined) user.dueDate = updateData.dueDate;
    if (updateData.expirationType !== undefined)
      user.expirationType = updateData.expirationType;
  }
  // Actualizar otros campos permitidos
  user.name = updateData.name ?? user.name;
  user.phone = updateData.phone ?? user.phone;
  user.email = updateData.email ?? user.email;
  user.status = updateData.status ?? user.status;
  user.lastVisit = updateData.lastVisit ?? user.lastVisit;
  user.avatar = updateData.avatar ?? user.avatar;
  user.joinDate = updateData.joinDate ?? user.joinDate;
  user.qrCode = updateData.qrCode ?? user.qrCode;
  user.dni = updateData.dni ?? user.dni;
  // No permitir cambiar el rol ni el password desde aquí
  await user.save();
  return user;
};

export const getUserById = async (id) => {
  return await User.findById(id);
};

export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export const getAllUsers = async () => {
  return await User.find();
};
