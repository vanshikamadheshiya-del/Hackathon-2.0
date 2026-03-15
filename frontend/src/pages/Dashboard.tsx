import { useEffect, useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  CircularProgress
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import { getProductsAPI } from '../services/product.api';
import { getUsersAPI } from '../services/user.api';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const [productsRes, usersRes] = await Promise.all([
          getProductsAPI(),
          getUsersAPI()
        ]);
        setProductCount(productsRes.products?.length || 0);
        setUserCount(usersRes.users?.length || 0);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Overview
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4} mt={1}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={() => navigate('/users')} sx={{ p: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="h6" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {userCount !== null ? userCount : '—'}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.8 }} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardActionArea onClick={() => navigate('/products')} sx={{ p: 2 }}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" variant="h6" gutterBottom>
                      Total Products
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {productCount !== null ? productCount : '—'}
                    </Typography>
                  </Box>
                  <LocalOfferIcon sx={{ fontSize: 60, color: 'secondary.main', opacity: 0.8 }} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}