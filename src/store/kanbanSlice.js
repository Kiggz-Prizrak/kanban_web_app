import { createSlice } from "@reduxjs/toolkit";

const mock = () => {
  return fetch("http://127.0.0.1:5173/mock/datas.json")
    .then((res) => res.json())
    .then((res) => res)
    .catch((error) => console.log(error));
};

const kanbanSlice = createSlice({
  name: "kanbans",
  initialState: {
    kanbans: mock,
  },
  reducers: {
    // addToCart: (state, action) => {
    //   const itemInCart = state.cart.find(
    //     (item) => item.id === action.payload.id
    //   );
    //   if (itemInCart) {
    //     itemInCart.productQuantity += action.payload.productQuantity;
    //   } else {
    //     state.cart.push({ ...action.payload });
    //   }
    // },
    // incrementQuantity: (state, action) => {
    //   const item = state.cart.find((item) => item.id === action.payload);
    //   item.productQuantity++;
    // },
    // decrementQuantity: (state, action) => {
    //   const item = state.cart.find((item) => item.id === action.payload);
    //   item.productQuantity === 1
    //     ? (item.productQuantity = 1)
    //     : item.productQuantity--;
    // },
    // removeItem: (state, action) => {
    //   const removeItem = state.cart.filter(
    //     (item) => item.id !== action.payload
    //   );
    //   state.cart = removeItem;
    // },
    // clearCart: (state) => {
    //   state.cart.length = 0;
    // },
  },
});

export const kanbanReducer = kanbanSlice.reducer;

export const {
  // addToCart,
  // incrementQuantity,
  // decrementQuantity,
  // removeItem,
  // clearCart,
} = kanbanSlice.actions;
