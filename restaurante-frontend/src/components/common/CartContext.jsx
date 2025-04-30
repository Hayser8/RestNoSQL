"use client";

import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const initialState = {
  items: [],           // [{ id, name, price, quantity, image }]
  promoCode: "",
  promoApplied: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "INITIALIZE":
      return { ...state, items: action.payload };
    case "ADD_ITEM":
      {
        const exists = state.items.find(i => i.id === action.payload.id);
        const items = exists
          ? state.items.map(i => i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
            )
          : [...state.items, action.payload];
        return { ...state, items };
      }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    case "UPDATE_QTY":
      {
        const { id, delta } = action.payload;
        const items = state.items.map(i =>
          i.id === id
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i
        );
        return { ...state, items };
      }
    case "APPLY_PROMO":
      return { ...state, promoApplied: true };
    case "SET_PROMO_CODE":
      return { ...state, promoCode: action.payload };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Persistir en localStorage
  useEffect(() => {
    const data = localStorage.getItem("cart");
    if (data) dispatch({ type: "INITIALIZE", payload: JSON.parse(data) });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = item =>
    dispatch({ type: "ADD_ITEM", payload: { ...item, quantity: item.quantity || 1 } });
  const removeItem = id =>
    dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, delta) =>
    dispatch({ type: "UPDATE_QTY", payload: { id, delta } });
  const applyPromo = () =>
    dispatch({ type: "APPLY_PROMO" });
  const setPromoCode = code =>
    dispatch({ type: "SET_PROMO_CODE", payload: code });
  const clearCart = () =>
    dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        promoCode: state.promoCode,
        promoApplied: state.promoApplied,
        addItem,
        removeItem,
        updateQuantity,
        applyPromo,
        setPromoCode,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de un CartProvider");
  return ctx;
}
