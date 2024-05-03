import React from 'react';
import {useParams, useNavigate } from 'react-router-dom';
import { useFetchMagazinesByIdQuery, useAddToCartMagazineMutation } from '../../api_calls/api';
import AddToCart from './AddToCart';
import { useSelector } from 'react-redux';
import { Button, Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const SingleMagazine= () => {
  const { magazineId } = useParams();
  const { data: magazine, error, isLoading, refetch } = useFetchMagazinesByIdQuery(magazineId);
  // const [addToCart, { isLoading: isUpdating, data}] = useAddToCartMagazineMutation();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);

  async function handleAddToCartClick(e) {
    e.preventDefault();

    try {
     
      const response = await addToCart({ magazineId }).unwrap();
      refetch();
      
    } catch (error) {
      console.log(error.message)
    }
  }

  if(isLoading) return <div>Loading...</div>;
  if(error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon/>}
        sx={{ mb: 2, color: 'black' }}
        onClick={() => window.history.back()}
        >
        Back to Magazines
      </Button>
      {magazine && magazine.magazine && (
        <Card sx={{ backgroundColor: 'lightgrey'}}>
          <CardMedia
          component='img'
          image={magazine.magazine.coverimage}
          alt={`Cover of ${magazine.magazine.title}`}
          sx={{ width: 'auto', maxHeight: 600, margin: '15px auto' }}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {magazine.magazine.title}
            </Typography>
            <Typography variant='body2'color='text.secondary'>
              Author: {magazine.magazine.author}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Description: {magazine.magazine.description}
            </Typography>
            {token && magazine.magazine.available ? (
              <Button onClick={handleAddToCartClick} variant='contained' color='primary' sx={{ mt: 2, color: 'black' }}>
                Checkout
              </Button>
            ) : (
              <Button disabled variant='containted' sx={{ mt: 2, bgcolor: 'grey.500', color: 'white', '$.Mui-disabled': { color: 'white' }}}>
                Unavailable
              </Button>
            )}
          </CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button variant='outlined' onClick={() => navigate('/')} sx={{ mr: 1 }}>Home</Button>
          <Button variant='outlined' onClick={() => navigate('/magazines')}>Magazines</Button>
        </Box>
        </Card>
      )}
    </Box>
  );
};

export default SingleMagazine;