import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFetchBooksByIdQuery, useAddToCartMutation } from '../redux/api';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { addProductToCart } from '../redux/cartslice';

const SingleBook = () => {
  const { bookId } = useParams();
  const customer = useSelector((state) => state.auth.customer);
  const sessionId = (customer.shoppingSessions[0]).id;
  const { data: book, error, isLoading } = useFetchBooksByIdQuery(bookId);
  const [addToCart, { isLoading: isUpdating }] = useAddToCartMutation();
  const navigate = useNavigate();
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();

  async function handleAddToCartClick(e) {
  e.preventDefault();
  try {
    await addToCart({
      sessionId: parseInt(sessionId),
      productId: parseInt(bookId),
      quantity: 1,
    })

    console.log('Book added to cart successfully');

    dispatch(addProductToCart({
      id: bookId,
      name: book.name,
      price: book.price,
      quantity: 1,
      type: 'Book'
    }));
  } catch (error) {
    console.error('Error adding book to cart:', error.message);
  }
}

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2, color: 'black' }}
        onClick={() => window.history.back()}
      >
        Back to Books
      </Button>
      {book && (
        <Card sx={{ backgroundColor: 'lightgrey' }}>
          <CardMedia
            component='img'
            image={book.imageUrl}
            alt={`Cover of ${book.name}`}
            sx={{ width: 'auto', maxHeight: 600, margin: '15px auto' }}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {book.name}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              SKU: {book.SKU}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Description: {book.desc}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Number in Stock: {book.inventory}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Price in USD: {book.price}
            </Typography>

            {/* Checkout and Add to Cart Button Logic */}
            {book.inventory > 0 ? (
              <Button
                onClick={handleAddToCartClick}
                variant='contained'
                color='primary'
                sx={{ mt: 2, color: 'black' }}
              >
                Add to Cart
              </Button>
            ) : (
              <Button
                disabled
                variant='contained'
                sx={{ mt: 2, bgcolor: 'grey.500', color: 'white', '$.Mui-disabled': { color: 'white' } }}
              >
                Unavailable
              </Button>
            )}
          </CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Button variant='outlined' onClick={() => navigate('/')} sx={{ mr: 1 }}>
              Home
            </Button>
            <Button variant='outlined' onClick={() => navigate('/books')}>
              Books
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default SingleBook;
