const cartTotalPriceElement = document.querySelector("#cart-total-price");
const cartBadges = document.querySelectorAll(".nav-items .badge");
const updateForms = document.querySelectorAll(".cart-item-management");

async function updateCartItem(event) {
  event.preventDefault();
  const form = event.target;
  const productId = form.dataset.id;
  const csrf = form.dataset.csrf;
  const quantity = +form.firstElementChild.value;
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "PATCH",
      body: JSON.stringify({
        id: productId,
        quantity: quantity,
        _csrf: csrf,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("Something went wrong");
  }

  if (!response.ok) {
    alert("Something went wrong");
    return;
  }

  const responseData = await response.json();

  if (responseData.updatedCartData.updatedItemPrice === 0) {
    form.parentElement.parentElement.remove();
  } else {
    const cartItemTotalPriceElement =
      form.parentElement.querySelector(".cart-item-price");
    cartItemTotalPriceElement.textContent =
      responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent =
    responseData.updatedCartData.newTotalPrice.toFixed(2);

  for (let cartBadge of cartBadges) {
    cartBadge.textContent = responseData.updatedCartData.newTotalQuantity;
  }
}

for (const form of updateForms) {
  form.addEventListener("submit", updateCartItem);
}
