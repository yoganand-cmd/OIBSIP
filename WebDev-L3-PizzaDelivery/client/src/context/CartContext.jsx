import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Clear the in-memory cart whenever logout occurs.
  useEffect(() => {
    const handleLogout = () => {
      setCartItems([]);
    };

    window.addEventListener("user-logged-out", handleLogout);

    return () => {
      window.removeEventListener("user-logged-out", handleLogout);
    };
  }, []);

  // Add a pizza with optional customizations.
  const addToCart = (pizza, customizations = {}) => {
    const size = customizations.size || "Regular";
    const crust = customizations.crust || "Classic";
    const cheese = customizations.cheese || "Regular";

    const toppings = Array.isArray(customizations.toppings)
      ? [...customizations.toppings].sort()
      : [];

    const unitPrice =
      customizations.unitPrice !== undefined
        ? Number(customizations.unitPrice)
        : Number(pizza.price);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      console.error("Invalid pizza price:", unitPrice);
      return;
    }

    const cartKey = JSON.stringify({
      pizzaId: pizza._id,
      size,
      crust,
      cheese,
      toppings,
    });

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.cartKey === cartKey
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...pizza,
          ...customizations,
          size,
          crust,
          cheese,
          toppings,
          price: unitPrice,
          quantity: 1,
          cartKey,
        },
      ];
    });
  };

  // Decrease one specific cart item's quantity.
  const decreaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          const matches = item.cartKey
            ? item.cartKey === itemId
            : item._id === itemId;

          return matches
            ? { ...item, quantity: item.quantity - 1 }
            : item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove a specific configuration or legacy pizza ID.
  const removeFromCart = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => {
        if (item.cartKey) {
          return item.cartKey !== itemId && item._id !== itemId;
        }

        return item._id !== itemId;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}