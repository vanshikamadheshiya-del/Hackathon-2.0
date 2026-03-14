import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { getProductByIdAPI } from "../../services/product.api";
import type { Product } from "../../types/product";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight="medium">
        {label}
      </Typography>
      <Typography variant="body1" mt={0.25}>
        {value}
      </Typography>
    </Box>
  );
}

export default function ProductViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductByIdAPI(id)
        .then((p) => setProduct(p))
        .catch(() => navigate("/products"))
        .finally(() => setLoading(false));
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Box p={3} maxWidth="md" mx="auto">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/products")}
            variant="text"
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Product Details
          </Typography>
        </Box>
        <Button
          startIcon={<EditIcon />}
          variant="contained"
          onClick={() => navigate(`/products/edit/${id}`)}
        >
          Edit
        </Button>
      </Box>

      <Paper sx={{ p: 4 }}>
        {/* Name + Status */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Slug: <code>{product.slug}</code>
            </Typography>
          </Box>
          <Chip
            label={product.stock > 0 ? "In Stock" : "Out of Stock"}
            color={product.stock > 0 ? "success" : "error"}
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Details grid */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Price" value={`₹${product.price}`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Stock Quantity" value={product.stock} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="Category" value={product.category || "—"} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow
              label="Published"
              value={
                <Chip
                  label={product.isPublished ? "Yes" : "No"}
                  color={product.isPublished ? "success" : "default"}
                  size="small"
                />
              }
            />
          </Grid>
          {product.description && (
            <Grid size={{ xs: 12 }}>
              <InfoRow label="Description" value={product.description} />
            </Grid>
          )}
          {product.createdAt && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoRow
                label="Created At"
                value={new Date(product.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              />
            </Grid>
          )}
          {product.updatedAt && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <InfoRow
                label="Last Updated"
                value={new Date(product.updatedAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              />
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
}
