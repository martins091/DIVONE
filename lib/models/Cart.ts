import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        productName: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        size: String,
        color: String,
        image: String,
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model('Cart', cartSchema);
