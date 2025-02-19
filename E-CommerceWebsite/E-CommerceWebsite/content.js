document.addEventListener("DOMContentLoaded", function () {
  console.clear();

  let contentTitle = [];

  // Function to create dynamic sections for each product
  function dynamicClothingSection(ob) {
    const boxDiv = document.createElement("div");
    boxDiv.id = "box";

    const boxLink = document.createElement("a");
    boxLink.href = "/contentDetails.html?" + ob.id;

    const imgTag = document.createElement("img");
    imgTag.src = ob.preview;

    const detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    const h3 = document.createElement("h3");
    h3.textContent = ob.name;

    const h4 = document.createElement("h4");
    h4.textContent = ob.brand;

    const h2 = document.createElement("h2");
    h2.textContent = "Rs " + ob.price;

    detailsDiv.append(h3, h4, h2);
    boxLink.append(imgTag, detailsDiv);
    boxDiv.appendChild(boxLink);

    return boxDiv;
  }

  // Main containers for clothing and accessories
  const containerClothing = document.getElementById("containerClothing");
  const containerAccessories = document.getElementById("containerAccessories");

  // Function to render filtered products
  function renderFilteredProducts() {
    if (!containerClothing || !containerAccessories) {
      console.error("Main containers not found");
      return;
    }

    containerClothing.innerHTML = "";
    containerAccessories.innerHTML = "";

    const categoryFilter = document.getElementById("categoryFilter");
    const priceFilter = document.getElementById("priceFilter");
    const nameSearch = document.getElementById("nameSearch");
    const clothingtitle = document.getElementById("clothingTitle");
    const accessoriestitle = document.getElementById("accessoriesTitle");

    if (categoryFilter.value === "clothing") {
      clothingtitle.style.display = "block";
      accessoriestitle.style.display = "none";
    } else if (categoryFilter.value === "accessories") {
      clothingtitle.style.display = "none";
      accessoriestitle.style.display = "block";
    } else {
      clothingtitle.style.display = "block";
      accessoriestitle.style.display = "block";
    }
    // Verify filters exist before accessing their values
    if (!categoryFilter || !priceFilter || !nameSearch) {
      console.error("Filter elements not found");
      return;
    }

    const selectedCategory = categoryFilter.value;
    const maxPrice = priceFilter.value;
    const searchQuery = nameSearch.value.toLowerCase();

    contentTitle.forEach((item) => {
      const isClothing = !item.isAccessory;
      const inCategory =
        selectedCategory === "all" ||
        (selectedCategory === "clothing" && isClothing) ||
        (selectedCategory === "accessories" && item.isAccessory);

      const inPriceRange = !maxPrice || item.price <= maxPrice;
      const matchesName = item.name.toLowerCase().includes(searchQuery);

      if (inCategory && inPriceRange && matchesName) {
        const productSection = dynamicClothingSection(item);
        (item.isAccessory
          ? containerAccessories
          : containerClothing
        ).appendChild(productSection);
      }
    });
  }

  // Fetch product data and initialize filters
  fetch("https://5d76bf96515d1a0014085cf9.mockapi.io/product")
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then((data) => {
      contentTitle = data;
      renderFilteredProducts();
    })
    .catch((error) => console.error("Fetching data failed:", error));

  // Verify existence of each filter element and add event listeners
  const categoryFilter = document.getElementById("categoryFilter");
  const priceFilter = document.getElementById("priceFilter");
  const nameSearch = document.getElementById("nameSearch");

  if (categoryFilter && priceFilter && nameSearch) {
    categoryFilter.addEventListener("change", renderFilteredProducts);
    priceFilter.addEventListener("input", renderFilteredProducts);
    nameSearch.addEventListener("input", renderFilteredProducts);
  } else {
    console.error("One or more filter elements are missing.");
  }
});
