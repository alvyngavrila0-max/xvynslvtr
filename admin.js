const loginView = document.querySelector("#login-view");
const dashboardView = document.querySelector("#dashboard-view");
const loginForm = document.querySelector("#login-form");
const productForm = document.querySelector("#product-form");
const resetButton = document.querySelector("#reset-btn");
const submitButton = document.querySelector("#submit-btn");
const logoutButton = document.querySelector("#logout-btn");
const refreshButton = document.querySelector("#refresh-btn");
const removeImageButton = document.querySelector("#remove-image-btn");
const saveSliderButton = document.querySelector("#save-slider-btn");
const loginFeedback = document.querySelector("#login-feedback");
const productFeedback = document.querySelector("#product-feedback");
const sliderFeedback = document.querySelector("#slider-feedback");
const productList = document.querySelector("#product-list");
const imagePreview = document.querySelector("#image-preview");
const editorState = document.querySelector("#editor-state");
const sliderImage1File = document.querySelector("#slider-image-1-file");
const sliderImage2File = document.querySelector("#slider-image-2-file");
const sliderImage1Data = document.querySelector("#slider-image-1-data");
const sliderImage2Data = document.querySelector("#slider-image-2-data");
const sliderImage1Preview = document.querySelector("#slider-image-1-preview");
const sliderImage2Preview = document.querySelector("#slider-image-2-preview");
const clearSlider1Button = document.querySelector("#clear-slider-1-btn");
const clearSlider2Button = document.querySelector("#clear-slider-2-btn");

let products = [];
let selectedProductId = "";

function setFeedback(element, message, isError = false) {
  element.textContent = message;
  element.style.color = isError ? "#cf3d3d" : "#1c7c3f";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showDashboard() {
  loginView.hidden = true;
  dashboardView.hidden = false;
}

function showLogin() {
  dashboardView.hidden = true;
  loginView.hidden = false;
}

function resetForm() {
  productForm.reset();
  productForm.elements.id.value = "";
  productForm.elements.imageData.value = "";
  selectedProductId = "";
  submitButton.textContent = "Simpan Produk";
  editorState.textContent = "Mode tambah produk baru.";
  renderImagePreview("");
}

function fillForm(product) {
  selectedProductId = product.id;
  productForm.elements.id.value = product.id;
  productForm.elements.code.value = product.code || "";
  productForm.elements.title.value = product.title || "";
  productForm.elements.price.value = product.price || "";
  productForm.elements.secondaryPrice.value = product.secondaryPrice || "";
  productForm.elements.banner.value = product.banner || "";
  productForm.elements.checkoutLink.value = product.checkoutLink || "";
  productForm.elements.imageData.value = product.imageData || "";
  productForm.elements.description.value = product.description || "";
  submitButton.textContent = "Update Produk";
  editorState.textContent = `Sedang mengedit produk: ${product.title}`;
  renderImagePreview(product.imageData || "");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Gagal membaca file"));
    reader.readAsDataURL(file);
  });
}

function renderImagePreview(imageData) {
  if (!imagePreview) {
    return;
  }

  if (!imageData) {
    imagePreview.innerHTML = '<div class="image-placeholder">Belum ada foto dipilih</div>';
    return;
  }

  imagePreview.innerHTML = `<img src="${escapeHtml(imageData)}" alt="Preview produk">`;
}

function renderBannerPreview(container, imageData, fallbackText) {
  if (!container) {
    return;
  }

  if (!imageData) {
    container.innerHTML = `<div class="image-placeholder">${fallbackText}</div>`;
    return;
  }

  container.innerHTML = `<img src="${escapeHtml(imageData)}" alt="${escapeHtml(fallbackText)}">`;
}

function renderProducts() {
  if (!products.length) {
    productList.innerHTML = "<p>Belum ada produk tersimpan.</p>";
    return;
  }

  productList.innerHTML = products
    .map((product) => `
      <article class="product-item">
        <div class="product-item-top">
          <div class="product-thumb">
            ${product.imageData
              ? `<img src="${escapeHtml(product.imageData)}" alt="${escapeHtml(product.title)}">`
              : `<div class="product-thumb-placeholder">Tanpa Foto</div>`}
          </div>
          <div class="product-item-copy">
            <h4>${escapeHtml(product.title)}</h4>
            <div class="product-meta">
              <span>${escapeHtml(product.code)}</span>
              <span>${escapeHtml(product.price)}</span>
              <span>${escapeHtml(product.secondaryPrice || "-")}</span>
            </div>
            <p>${escapeHtml(product.description || "Tanpa deskripsi.")}</p>
          </div>
        </div>
        <div class="product-actions">
          <button type="button" class="edit-btn" data-edit="${product.id}">Edit</button>
          <button type="button" class="delete-btn" data-delete="${product.id}">Hapus</button>
        </div>
      </article>
    `)
    .join("");
}

async function fetchProducts() {
  const response = await fetch("/api/admin/products", {
    credentials: "include"
  });

  if (response.status === 401) {
    showLogin();
    setFeedback(loginFeedback, "Sesi admin berakhir. Silakan login lagi.", true);
    return;
  }

  products = await response.json();
  renderProducts();
}

