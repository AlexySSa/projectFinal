document.addEventListener("DOMContentLoaded", async () => {
  const root = document.querySelector("#wishlist-grid");
  const total = document.querySelector("#wishlist-total");
  let vehicles = [];

  function render() {
    const wishlistIds = BahnApp.getWishlist();
    const saved = vehicles.filter((vehicle) => wishlistIds.includes(vehicle.id));
    total.textContent = BahnApp.t("count_saved", { count: saved.length });
    root.innerHTML = saved.length
      ? saved.map((vehicle) => BahnApp.renderListingCard(vehicle)).join("")
      : `<div class="wishlist-empty">${BahnApp.t("wishlist_empty")}</div>`;
    BahnApp.attachWishlistHandlers(root);
  }

  try {
    vehicles = await BahnApp.fetchJson("/api/vehicles?sort=featured");
    render();
  } catch (error) {
    BahnApp.showEmptyState(root, BahnApp.t("empty_wishlist"));
  }

  window.addEventListener("bahn:language-change", () => {
    if (vehicles.length) {
      render();
    }
  });
});
