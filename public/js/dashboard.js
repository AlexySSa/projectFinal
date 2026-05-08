document.addEventListener("DOMContentLoaded", async () => {
  const currentUser =
    BahnApp.getCurrentUser() && BahnApp.getCurrentUser().role === "owner"
      ? BahnApp.getCurrentUser()
      : {
          id: "usr-owner-001",
          name: "Juan Perez",
          email: "owner@bahn.com",
          role: "owner"
        };

  const statsRoot = {
    total: document.querySelector("#stat-total"),
    active: document.querySelector("#stat-active"),
    average: document.querySelector("#stat-average"),
    featured: document.querySelector("#stat-featured")
  };
  const inventoryRoot = document.querySelector("#inventory-list");
  const form = document.querySelector("#vehicle-form");
  const status = document.querySelector("#dashboard-status");
  const formTitle = document.querySelector("#form-title");
  const cancelEdit = document.querySelector("#cancel-edit");
  const ownerName = document.querySelector("#owner-greeting");
  const ownerHint = document.querySelector("#owner-hint");
  const submitButton = document.querySelector("#dashboard-submit");
  let loadedVehicles = [];

  function applyFormLanguage() {
    const placeholders = {
      title: "field_title",
      brand: "field_brand",
      model: "field_model",
      year: "field_year",
      mileage: "field_mileage",
      price: "field_price",
      location: "field_location",
      contactPhone: "field_contact_phone",
      contactWhatsapp: "field_whatsapp",
      thumbnail: "field_thumb_url",
      heroImage: "field_hero_url",
      description: "field_description"
    };

    Object.entries(placeholders).forEach(([name, key]) => {
      const field = form.elements[name];
      if (field) {
        field.placeholder = BahnApp.t(key);
      }
    });

    form.elements.category.options[0].textContent = BahnApp.t("category_heavy");
    form.elements.category.options[1].textContent = BahnApp.t("category_car");
    form.elements.category.options[2].textContent = BahnApp.t("category_motorcycle");
    form.elements.category.options[3].textContent = BahnApp.t("category_agricultural");
    form.elements.priceUnit.options[0].textContent = BahnApp.t("price_unit_day");
    form.elements.priceUnit.options[1].textContent = BahnApp.t("price_unit_week");
    form.elements.priceUnit.options[2].textContent = BahnApp.t("price_unit_hour");
    form.elements.visualCondition.options[0].textContent = BahnApp.t("condition_excellent");
    form.elements.visualCondition.options[1].textContent = BahnApp.t("condition_good");
    form.elements.visualCondition.options[2].textContent = BahnApp.t("condition_regular");
    form.elements.mechanicalCondition.options[0].textContent = BahnApp.t("condition_optimal");
    form.elements.mechanicalCondition.options[1].textContent = BahnApp.t("condition_good");
    form.elements.mechanicalCondition.options[2].textContent = BahnApp.t("condition_requires_review");
    submitButton.textContent = BahnApp.t("button_save");
    cancelEdit.textContent = BahnApp.t("button_cancel_edit");
  }

  ownerName.textContent = currentUser.name;

  function updateOwnerHint() {
    ownerHint.textContent =
      currentUser.id === "usr-owner-001" && !BahnApp.getCurrentUser()
        ? BahnApp.t("dashboard_hint_demo")
        : BahnApp.t("dashboard_hint_owner");
  }

  function formPayloadFromEntries(entries) {
    return {
      title: entries.title,
      titleEs: entries.title,
      titleEn: entries.title,
      brand: entries.brand,
      model: entries.model,
      category: entries.category,
      categoryKey: entries.categoryKey,
      year: entries.year,
      mileage: entries.mileage,
      price: entries.price,
      priceUnit: entries.priceUnit,
      location: entries.location,
      city: entries.location,
      locationEs: entries.location,
      locationEn: entries.location,
      visualCondition: entries.visualCondition,
      mechanicalCondition: entries.mechanicalCondition,
      description: entries.description,
      descriptionEs: entries.description,
      descriptionEn: entries.description,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      contactEmail: currentUser.email || "owner@bahn.com",
      contactPhone: entries.contactPhone,
      contactWhatsapp: entries.contactWhatsapp,
      thumbnail:
        entries.thumbnail ||
        "https://images.unsplash.com/photo-1751054619908-65d27a503ce8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1600",
      heroImage:
        entries.heroImage ||
        entries.thumbnail ||
        "https://images.unsplash.com/photo-1751054619908-65d27a503ce8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=2200",
      gallery: [
        entries.heroImage ||
          entries.thumbnail ||
          "https://images.unsplash.com/photo-1751054619908-65d27a503ce8?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=2200"
      ]
    };
  }

  function resetForm() {
    form.reset();
    form.vehicleId.value = "";
    formTitle.textContent = BahnApp.t("form_create");
    cancelEdit.classList.add("hidden");
    status.textContent = "";
    status.className = "form-status";
  }

  function bindInventoryActions(vehicles) {
    inventoryRoot.querySelectorAll("[data-edit-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const vehicle = vehicles.find((item) => item.id === button.dataset.editId);
        if (!vehicle) {
          return;
        }

        form.vehicleId.value = vehicle.id;
        form.title.value = vehicle.title;
        form.brand.value = vehicle.brand;
        form.model.value = vehicle.model;
        form.category.value = vehicle.category;
        form.categoryKey.value = vehicle.categoryKey;
        form.year.value = vehicle.year;
        form.mileage.value = vehicle.mileage;
        form.price.value = vehicle.price;
        form.priceUnit.value = vehicle.priceUnit;
        form.location.value = vehicle.location;
        form.visualCondition.value = vehicle.visualCondition;
        form.mechanicalCondition.value = vehicle.mechanicalCondition;
        form.contactPhone.value = vehicle.contactPhone;
        form.contactWhatsapp.value = vehicle.contactWhatsapp;
        form.thumbnail.value = vehicle.thumbnail;
        form.heroImage.value = vehicle.heroImage;
        form.description.value = vehicle.description;
        formTitle.textContent = BahnApp.t("form_edit");
        cancelEdit.classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    inventoryRoot.querySelectorAll("[data-delete-id]").forEach((button) => {
      button.addEventListener("click", async () => {
        const confirmed = window.confirm(BahnApp.t("confirm_delete"));
        if (!confirmed) {
          return;
        }

        try {
          await BahnApp.fetchJson(`/api/vehicles/${button.dataset.deleteId}`, {
            method: "DELETE"
          });
          await loadDashboard();
        } catch (error) {
          status.className = "form-status is-error";
          status.textContent = error.message;
        }
      });
    });
  }

  function renderInventory() {
    inventoryRoot.innerHTML = loadedVehicles.length
      ? loadedVehicles
          .map(
            (vehicle) => `
              <article class="inventory-card">
                <div class="inventory-card__thumb">
                  <img src="${vehicle.thumbnail}" alt="${BahnApp.getVehicleText(vehicle, "title")}">
                </div>
                <div>
                  <h3>${BahnApp.getVehicleText(vehicle, "title")}</h3>
                  <p>${vehicle.brand} ${vehicle.model} - ${vehicle.year}</p>
                  <p>${BahnApp.getVehicleText(vehicle, "location")}</p>
                  <p>${BahnApp.formatPrice(vehicle.price)} / ${BahnApp.getPriceUnitLabel(vehicle.priceUnit)}</p>
                </div>
                <div class="inventory-card__actions">
                  <a class="text-button" href="/detail?id=${vehicle.id}">${BahnApp.t("preview")}</a>
                  <button type="button" class="text-button" data-edit-id="${vehicle.id}">${BahnApp.t("edit")}</button>
                  <button type="button" class="text-button text-button--danger" data-delete-id="${vehicle.id}">${BahnApp.t("delete")}</button>
                </div>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state">${BahnApp.t("no_inventory")}</div>`;

    bindInventoryActions(loadedVehicles);
  }

  async function loadDashboard() {
    const [stats, vehicles] = await Promise.all([
      BahnApp.fetchJson(`/api/owner-stats/${currentUser.id}`),
      BahnApp.fetchJson(`/api/vehicles?ownerId=${currentUser.id}&sort=latest`)
    ]);

    loadedVehicles = vehicles;
    statsRoot.total.textContent = stats.totalVehicles;
    statsRoot.active.textContent = stats.activeListings;
    statsRoot.average.textContent = BahnApp.formatPrice(stats.averagePrice);
    statsRoot.featured.textContent = stats.featuredListings;
    renderInventory();
  }

  cancelEdit.addEventListener("click", resetForm);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const entries = Object.fromEntries(new FormData(form).entries());
    const payload = formPayloadFromEntries(entries);
    const vehicleId = entries.vehicleId;

    try {
      status.className = "form-status";
      status.textContent = BahnApp.t("saving");
      await BahnApp.fetchJson(vehicleId ? `/api/vehicles/${vehicleId}` : "/api/vehicles", {
        method: vehicleId ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      status.className = "form-status is-success";
      status.textContent = vehicleId ? BahnApp.t("updated") : BahnApp.t("created");
      resetForm();
      await loadDashboard();
    } catch (error) {
      status.className = "form-status is-error";
      status.textContent = error.message;
    }
  });

  try {
    applyFormLanguage();
    updateOwnerHint();
    resetForm();
    await loadDashboard();
  } catch (error) {
    inventoryRoot.innerHTML = `<div class="empty-state">${BahnApp.t("empty_dashboard")}</div>`;
  }

  window.addEventListener("bahn:language-change", () => {
    applyFormLanguage();
    updateOwnerHint();
    formTitle.textContent = form.vehicleId.value ? BahnApp.t("form_edit") : BahnApp.t("form_create");
    renderInventory();
  });
});
