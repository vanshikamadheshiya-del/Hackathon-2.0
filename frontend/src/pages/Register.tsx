import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { registerAPI } from '../services/auth.api';
import type { RegisterData } from '../types/auth';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    try {
      const payload: RegisterData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      await registerAPI(payload);
      enqueueSnackbar('Registration successful! Please log in.', {
        variant: 'success',
      });
      navigate('/auth/login');
    } catch (error: unknown) {
      const err = error as any;
      enqueueSnackbar(
        err?.response?.data?.message || 'Registration failed',
        { variant: 'error' },
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            autoComplete="name"
            autoFocus
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/auth/login')}
          >
            Already have an account? Sign in
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

