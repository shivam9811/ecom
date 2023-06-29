const addToCartButton = document.querySelector("#product-details button");
const badgeElement = document.querySelectorAll(".nav-items .badge");

const addToCart = async () => {
  const productId = addToCartButton.dataset.id;
  let response;
  try {
    response = await fetch("/cart/items", {
      method: "POST",
      body: JSON.stringify({
        productId: productId,
        _csrf: addToCartButton.dataset.csrf,
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
  const newTotalQuantity = responseData.newTotalItems;

  for (let badge of badgeElement) {
    badge.textContent = newTotalQuantity;
  }
};

addToCartButton.addEventListener("click", addToCart);
