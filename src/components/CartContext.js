import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      const existingItem = state.find(item => item.id === action.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.id ? { ...item, qty: item.qty + action.qty } : item
        );
      }
      return [...state, { id: action.id, name: action.name, price: action.price, qty: action.qty, size: action.size }];

    case 'REMOVE':
      return state.filter((item, index) => index !== action.index);

    case 'UPDATE':
      return state.map(item =>
        item.id === action.id ? { ...item, qty: action.qty } : item
      );

    case 'DROP':
      return [];

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  return (
    <CartContext.Provider value={{ cartItems, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Export useCart and useDispatchCart
export const useCart = () => useContext(CartContext);
export const useDispatchCart = () => {
  const { dispatch } = useContext(CartContext);
  return dispatch;
};