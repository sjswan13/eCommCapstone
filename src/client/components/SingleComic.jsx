import React from 'react';
import {useParams, useNavigate } from 'react-router-dom';
import { useFetchComicsByIdQuery, useAddToCartComicMutation } from '../../api_calls/api';
import AddToCart from './AddToCart';
import { useSelector } from 'react-redux';
import { Button, Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const SingleComic= () => {
  const { comicId } = useParams();
  const { data: comic, error, isLoading, refetch } = useFetchComicsByIdQuery(comicId);
  const [addToCart, { isLoading: isUpdating, data}] = useAddToCartComicMutation();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);

  async function handleAddToCartClick(e) {
    e.preventDefault();

    try {
     
      const response = await addToCart({ comicId }).unwrap();
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
        Back to Comics
      </Button>
      {comic && (
        <Card sx={{ backgroundColor: 'lightgrey'}}>
          <CardMedia
          component='img'
          image={comic.comic.coverimage}
          alt={`Cover of ${comic.comic.title}`}
          sx={{ width: 'auto', maxHeight: 600, margin: '15px auto' }}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {comic.comic.title}
            </Typography>
            <Typography variant='body2'color='text.secondary'>
              Author: {comic.comic.author}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Description: {comic.comic.description}
            </Typography>
<<<<<<< Updated upstream
            {token && comic.comic.available ? (
=======
            <Typography variant='body2' color='text.secondary'>
              Number in Stock: {comic.inventory}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Price in USD: {comic.price}
            </Typography>
            {
            // token && 
            comic.inventory > 0 ? (
>>>>>>> Stashed changes
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
          <Button variant='outlined' onClick={() => navigate('/comic-books')}>Comics</Button>
        </Box>
        </Card>
      )}
    </Box>
  );
};

export default SingleComic;