import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
const router = express.Router();

// Crear pago
router.post('/', async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();

    // Actualizar usuario con nueva fecha de vencimiento y tipo de vencimiento
    if (req.body.userId && req.body.expirationDate) {
      await User.findByIdAndUpdate(
        req.body.userId,
        {
          dueDate: req.body.expirationDate,
          ...(req.body.expirationType && { expirationType: req.body.expirationType })
        },
        { new: true }
      );
    }

    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar pagos
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
