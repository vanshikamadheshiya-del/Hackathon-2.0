import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserAPI,
  getUserByIdAPI,
  updateUserAPI,
} from "../../services/user.api";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("A valid email is required"),
});

type UserFormSchema = z.infer<typeof userSchema>;

export default function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      getUserByIdAPI(id)
        .then((user) => {
          if (!user) throw new Error("User not found");
          reset({ name: user.name, email: user.email });
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
          navigate("/users");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data: UserFormSchema) => {
    try {
      if (isEdit && id) {
        await updateUserAPI(id, data);
      } else {
        await createUserAPI(data);
      }
      navigate("/users");
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to save user.");
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
    <Box maxWidth="sm" mx="auto" p={2}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? "Edit User" : "Add New User"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Full Name"
                fullWidth
                sx={{ mb: 2 }}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email Address"
                fullWidth
                sx={{ mb: 3 }}
                error={!!errors.email}
                helperText={
                  errors.email?.message ||
                  (!isEdit
                    ? "A password setup link will be sent to this email."
                    : undefined)
                }
              />
            )}
          />

          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{ minWidth: 140 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Save User"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/users")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
