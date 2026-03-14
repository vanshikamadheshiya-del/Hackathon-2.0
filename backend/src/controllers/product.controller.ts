import { Request, Response } from "express";
import Product from "../models/Product";
import { isValidObjectId } from "mongoose";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, slug, description, price, stock, category, isPublished } = req.body;
    
    // Handle image if uploaded (optional for now)
    const image = (req.files as any)?.[0]?.path || req.body.image;

    const product = await Product.create({
      name,
      slug,
      description,
      price: Number(price) || 0,
      stock: Number(stock) || 0,
      category,
      image,
      isPublished: isPublished === "true" || isPublished === true,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Products fetched", total: products.length, products });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid product ID" });

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product fetched", product });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid product ID" });

  try {
    const { name, slug, description, price, stock, category, isPublished } = req.body;
    
    const updateData: any = {
      name,
      slug,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      isPublished: isPublished === "true" || isPublished === true,
    };

    if ((req.files as any)?.[0]) {
      updateData.image = (req.files as any)[0].path;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product: updated });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid product ID" });

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted", product: deleted });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
