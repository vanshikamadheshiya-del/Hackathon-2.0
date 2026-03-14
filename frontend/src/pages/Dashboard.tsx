import { Typography, Box } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography>
        This dashboard is not used in the current minimal setup (login + products only).
      </Typography>
    </Box>
  );
}