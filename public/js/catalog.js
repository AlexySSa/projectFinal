document.addEventListener("DOMContentLoaded", async () => {
  const listRoot = document.querySelector("#catalog-list");
  const countNode = document.querySelector("#catalog-count");
  const makeSelect = document.querySelector("#make-filter");
  const modelSelect = document.querySelector("#model-filter");
  const locationSelect = document.querySelector("#location-filter");
  const priceRange = document.querySelector("#price-filter");
  const priceValue = document.querySelector("#price-value");
  const priceMin = document.querySelector("#price-min");
  const conditionSelect = document.querySelector("#condition-filter");
  const searchInput = document.querySelector("#catalog-search");
  const searchLocation = document.querySelector("#catalog-location");
  const sortButtons = Array.from(document.querySelectorAll("[data-sort]"));
  const categoryRadios = Array.from(document.querySelectorAll("[name='category']"));
  const url = new URL(window.location.href);
  const queryCategory = url.searchParams.get("category") || "";
  const querySearch = url.searchParams.get("q") || "";
  const queryLocation = url.searchParams.get("location") || "";
  let sortMode = "featured";
  let vehicles = [];

  function buildSelectOptions(select, items, defaultLabelKey) {
    const currentValue = select.value;
    select.innerHTML = `<option value="">${BahnApp.t(defaultLabelKey)}</option>${items
      .map((item) => `<option value="${item}">${item}</option>`)
      .join("")}`;
    select.value = items.includes(currentValue) ? currentValue : "";
  }

  function populateFilters() {
    const brands = [...new Set(vehicles.map((vehicle) => vehicle.brand))].sort();
    const models = [...new Set(vehicles.map((vehicle) => vehicle.model))].sort();
    const locations = [...new Set(vehicles.map((vehicle) => vehicle.city))].sort();
    const maxVehiclePrice = Math.max(...vehicles.map((vehicle) => vehicle.price));
    const minVehiclePrice = Math.min(...vehicles.map((vehicle) => vehicle.price));
    const roundedMax = Math.ceil(maxVehiclePrice / 10) * 10;
    const roundedMin = Math.max(0, Math.floor(minVehiclePrice / 10) * 10);

    buildSelectOptions(makeSelect, brands, "filter_make");
    buildSelectOptions(modelSelect, models, "filter_model");
    buildSelectOptions(locationSelect, locations, "filter_location");

    priceRange.min = String(roundedMin);
    priceRange.max = String(roundedMax);
    if (!priceRange.value || Number(priceRange.value) > roundedMax) {
      priceRange.value = String(roundedMax);
    }

    priceMin.textContent = BahnApp.formatPrice(roundedMin);
  }

  function updatePriceCaption() {
    priceValue.textContent = BahnApp.t("up_to_price", {
      price: BahnApp.formatPrice(priceRange.value)
    });
  }

  function applyFilters() {
    const selectedCategory = categoryRadios.find((radio) => radio.checked)?.value || "";
    const selectedMake = makeSelect.value;
    const selectedModel = modelSelect.value;
    const selectedLocation = locationSelect.value;
    const selectedCondition = conditionSelect.value;
    const maxPrice = Number(priceRange.value);
    const term = searchInput.value.trim().toLowerCase();
    const searchCity = searchLocation.value.trim().toLowerCase();

    let filtered = vehicles.filter((vehicle) => {
      const title = BahnApp.getVehicleText(vehicle, "title").toLowerCase();
      const description = BahnApp.getVehicleText(vehicle, "description").toLowerCase();
      const location = BahnApp.getVehicleText(vehicle, "location").toLowerCase();

      if (selectedCategory && vehicle.categoryKey !== selectedCategory) {
        return false;
      }
      if (selectedMake && vehicle.brand !== selectedMake) {
        return false;
      }
      if (selectedModel && vehicle.model !== selectedModel) {
        return false;
      }
      if (selectedLocation && vehicle.city !== selectedLocation) {
        return false;
      }
      if (selectedCondition) {
        const conditionBlob = `${vehicle.visualCondition} ${vehicle.mechanicalCondition}`.toLowerCase();
        if (!conditionBlob.includes(selectedCondition.toLowerCase())) {
          return false;
        }
      }
      if (vehicle.price > maxPrice) {
        return false;
      }
      if (searchCity && !location.includes(searchCity)) {
        return false;
      }
      if (!term) {
        return true;
      }

      const haystack = `${title} ${vehicle.brand} ${vehicle.model} ${location} ${description}`.toLowerCase();
      return haystack.includes(term);
    });

    if (sortMode === "price") {
      filtered = filtered.slice().sort((left, right) => left.price - right.price);
    } else if (sortMode === "date") {
      filtered = filtered.slice().sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt));
    }

    countNode.textContent = BahnApp.t("count_listings", { count: filtered.length });
    listRoot.innerHTML = filtered.map((vehicle) => BahnApp.renderListingCard(vehicle)).join("");
    BahnApp.attachWishlistHandlers(listRoot);

    if (!filtered.length) {
      BahnApp.showEmptyState(listRoot, BahnApp.t("no_results"));
    }
  }

  function bindFilterEvents() {
    [makeSelect, modelSelect, locationSelect, priceRange, conditionSelect, searchInput, searchLocation].forEach((input) => {
      input.addEventListener("input", () => {
        updatePriceCaption();
        applyFilters();
      });
      input.addEventListener("change", applyFilters);
    });

    categoryRadios.forEach((radio) => radio.addEventListener("change", applyFilters));
    sortButtons.forEach((button) => {
      button.addEventListener("click", () => {
        sortMode = button.dataset.sort;
        sortButtons.forEach((candidate) => candidate.classList.toggle("is-active", candidate === button));
        applyFilters();
      });
    });
  }

  try {
    vehicles = await BahnApp.fetchJson("/api/vehicles?sort=featured");
    populateFilters();
    bindFilterEvents();
    searchInput.value = querySearch;
    searchLocation.value = queryLocation;
    if (queryCategory) {
      const targetRadio = categoryRadios.find((radio) => radio.value === queryCategory);
      if (targetRadio) {
        targetRadio.checked = true;
      }
    }
    updatePriceCaption();
    applyFilters();
  } catch (error) {
    BahnApp.showEmptyState(listRoot, BahnApp.t("empty_catalog"));
  }

  window.addEventListener("bahn:language-change", () => {
    if (!vehicles.length) {
      return;
    }
    populateFilters();
    updatePriceCaption();
    applyFilters();
  });
});
