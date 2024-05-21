import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = 'http://localhost:3000/'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log(getState());
      if(token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Content-type', 'application/json')
      return headers;
    }
  }),
  
  endpoints: (builder) => ({
    me: builder.query({
      query: () => "auth/me",
      providesTags: ["Me"],
    }),
    
    registrationForm: builder.mutation({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Me"],
    }),

    login: builder.mutation({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Me"],
    }),

    logout: builder.mutation ({
      queryFn: () => ({ data: {} }),
      invalidatesTags: ["Me"],
    }),

    welcome: builder.query({
      query: () => '/',
    }),
    
    fetchAllProducts: builder.query({
      query: () => `api/product`, 
    }),

    fetchProductById: builder.query({
      query:(productId) => `api/product/${productId}`,
    }),

    fetchBooksById: builder.query({
      query:(bookId) => `api/product/${bookId}`,
    }),

    fetchComicsById: builder.query({
      query:(comicId) => `api/product/${comicId}`,
    }),

    fetchMagazinesById: builder.query({
      query:(magazineId) => `api/product/${magazineId}`,
    }),

    fetchProductsBySession: builder.query({
      query:(sessionId) => `api/cartItem/customer/${sessionId}`,
    }),
    
    addToCart: builder.mutation({
      query: ({ sessionId, productId, quantity, type }) => ({
        url: `api/cartitem/${sessionId}`,
        method: 'POST',
        body: { 
          sessionId: parseInt(sessionId), 
          productId: parseInt(productId), 
          quantity: parseInt(quantity),
          type,
        },
      }),
    }),



    fetchAllCartItems: builder.query({
      query: () => 'api/cartItem/'
    }),



    fetchOrderHistory: builder.query({
      query: (customerId) => `api/orderDetail/${customerId}`,
    }),
    
    fetchAllCustomerData: builder.query({
      query: () => '/api/customer',
    }),
    
    // removeFromCart: builder.mutation({
    //   query: ({ sessionId, productId }) => ({
    //     url: `api/cart/cartitem/${sessionId}/${productId}`,
    //     method: 'DELETE',
    //     // body: { productId }
    //   }),
    // }),
    //   createCheckoutSession: builder.mutation({
    //   query: ({ cartProducts }) => ({
    //     url: 'checkout/create-checkout-session',
    //     method: 'POST',
    //     body: { cartProducts },
    //   }),
    // }),
    
  }),
});

export const {
  useFetchAllProductsQuery,
  useFetchBooksByIdQuery,
  useFetchComicsByIdQuery,
  useFetchMagazinesByIdQuery,
  useFetchProductByIdQuery,
  useRegistrationFormMutation,
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useWelcomeQuery,
  useFetchAllCartItemsQuery,
  useAddToCartMutation,
  useFetchProductsBySessionQuery,
  // useCreateCheckoutSessionMutation,
  // useRemoveFromCartMutation,
  useFetchOrderHistoryQuery,
  useFetchAllCustomerDataQuery
} = api;