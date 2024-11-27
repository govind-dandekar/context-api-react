import { createContext } from 'react';

// template that helps with auto-completion
export const CartContext = createContext({
	items: [],
	addItemToCart: () => {},
});



