import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardActions, Button, Typography, Box, Grid } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { redirect } from "react-router-dom";
import '../style.css'
import { useFetchCartBySessionQuery, useRemoveFromCartMutation, useRemoveShoppingSessionMutation } from "../redux/api";


const Cart = () => {

  const location1 = useLocation();
  const params = new URLSearchParams(location1.search);
  const message = params.get('message');
  const sessionId = useSelector((state) => state.auth.sessionId)
  console.log(sessionId);
  const {data: cartProducts, isLoading, error} = useFetchCartBySessionQuery(sessionId);
  const [removeFromCart, { isLoading: isUpdating}] = useRemoveFromCartMutation();
  const [removeShoppingSession] = useRemoveShoppingSessionMutation();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(sessionId);
  console.log(cartProducts);

  async function handleRemoveFromCart(id) {

    try {
      await removeFromCart({
        id: parseInt(id)
      })
      location.reload();

    } catch(error) {
      console.error('Error removing item from cart:', error.message);
    }
  const makePayment = async () => {
    const stripe = await loadStripe('pk_test_51PECT8P0XwnQ2xvXxTq35D4lEZkx7dxmdc0VXfKOWYWYuot4x4KgTbPHuV9CrU0FtE8TcYYpdcqBPzsTLqrfJP1c00bbJEW8sP');
    const body = {
      products: cartProducts
    }
    const headers = {
      "Content-Type":"application.json"
    }
    const response = await fetch(`localhost:3000/api/checkout/create-checkout-session`,{
      method:"POST",
      headers:headers,
      body:JSON.stringify(body)
    })
    const session = await response.json()
    const result = stripe.redirectToCheckout({
      sessionId:session.id
    })
  }



  const handleClearCart = () => {
    dispatch(clearCart());
  async function handleClearCart() {

    try {
      await removeShoppingSession({
        sessionId: parseInt(sessionId)
      })
      location.reload();


    } catch(error) {
      console.error('Error removing items from cart:', error.message);
    }
  };
  
  const handleProceedToCheckout = () => {
    fetch('api/checkout/create-checkout-session', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartProducts })
    }).then(res => {
      if (res.ok) return res.json()
    }).then(({ url }) => {
      window.location = url
    }).catch(e => {
      console.error(e.error);
    })
  };


  const totalPrice = cartProducts.reduce((sum, product) => sum + product.product.price * product.quantity, 0);


  return (
    <Box className='cart-container'>
      {message && <p>{message}</p>}
      <Typography variant="h4" className="cart-header">
        Shopping Cart
      </Typography>
      {cartProducts.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {cartProducts.map((product) => (
              <Grid item xs={12} md={6} lg={4} key={product.id}>
                <Card sx={{ bgcolor: 'lightblue', borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantity: {product.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {product.type}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleRemoveFromCart(product.id)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5">Summary:</Typography>
            <Typography>Total Items: {cartProducts.length}</Typography>
            <Typography>Total Cost: ${totalPrice.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
              variant="contained"
              color="warning"
              onClick={makePayment}
              sx={{ bgcolor: 'orange', ':hover': { bgcolor: 'darkorange' } }}
            >
              Checkout
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleClearCart}
              sx={{ bgcolor: 'orange', ':hover': { bgcolor: 'darkorange' } }}
            >
              Clear Cart
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body1">Your cart is empty.</Typography>
      )}
      <Box className='cart-page'>
        <Box className="card-items-cart">
          {cartProducts.map((product) => (
            <Box key={product.product.id}>
              <Card sx={{
                bgcolor: 'lightgrey',
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '250px',
                margin: 2, 
                maxWidth: '300px'
              }}>
                <CardContent>
                  <Typography gutterBottom variant="h6">{product.product.name}</Typography>
                  <Typography variant="body2">Price: ${product.product.price}</Typography>
                  <Typography variant="body2">Quantity: {product.quantity}</Typography>
                  <Typography variant="body2">Category ID: {product.product.categoryId}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => handleRemoveFromCart(product.id)}
                  >
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
        <Box className='cart-summary'>
          <Typography variant="h5">Summary:</Typography>
          <Typography>Total Items: {cartProducts.length}</Typography>
          <Typography>Total Cost: ${totalPrice.toFixed(2)}</Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={handleProceedToCheckout}
          >
            Proceed To Checkout
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 1 }}
            onClick={() => handleClearCart(sessionId)}
          >
            Clear Cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
};


export default Cart;
