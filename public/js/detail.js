document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const vehicleId = params.get("id") || "veh-320d";
  const title = document.querySelector("#detail-title");
  const price = document.querySelector("#detail-price");
  const location = document.querySelector("#detail-location");
  const mainImage = document.querySelector("#detail-main-image");
  const thumbs = document.querySelector("#detail-thumbs");
  const description = document.querySelector("#detail-description");
  const specs = document.querySelector("#detail-specs");
  const wishlistButton = document.querySelector("#detail-wishlist");
  const contactOwnerButton = document.querySelector("#detail-contact-owner");
  const mailButton = document.querySelector("#detail-mail");
  const phoneButton = document.querySelector("#detail-phone");
  const whatsappButton = document.querySelector("#detail-whatsapp");
  const relatedRoot = document.querySelector("#related-listings");
  let currentVehicle = null;
  let relatedVehicles = [];

  function renderThumbs(gallery) {
    thumbs.innerHTML = gallery
      .map(
        (image, index) => `
          <button type="button" class="${index === 0 ? "is-active" : ""}" data-thumb-src="${image}">
            <img src="${image}" alt="${BahnApp.t("detail_gallery_preview", { index: index + 1 })}">
          </button>
        `
      )
      .join("");

    thumbs.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        mainImage.src = button.dataset.thumbSrc;
        thumbs.querySelectorAll("button").forEach((node) => node.classList.remove("is-active"));
        button.classList.add("is-active");
      });
    });
  }

  function renderVehicle() {
    if (!currentVehicle) {
      return;
    }

    title.textContent = BahnApp.getVehicleText(currentVehicle, "title");
    price.textContent = `${BahnApp.formatPrice(currentVehicle.price)} / ${BahnApp.getPriceUnitLabel(currentVehicle.priceUnit)}`;
    location.textContent = `${BahnApp.t("detail_location_prefix")} ${BahnApp.getVehicleText(currentVehicle, "location")}`;
    mainImage.src = currentVehicle.heroImage;
    mainImage.alt = BahnApp.getVehicleText(currentVehicle, "title");
    description.textContent = BahnApp.getVehicleText(currentVehicle, "description");
    renderThumbs(currentVehicle.gallery.length ? currentVehicle.gallery : [currentVehicle.heroImage]);

    specs.innerHTML = `
      <div><dt>${BahnApp.t("detail_make")}</dt><dd>${currentVehicle.brand}</dd></div>
      <div><dt>${BahnApp.t("detail_model")}</dt><dd>${currentVehicle.model}</dd></div>
      <div><dt>${BahnApp.t("detail_year")}</dt><dd>${currentVehicle.year}</dd></div>
      <div><dt>${BahnApp.t("detail_km")}</dt><dd>${currentVehicle.mileage} km</dd></div>
      <div><dt>${BahnApp.t("detail_visual_condition")}</dt><dd>${BahnApp.translateCondition(currentVehicle.visualCondition)}</dd></div>
      <div><dt>${BahnApp.t("detail_mechanical_condition")}</dt><dd>${BahnApp.translateCondition(currentVehicle.mechanicalCondition)}</dd></div>
    `;

    const activeWish = BahnApp.isWishlisted(currentVehicle.id);
    wishlistButton.classList.toggle("btn--primary", activeWish);
    wishlistButton.classList.toggle("btn--ghost", !activeWish);
    wishlistButton.textContent = activeWish ? BahnApp.t("detail_saved_watchlist") : BahnApp.t("detail_add_watchlist");

    relatedRoot.innerHTML = relatedVehicles
      .filter((candidate) => candidate.id !== currentVehicle.id)
      .slice(0, 4)
      .map((candidate) => BahnApp.renderListingCard(candidate))
      .join("");
    BahnApp.attachWishlistHandlers(relatedRoot);
  }

  try {
    currentVehicle = await BahnApp.fetchJson(`/api/vehicles/${vehicleId}`);
    relatedVehicles = await BahnApp.fetchJson(`/api/vehicles?category=${currentVehicle.categoryKey}&sort=featured`);
    renderVehicle();

    wishlistButton.addEventListener("click", () => {
      const isActive = BahnApp.toggleWishlist(currentVehicle.id);
      wishlistButton.classList.toggle("btn--primary", isActive);
      wishlistButton.classList.toggle("btn--ghost", !isActive);
      wishlistButton.textContent = isActive ? BahnApp.t("detail_saved_watchlist") : BahnApp.t("detail_add_watchlist");
    });

    const openMail = () => {
      window.location.href = `mailto:${currentVehicle.contactEmail}`;
    };

    contactOwnerButton.onclick = openMail;
    contactOwnerButton.textContent = BahnApp.t("detail_contact_owner");
    mailButton.onclick = openMail;
    phoneButton.onclick = () => {
      window.location.href = `tel:${currentVehicle.contactPhone}`;
    };
    whatsappButton.onclick = () => {
      window.location.href = `https://wa.me/${currentVehicle.contactWhatsapp.replace(/\D/g, "")}`;
    };
  } catch (error) {
    document.querySelector("#detail-shell").innerHTML = `<div class="empty-state">${BahnApp.t("empty_detail")}</div>`;
  }

  window.addEventListener("bahn:language-change", renderVehicle);
});
