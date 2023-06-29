const deleteProductElements = document.querySelectorAll(".product-item button");

for (const deleteButtonElement of deleteProductElements) {
  deleteButtonElement.addEventListener("click", async (event) => {
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productid;
    const csrf = buttonElement.dataset.csrf;
    const response = await fetch(
      "/admin/products/" + productId + "?_csrf=" + csrf,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      alert("Something went wrong");
      return;
    }
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
  });
}
