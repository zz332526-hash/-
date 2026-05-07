const KEY = 'ORDERING_CART';

function getCart() {
  return wx.getStorageSync(KEY) || [];
}

function setCart(items) {
  wx.setStorageSync(KEY, items);
}

function addToCart(dish) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.dishId === dish.dishId);
  if (idx >= 0) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ ...dish, quantity: 1 });
  }
  setCart(cart);
  return cart;
}

function clearCart() {
  setCart([]);
}

module.exports = { getCart, addToCart, clearCart, setCart };
