import Payment from "../models/Payment.js";
import User from "../models/User.js";

export const createPayment = async (paymentData) => {
  const payment = new Payment(paymentData);
  await payment.save();

  // Actualizar usuario con nueva fecha de vencimiento y tipo de vencimiento
  if (paymentData.userId && paymentData.expirationDate) {
    await User.findByIdAndUpdate(
      paymentData.userId,
      {
        dueDate: paymentData.expirationDate,
        ...(paymentData.expirationType && {
          expirationType: paymentData.expirationType,
        }),
      },
      { new: true }
    );
  }

  return payment;
};

export const getAllPayments = async () => {
  return await Payment.find();
};

export const updatePayment = async (id, updateData) => {
  const payment = await Payment.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!payment) throw new Error("Pago no encontrado");

  // Si se envía userId y expirationDate, actualiza el usuario
  if (updateData.userId && updateData.expirationDate) {
    await User.findByIdAndUpdate(
      updateData.userId,
      {
        dueDate: updateData.expirationDate,
        ...(updateData.expirationType && {
          expirationType: updateData.expirationType,
        }),
      },
      { new: true }
    );
  }

  return payment;
};
