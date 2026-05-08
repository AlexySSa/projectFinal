document.addEventListener("DOMContentLoaded", async () => {
  const featuredRoot = document.querySelector("#featured-listings");
  const recentRoot = document.querySelector("#recent-listings");
  let vehicles = [];

  function render() {
    const featured = vehicles.filter((vehicle) => vehicle.featured).slice(0, 4);
    const recent = vehicles.slice(0, 4);

    featuredRoot.innerHTML = featured.map((vehicle) => BahnApp.renderListingCard(vehicle)).join("");
    recentRoot.innerHTML = recent.map((vehicle) => BahnApp.renderListingCard(vehicle)).join("");
    BahnApp.attachWishlistHandlers(featuredRoot);
    BahnApp.attachWishlistHandlers(recentRoot);
  }

  try {
    vehicles = await BahnApp.fetchJson("/api/vehicles?sort=featured");
    render();
  } catch (error) {
    BahnApp.showEmptyState(featuredRoot, BahnApp.t("empty_featured"));
    BahnApp.showEmptyState(recentRoot, BahnApp.t("empty_recent"));
  }

  window.addEventListener("bahn:language-change", () => {
    if (vehicles.length) {
      render();
    }
  });
});
