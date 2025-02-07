import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, min: 1, default: 1 }
        }
    ],
    expiresAt: { type: Date, default: null } 
}, { timestamps: true });

cartSchema.pre('findOne', function () {
    this.populate('products.product');
});

cartSchema.index({ userId: 1 });

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;