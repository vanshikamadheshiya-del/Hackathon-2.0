import { Schema, model, Types } from 'mongoose';
import { IProduct, IAttributeValue, IVariant, IInventory } from '../types';

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  category: { type: String },
  image: { type: String },
  isPublished: { type: Boolean, default: false },
}, { timestamps: true });

export default model<IProduct>('Product', ProductSchema);
