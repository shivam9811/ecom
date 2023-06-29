const imgInput = document.querySelector("#image");
const imagePreview = document.querySelector("#image-upload-control img");

const updateImagePreview = () => {
  const files = imgInput.files;
  if (!files || files.length === 0) {
    imagePreview.style.display = "none";
    return;
  }

  const pickedFile = files[0];
  imagePreview.src = URL.createObjectURL(pickedFile);
  imagePreview.style.display = "block";
};

imgInput.addEventListener("change", updateImagePreview);
