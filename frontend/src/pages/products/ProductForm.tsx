import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProductAPI,
  getProductByIdAPI,
  updateProductAPI,
} from "../../services/product.api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  category: z.string().optional(),
});

type ProductFormSchema = z.infer<typeof productSchema>;

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    },
  });

  const { control, handleSubmit, reset, watch, setValue, formState: { isSubmitting, errors } } = form;
  const nameValue = watch("name");

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit && nameValue) {
      const generatedSlug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, isEdit, setValue]);

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getProductByIdAPI(id)
        .then((product) => {
          if (!product) throw new Error("Product not found");
          reset({
            name: product.name,
            slug: product.slug,
            description: product.description || "",
            price: product.price,
            stock: product.stock,
            category: product.category || "",
          });
        })
        .catch((err) => {
          console.error("Failed to fetch product:", err);
          navigate("/products");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data: ProductFormSchema) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      if (isEdit && id) {
        await updateProductAPI(id, formData);
      } else {
        await createProductAPI(formData);
      }
      navigate("/products");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to save product.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" p={2}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? "Edit Product" : "Create New Product"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Product Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="slug"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Slug"
                  fullWidth
                  error={!!errors.slug}
                  helperText={errors.slug?.message}
                />
              )}
            />
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Price (₹)"
                  type="number"
                  fullWidth
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Stock Quantity"
                  type="number"
                  fullWidth
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              )}
            />
          </Box>

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Category"
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={4}
                fullWidth
                sx={{ mb: 3 }}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            )}
          />

          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ minWidth: 150 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Save Product"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
