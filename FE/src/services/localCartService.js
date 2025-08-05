// Local cart service for non-authenticated users
const LOCAL_CART_KEY = 'localCart';

// Cart item structure: { productOptionId, quantity, name, price, image }

// Get cart from localStorage
export const getLocalCart = () => {
  try {
    const cart = localStorage.getItem(LOCAL_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading local cart:', error);
    return [];
  }
};

// Save cart to localStorage
export const saveLocalCart = (cart) => {
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
    // Emit custom event to notify other components
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  } catch (error) {
    console.error('Error saving local cart:', error);
  }
};

// Add product to local cart
export const addToLocalCart = (product) => {
  const cart = getLocalCart();
  const existingItem = cart.find(item => item.productOptionId === product.productOptionId);
  
  if (existingItem) {
    // Update quantity if product already exists
    existingItem.quantity += product.quantity;
  } else {
    // Add new product
    cart.push({
      productOptionId: product.productOptionId,
      quantity: product.quantity,
      name: product.name,
      price: product.price,
      image: product.image || 'https://placehold.co/80x80'
    });
  }
  
  saveLocalCart(cart);
  return cart;
};

// Update product quantity in local cart
export const updateLocalCartQuantity = (productOptionId, quantity) => {
  const cart = getLocalCart();
  const item = cart.find(item => item.productOptionId === productOptionId);
  
  if (item) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      return removeFromLocalCart(productOptionId);
    }
    item.quantity = quantity;
    saveLocalCart(cart);
  }
  
  return cart;
};

// Remove product from local cart
export const removeFromLocalCart = (productOptionId) => {
  const cart = getLocalCart();
  const updatedCart = cart.filter(item => item.productOptionId !== productOptionId);
  saveLocalCart(updatedCart);
  return updatedCart;
};

// Clear local cart
export const clearLocalCart = () => {
  localStorage.removeItem(LOCAL_CART_KEY);
  return [];
};

// Get total price of local cart
export const getLocalCartTotal = () => {
  const cart = getLocalCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Get total items count in local cart
export const getLocalCartItemCount = () => {
  const cart = getLocalCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!(localStorage.getItem('userId') && localStorage.getItem('token'));
};

// Get user role from localStorage
export const getUserRole = () => {
  return localStorage.getItem('role');
};

// Check if user is admin
export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};

// Check if user is customer
export const isCustomer = () => {
  return getUserRole() === 'USER';
};

// Migrate local cart to server cart (when user logs in)
export const migrateLocalCartToServer = async (userId, cartService) => {
  const localCart = getLocalCart();
  
  if (localCart.length === 0) return;
  
  try {
    // Add all local cart items to server cart
    for (const item of localCart) {
      await cartService.addProductToCart(userId, {
        productOptionId: item.productOptionId,
        quantity: item.quantity
      });
    }
    
    // Clear local cart after successful migration
    clearLocalCart();
  } catch (error) {
    console.error('Error migrating local cart to server:', error);
    throw error;
  }
}; 