async function fetchSliderSettings() {
  const response = await fetch("/api/admin/settings", {
    credentials: "include"
  });

  if (response.status === 401) {
    showLogin();
    setFeedback(loginFeedback, "Sesi admin berakhir. Silakan login lagi.", true);
    return;
  }

  const settings = await response.json();
  sliderImage1Data.value = settings?.sliderImages?.slide1 || "";
  sliderImage2Data.value = settings?.sliderImages?.slide2 || "";
  renderBannerPreview(sliderImage1Preview, sliderImage1Data.value, "Belum ada foto Slide 1");
  renderBannerPreview(sliderImage2Preview, sliderImage2Data.value, "Belum ada foto Slide 2");
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  const response = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      password: formData.get("password")
    })
  });

  if (!response.ok) {
    setFeedback(loginFeedback, "Password admin salah.", true);
    return;
  }

  setFeedback(loginFeedback, "Login berhasil.");
  loginForm.reset();
  showDashboard();
  await fetchProducts();
  await fetchSliderSettings();
});

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(productForm);
  const imageFile = productForm.elements.imageFile.files[0];
  let imageData = formData.get("imageData");

  if (imageFile) {
    try {
      imageData = await readFileAsDataUrl(imageFile);
    } catch (error) {
      setFeedback(productFeedback, "Gagal membaca file gambar.", true);
      return;
    }
  }

  const payload = {
    id: formData.get("id") || selectedProductId || undefined,
    code: formData.get("code"),
    title: formData.get("title"),
    price: formData.get("price"),
    secondaryPrice: formData.get("secondaryPrice"),
    banner: formData.get("banner"),
    checkoutLink: formData.get("checkoutLink"),
    imageData,
    description: formData.get("description")
  };

  const response = await fetch("/api/admin/products", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    setFeedback(productFeedback, "Gagal menyimpan produk.", true);
    return;
  }

  setFeedback(productFeedback, "Produk berhasil disimpan.");
  resetForm();
  await fetchProducts();
});

productList.addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit]");
  const deleteButton = event.target.closest("[data-delete]");

  if (editButton) {
    const product = products.find((item) => item.id === editButton.dataset.edit);
    if (product) {
      fillForm(product);
      setFeedback(productFeedback, `Produk "${product.title}" siap diedit.`);
    }
    return;
  }

  if (deleteButton) {
    const confirmed = window.confirm("Hapus produk ini?");
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/admin/products/${deleteButton.dataset.delete}`, {
      method: "DELETE",
      credentials: "include"
    });

    if (!response.ok) {
      setFeedback(productFeedback, "Gagal menghapus produk.", true);
      return;
    }

    setFeedback(productFeedback, "Produk berhasil dihapus.");
    await fetchProducts();
    resetForm();
  }
});

productForm.elements.imageFile.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    renderImagePreview(productForm.elements.imageData.value);
    return;
  }

  try {
    const imageData = await readFileAsDataUrl(file);
    renderImagePreview(imageData);
  } catch (error) {
    setFeedback(productFeedback, "Gagal membaca file gambar.", true);
  }
});

resetButton.addEventListener("click", resetForm);

removeImageButton.addEventListener("click", () => {
  productForm.elements.imageFile.value = "";
  productForm.elements.imageData.value = "";
  renderImagePreview("");
});

logoutButton.addEventListener("click", async () => {
  await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "include"
  });
  showLogin();
});

refreshButton.addEventListener("click", fetchProducts);

sliderImage1File.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    renderBannerPreview(sliderImage1Preview, sliderImage1Data.value, "Belum ada foto Slide 1");
    return;
  }

  const imageData = await readFileAsDataUrl(file);
  sliderImage1Data.value = imageData;
  renderBannerPreview(sliderImage1Preview, imageData, "Belum ada foto Slide 1");
});

sliderImage2File.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    renderBannerPreview(sliderImage2Preview, sliderImage2Data.value, "Belum ada foto Slide 2");
    return;
  }

  const imageData = await readFileAsDataUrl(file);
  sliderImage2Data.value = imageData;
  renderBannerPreview(sliderImage2Preview, imageData, "Belum ada foto Slide 2");
});

clearSlider1Button.addEventListener("click", () => {
  sliderImage1File.value = "";
  sliderImage1Data.value = "";
  renderBannerPreview(sliderImage1Preview, "", "Belum ada foto Slide 1");
});

clearSlider2Button.addEventListener("click", () => {
  sliderImage2File.value = "";
  sliderImage2Data.value = "";
  renderBannerPreview(sliderImage2Preview, "", "Belum ada foto Slide 2");
});

saveSliderButton.addEventListener("click", async () => {
  const response = await fetch("/api/admin/settings", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sliderImages: {
        slide1: sliderImage1Data.value,
        slide2: sliderImage2Data.value
      }
    })
  });

  if (!response.ok) {
    setFeedback(sliderFeedback, "Gagal menyimpan banner slider.", true);
    return;
  }

  setFeedback(sliderFeedback, "Banner slider berhasil disimpan.");
});

(async function init() {
  const response = await fetch("/api/admin/session", {
    credentials: "include"
  });
  if (response.ok) {
    showDashboard();
    await fetchProducts();
    await fetchSliderSettings();
  } else {
    showLogin();
  }
})();
