import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      const existingItem = state.find(item => 
        item.id === action.id && item.size === action.size
      );
      
      if (existingItem) {
        return state.map(item =>
          item.id === action.id && item.size === action.size
            ? { ...item, qty: item.qty + action.qty }
            : item
        );
      }
      return [...state, { 
        id: action.id, 
        name: action.name, 
        price: action.price, 
        qty: action.qty, 
        size: action.size,
        img: action.img 
      }];

    case 'REMOVE':
      return state.filter((_, index) => index !== action.index);

    case 'UPDATE':
      return state.map((item, index) =>
        index === action.index ? { ...item, qty: action.qty } : item
      );

    case 'CLEAR':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  // Calculate total items in cart
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Calculate total price
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    dispatch
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export const useDispatchCart = () => {
  const { dispatch } = useContext(CartContext);
  return dispatch;
};