import mongoose from 'mongoose';

const paymentConfirmationSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    transactionReference: { type: String, required: true, unique: true },
    screenshotUrl: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    notes: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentConfirmation ||
  mongoose.model('PaymentConfirmation', paymentConfirmationSchema);
