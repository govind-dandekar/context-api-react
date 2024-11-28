import { createContext, useReducer } from 'react';

import { DUMMY_PRODUCTS } from '../dummy-products';

// template that helps with auto-completion
export const CartContext = createContext({
	items: [],
	addItemToCart: () => {},
	updateCartItemQuantity: () => {}
});

// should not be recreated when component renders
// doesn't need access to any components fx values or props
// will be called when action is dispatched to fx
// state = guaranteed latest state snapshot
// advantage of reducer: always get latest state automatically
function shoppingCartReducer(state, action){
	if (action.type === 'ADD_ITEM'){

			const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
				// update state set items to updated items
        ...state,
				items: updatedItems,
      };
	}

	if (action.type == "UPDATE_ITEM"){
      const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
				...state,
        items: updatedItems,
      };
    ;
	}

	// return updated state
	return state;
}

function CartContextProvider({children}){
	// gives array with two elements like useState
	// connect reducer fx to useReducer hook
  // pass initial state for reducer {items: []})
	const [ shoppingCartState , shoppingCartDispatch ] = 
		useReducer(shoppingCartReducer, 
		{
			items: []
		}
	);
	
  function handleAddItemToCart(id) {
		// action can be anything but is usually an object
		// with type and payload
		// obj passed to dispatch is named 'action'
		shoppingCartDispatch({
			type: 'ADD_ITEM',
			payload: id
		})
	}

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
			type: 'UPDATE_ITEM',
			payload: {
				productId: productId,
				amount: amount
			}
		})
  }

  // set relevant state and functions as object attributes
  const ctxValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateCartItemQuantity: handleUpdateCartItemQuantity
  };

	return (
		<CartContext.Provider value={ctxValue}>
			{children}
		</CartContext.Provider>
	)
}

export default CartContextProvider;



