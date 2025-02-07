import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
    {
        code: { type: String, unique: true, required: true },
        title: { type: String, required: true },
        description: { type: String},
        price: { type: Number, required: true, min: 0 },
        category: { type: String, required: true },
        stock: { type: Number, required: true, min: 0 },
        status: { type: Boolean, default: true },
        thumbnail: { type: String }  
    }, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;