(function () {
  const translations = {
    es: {
      app_title: "Bahn | Renta de vehiculos",
      nav_post_vehicle: "Publicar vehiculo",
      nav_login_register: "Entrar / Registro",
      nav_dashboard: "Panel",
      nav_catalog: "Catalogo",
      nav_logout: "Cerrar sesion",
      guest_menu: "Usuario / Menu",
      guest_state: "Invitado",
      role_owner: "Arrendador",
      role_client: "Cliente",
      language_toggle: "Cambiar a ingles",
      language_es: "ES",
      language_en: "EN",
      search_placeholder_home: "Que vehiculo o maquinaria necesitas?",
      search_placeholder_compact: "Busca por vehiculo, marca o modelo",
      search_placeholder_location: "Ubicacion, ciudad o direccion",
      search_button: "Buscar",
      home_title: "Bahn | Renta de vehiculos",
      home_subtitle: "Autos, motos y maquinaria en una sola plataforma",
      category_car: "Carros",
      category_motorcycle: "Motocicletas",
      category_heavy: "Maquinaria pesada",
      category_agricultural: "Agricola",
      featured_listings: "Publicaciones destacadas",
      explore_catalog: "Explorar catalogo",
      recently_added: "Recien agregados",
      recent_desc: "Vehiculos activos con contacto directo y filtros rapidos.",
      open_wishlist: "Ver favoritos",
      info_search_title: "Busca en segundos",
      info_search_desc: "Filtra por marca, modelo, ciudad, precio y condicion desde un mismo catalogo.",
      info_contact_title: "Contacto directo",
      info_contact_desc: "Sin pagos dentro de la plataforma. Aqui conectas con el arrendador rapido.",
      info_dashboard_title: "Panel de inventario",
      info_dashboard_desc: "Los arrendadores publican, editan y eliminan vehiculos desde su panel.",
      filters_title: "Filtros",
      filter_category: "Categoria",
      category_all: "Todos",
      filter_make: "Marca",
      filter_model: "Modelo",
      filter_price: "Rango de precio",
      filter_location: "Ubicacion",
      filter_condition: "Condicion",
      filter_any: "Cualquiera",
      condition_excellent: "Excelente",
      condition_good: "Bueno",
      condition_regular: "Regular",
      condition_optimal: "Optimo",
      condition_requires_review: "Requiere revision",
      toolbar_title: "Resultados disponibles",
      sort_by: "Ordenar por:",
      sort_featured: "Destacados",
      sort_price: "Precio",
      sort_date: "Fecha",
      auth_scene_title: "Conecta",
      auth_scene_subtitle: "Conecta con vehiculos, motos y maquinaria real",
      auth_login: "Entrar",
      auth_register: "Registrarse",
      auth_create_account: "Crear cuenta",
      auth_welcome_back: "Bienvenido de nuevo",
      auth_desc_login: "Ingresa con tu correo y contrasena para volver al catalogo o a tu panel.",
      auth_desc_register: "Crea tu cuenta y elige si quieres publicar vehiculos o explorar el catalogo.",
      auth_full_name: "Nombre completo",
      auth_email: "Correo electronico",
      auth_password: "Contrasena",
      auth_phone: "Numero de telefono",
      auth_select_role: "Selecciona tu rol",
      auth_submit_login: "Entrar",
      auth_submit_register: "Crear cuenta",
      auth_demo_owner: "Demo arrendador",
      auth_demo_client: "Demo cliente",
      auth_processing: "Procesando...",
      auth_login_success: "Sesion iniciada. Redirigiendo...",
      auth_register_success: "Cuenta creada. Redirigiendo...",
      auth_show_password: "Mostrar",
      auth_hide_password: "Ocultar",
      wishlist_title: "Favoritos",
      wishlist_empty: 'Tu lista esta vacia. Explora el <a class="link-arrow" href="/catalog">catalogo</a> y guarda tus favoritos.',
      detail_add_watchlist: "Agregar a favoritos",
      detail_saved_watchlist: "Guardado en favoritos",
      detail_contact_owner: "Contactar arrendador",
      detail_specs: "Especificaciones",
      detail_description: "Descripcion",
      detail_map: "Mapa",
      detail_related: "Vehiculos relacionados",
      detail_related_desc: "Otras unidades parecidas que tambien estan disponibles.",
      detail_make: "Marca",
      detail_model: "Modelo",
      detail_year: "Anio",
      detail_km: "Kilometraje",
      detail_visual_condition: "Estado visual",
      detail_mechanical_condition: "Estado mecanico",
      detail_location_prefix: "Ubicacion:",
      dashboard_badge: "Panel del arrendador",
      dashboard_hello: "Hola,",
      dashboard_hint_demo: "Vista cargada con el demo del arrendador para que puedas probar el CRUD.",
      dashboard_hint_owner: "Administra tu inventario, actualiza precios y publica nuevas unidades.",
      dashboard_open_catalog: "Abrir catalogo",
      stat_total: "Total de vehiculos",
      stat_active: "Publicaciones activas",
      stat_average: "Precio promedio",
      stat_featured: "Destacados",
      form_create: "Crear publicacion",
      form_edit: "Editar publicacion",
      field_title: "Titulo de la publicacion",
      field_brand: "Marca",
      field_model: "Modelo",
      field_year: "Anio",
      field_mileage: "Kilometraje",
      field_price: "Precio",
      field_category: "Categoria",
      field_price_unit: "Unidad de precio",
      field_location: "Ubicacion",
      field_visual_condition: "Estado visual",
      field_mechanical_condition: "Estado mecanico",
      field_contact_phone: "Telefono de contacto",
      field_whatsapp: "WhatsApp",
      field_thumb_url: "URL de miniatura (opcional)",
      field_hero_url: "URL de portada (opcional)",
      field_description: "Descripcion",
      button_save: "Guardar publicacion",
      button_cancel_edit: "Cancelar edicion",
      inventory_title: "Inventario",
      preview: "Vista previa",
      edit: "Editar",
      delete: "Eliminar",
      confirm_delete: "Quieres eliminar esta publicacion?",
      saving: "Guardando publicacion...",
      created: "Publicacion creada.",
      updated: "Publicacion actualizada.",
      no_inventory: "Aun no tienes publicaciones activas.",
      count_listings: "{count} publicaciones",
      count_saved: "{count} guardados",
      up_to_price: "Hasta {price}",
      card_view: "Ver",
      wishlist_toggle: "Guardar en favoritos",
      empty_featured: "No pudimos cargar los destacados por ahora.",
      empty_recent: "No pudimos cargar las publicaciones recientes.",
      empty_catalog: "No pudimos cargar el catalogo.",
      no_results: "No encontramos resultados con esos filtros.",
      empty_detail: "No pudimos cargar este vehiculo.",
      empty_wishlist: "No pudimos cargar tu lista de favoritos.",
      empty_dashboard: "No pudimos cargar el panel.",
      price_unit_day: "dia",
      price_unit_week: "semana",
      price_unit_hour: "hora",
      card_location_separator: " - ",
      detail_gallery_preview: "Vista {index}"
    },
    en: {
      app_title: "Bahn | Vehicle Rentals",
      nav_post_vehicle: "Post your vehicle",
      nav_login_register: "Login / Register",
      nav_dashboard: "Dashboard",
      nav_catalog: "Catalog",
      nav_logout: "Logout",
      guest_menu: "User / Menu",
      guest_state: "Guest",
      role_owner: "Owner",
      role_client: "Client",
      language_toggle: "Switch to Spanish",
      language_es: "ES",
      language_en: "EN",
      search_placeholder_home: "What vehicle or machinery do you need?",
      search_placeholder_compact: "Search by vehicle, brand or model",
      search_placeholder_location: "Location, city or address",
      search_button: "Search",
      home_title: "Bahn | Vehicle Rentals",
      home_subtitle: "Cars, motorcycles and machinery in one platform",
      category_car: "Cars",
      category_motorcycle: "Motorcycles",
      category_heavy: "Heavy machinery",
      category_agricultural: "Agricultural",
      featured_listings: "Featured listings",
      explore_catalog: "Explore catalog",
      recently_added: "Recently added",
      recent_desc: "Active vehicles with direct owner contact and fast filters.",
      open_wishlist: "Open wishlist",
      info_search_title: "Search in seconds",
      info_search_desc: "Filter by brand, model, city, price and condition from one catalog.",
      info_contact_title: "Direct contact",
      info_contact_desc: "No payments inside the platform. Connect with the owner faster.",
      info_dashboard_title: "Inventory dashboard",
      info_dashboard_desc: "Owners can publish, edit and remove vehicles from one panel.",
      filters_title: "Filters",
      filter_category: "Category",
      category_all: "All",
      filter_make: "Brand",
      filter_model: "Model",
      filter_price: "Price range",
      filter_location: "Location",
      filter_condition: "Condition",
      filter_any: "Any",
      condition_excellent: "Excellent",
      condition_good: "Good",
      condition_regular: "Regular",
      condition_optimal: "Optimal",
      condition_requires_review: "Needs review",
      toolbar_title: "Available results",
      sort_by: "Sort by:",
      sort_featured: "Featured",
      sort_price: "Price",
      sort_date: "Date",
      auth_scene_title: "Connect",
      auth_scene_subtitle: "Connect with real vehicles, motorcycles and machinery",
      auth_login: "Login",
      auth_register: "Register",
      auth_create_account: "Create account",
      auth_welcome_back: "Welcome back",
      auth_desc_login: "Sign in with your email and password to return to the catalog or your dashboard.",
      auth_desc_register: "Create your account and choose whether you want to publish vehicles or browse the catalog.",
      auth_full_name: "Full name",
      auth_email: "Email address",
      auth_password: "Password",
      auth_phone: "Phone number",
      auth_select_role: "Select your role",
      auth_submit_login: "Login",
      auth_submit_register: "Create account",
      auth_demo_owner: "Demo owner",
      auth_demo_client: "Demo client",
      auth_processing: "Processing...",
      auth_login_success: "Session started. Redirecting...",
      auth_register_success: "Account created. Redirecting...",
      auth_show_password: "Show",
      auth_hide_password: "Hide",
      wishlist_title: "Wishlist",
      wishlist_empty: 'Your list is empty. Explore the <a class="link-arrow" href="/catalog">catalog</a> and save your favorites.',
      detail_add_watchlist: "Add to wishlist",
      detail_saved_watchlist: "Saved to wishlist",
      detail_contact_owner: "Contact owner",
      detail_specs: "Vehicle specs",
      detail_description: "Description",
      detail_map: "Map",
      detail_related: "Related vehicles",
      detail_related_desc: "Other similar units that are also available.",
      detail_make: "Brand",
      detail_model: "Model",
      detail_year: "Year",
      detail_km: "Mileage",
      detail_visual_condition: "Visual condition",
      detail_mechanical_condition: "Mechanical condition",
      detail_location_prefix: "Location:",
      dashboard_badge: "Owner console",
      dashboard_hello: "Hello,",
      dashboard_hint_demo: "This view is loaded with the owner demo so you can test the CRUD flow.",
      dashboard_hint_owner: "Manage your inventory, update prices and publish new units.",
      dashboard_open_catalog: "Open catalog",
      stat_total: "Total vehicles",
      stat_active: "Active listings",
      stat_average: "Average price",
      stat_featured: "Featured",
      form_create: "Create listing",
      form_edit: "Edit listing",
      field_title: "Listing title",
      field_brand: "Brand",
      field_model: "Model",
      field_year: "Year",
      field_mileage: "Mileage",
      field_price: "Price",
      field_category: "Category",
      field_price_unit: "Price unit",
      field_location: "Location",
      field_visual_condition: "Visual condition",
      field_mechanical_condition: "Mechanical condition",
      field_contact_phone: "Contact phone",
      field_whatsapp: "WhatsApp",
      field_thumb_url: "Thumbnail URL (optional)",
      field_hero_url: "Hero image URL (optional)",
      field_description: "Description",
      button_save: "Save listing",
      button_cancel_edit: "Cancel edit",
      inventory_title: "Inventory",
      preview: "Preview",
      edit: "Edit",
      delete: "Delete",
      confirm_delete: "Do you want to delete this listing?",
      saving: "Saving listing...",
      created: "Listing created.",
      updated: "Listing updated.",
      no_inventory: "You do not have active listings yet.",
      count_listings: "{count} listings",
      count_saved: "{count} saved items",
      up_to_price: "Up to {price}",
      card_view: "View",
      wishlist_toggle: "Save to wishlist",
      empty_featured: "We could not load featured listings right now.",
      empty_recent: "We could not load recent listings right now.",
      empty_catalog: "We could not load the catalog.",
      no_results: "We could not find results with those filters.",
      empty_detail: "We could not load this vehicle.",
      empty_wishlist: "We could not load your wishlist.",
      empty_dashboard: "We could not load the dashboard.",
      price_unit_day: "day",
      price_unit_week: "week",
      price_unit_hour: "hour",
      card_location_separator: " - ",
      detail_gallery_preview: "Preview {index}"
    }
  };

  function getLanguage() {
    return localStorage.getItem("bahn-language") === "en" ? "en" : "es";
  }

  function replaceVars(template, vars = {}) {
    return String(template).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
  }

  function t(key, vars = {}) {
    const language = getLanguage();
    const dictionary = translations[language] || translations.es;
    const fallback = translations.es[key] || key;
    return replaceVars(dictionary[key] || fallback, vars);
  }

  function setDocumentTitle() {
    const titleKey = document.body?.dataset.pageTitle || "app_title";
    document.title = t(titleKey);
    document.documentElement.lang = getLanguage();
  }

  function renderLanguageSlots() {
    const language = getLanguage();
    document.querySelectorAll("[data-language-slot]").forEach((slot) => {
      slot.innerHTML = `
        <button
          type="button"
          class="lang-switch ${language === "en" ? "is-english" : ""}"
          data-language-toggle
          aria-label="${t("language_toggle")}"
        >
          <span class="lang-switch__track">
            <span class="lang-switch__thumb"></span>
            <span class="lang-switch__label lang-switch__label--es">${t("language_es")}</span>
            <span class="lang-switch__label lang-switch__label--en">${t("language_en")}</span>
          </span>
        </button>
      `;
    });
  }

  function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t(node.dataset.i18n);
    });

    root.querySelectorAll("[data-i18n-html]").forEach((node) => {
      node.innerHTML = t(node.dataset.i18nHtml);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
      node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
    });
  }

  function setLanguage(language, { skipEvent = false } = {}) {
    localStorage.setItem("bahn-language", language === "en" ? "en" : "es");
    renderLanguageSlots();
    applyTranslations();
    setDocumentTitle();
    hydrateChrome();
    attachLanguageToggle();

    if (!skipEvent) {
      window.dispatchEvent(
        new CustomEvent("bahn:language-change", {
          detail: { language: getLanguage() }
        })
      );
    }
  }

  function attachLanguageToggle() {
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const nextLanguage = getLanguage() === "es" ? "en" : "es";
        document.body.classList.add("page-is-translating");
        window.setTimeout(() => {
          setLanguage(nextLanguage);
          window.setTimeout(() => {
            document.body.classList.remove("page-is-translating");
          }, 220);
        }, 120);
      });
    });
  }

  function fetchJson(url, options = {}) {
    const requestOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    };

    return fetch(url, requestOptions).then(async (response) => {
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Unexpected request error");
      }
      return payload;
    });
  }

  function formatPrice(value) {
    const formatter = new Intl.NumberFormat(getLanguage() === "es" ? "es-SV" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    });
    return formatter.format(Number(value || 0));
  }

  function getPriceUnitLabel(unit) {
    const unitKey = {
      day: "price_unit_day",
      week: "price_unit_week",
      hour: "price_unit_hour"
    }[unit] || "price_unit_day";

    return t(unitKey);
  }

  function translateCondition(value) {
    const normalized = String(value || "").toLowerCase();
    const conditionKey =
      {
        excellent: "condition_excellent",
        good: "condition_good",
        regular: "condition_regular",
        optimal: "condition_optimal",
        "requires review": "condition_requires_review"
      }[normalized] || null;

    return conditionKey ? t(conditionKey) : value;
  }

  function getVehicleText(vehicle, field) {
    const suffix = getLanguage() === "es" ? "Es" : "En";
    return (
      vehicle[`${field}${suffix}`] ||
      vehicle[field] ||
      vehicle[`${field}Es`] ||
      vehicle[`${field}En`] ||
      ""
    );
  }

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem("bahn-wishlist") || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveWishlist(items) {
    localStorage.setItem("bahn-wishlist", JSON.stringify([...new Set(items)]));
    updateWishlistCount();
  }

  function isWishlisted(id) {
    return getWishlist().includes(id);
  }

  function toggleWishlist(id) {
    const current = getWishlist();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    saveWishlist(next);
    return next.includes(id);
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem("bahn-current-user") || "null");
    } catch (error) {
      return null;
    }
  }

  function setCurrentUser(user) {
    if (user) {
      localStorage.setItem("bahn-current-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("bahn-current-user");
    }
    hydrateChrome();
  }

  function logout() {
    localStorage.removeItem("bahn-current-user");
    hydrateChrome();
  }

  function renderListingCard(vehicle) {
    const wished = isWishlisted(vehicle.id);
    const title = getVehicleText(vehicle, "title");
    const location = getVehicleText(vehicle, "location");
    const priceUnit = getPriceUnitLabel(vehicle.priceUnit);

    return `
      <article class="listing-card">
        <a class="listing-card__media" href="/detail?id=${vehicle.id}">
          <img src="${vehicle.thumbnail}" alt="${title}">
        </a>
        <button
          class="wishlist-icon ${wished ? "is-active" : ""}"
          data-wishlist-btn
          data-id="${vehicle.id}"
          aria-label="${t("wishlist_toggle")}"
        >
          &#9825;
        </button>
        <div class="listing-card__body">
          <h3><a href="/detail?id=${vehicle.id}">${title}</a></h3>
          <p class="listing-card__meta">${vehicle.brand} ${vehicle.model}</p>
          <p class="listing-card__subtle">${translateCondition(vehicle.visualCondition)}${t("card_location_separator")}${location}</p>
          <div class="listing-card__footer">
            <span class="listing-card__price">${formatPrice(vehicle.price)} <small>/ ${priceUnit}</small></span>
            <a class="link-arrow" href="/detail?id=${vehicle.id}">${t("card_view")}</a>
          </div>
        </div>
      </article>
    `;
  }

  function attachWishlistHandlers(root = document) {
    root.querySelectorAll("[data-wishlist-btn]").forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const active = toggleWishlist(button.dataset.id);
        button.classList.toggle("is-active", active);
      });
    });
  }

  function updateWishlistCount() {
    const count = getWishlist().length;
    document.querySelectorAll("[data-wishlist-count]").forEach((node) => {
      node.textContent = String(count);
    });
  }

  function hydrateChrome() {
    const user = getCurrentUser();

    document.querySelectorAll("[data-user-name]").forEach((node) => {
      node.textContent = user ? user.name : t("guest_menu");
    });

    document.querySelectorAll("[data-user-role]").forEach((node) => {
      node.textContent = user ? t(user.role === "owner" ? "role_owner" : "role_client") : t("guest_state");
    });

    document.querySelectorAll("[data-auth-link]").forEach((node) => {
      if (user) {
        node.textContent = user.role === "owner" ? t("nav_dashboard") : t("nav_catalog");
        node.href = user.role === "owner" ? "/dashboard" : "/catalog";
      } else {
        node.textContent = t("nav_login_register");
        node.href = "/auth";
      }
    });

    document.querySelectorAll("[data-logout-btn]").forEach((node) => {
      node.hidden = !user;
      node.textContent = t("nav_logout");
      if (node.dataset.bound === "true") {
        return;
      }

      node.dataset.bound = "true";
      node.addEventListener("click", () => {
        logout();
        window.location.href = "/";
      });
    });

    updateWishlistCount();
  }

  function setupSearchForms(root = document) {
    root.querySelectorAll("[data-search-form]").forEach((form) => {
      if (form.dataset.bound === "true") {
        return;
      }

      form.dataset.bound = "true";
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const params = new URLSearchParams();

        for (const [key, value] of formData.entries()) {
          if (String(value).trim()) {
            params.set(key, String(value).trim());
          }
        }

        const target = params.toString() ? `/catalog?${params.toString()}` : "/catalog";
        window.location.href = target;
      });
    });
  }

  function showEmptyState(container, message) {
    container.innerHTML = `<div class="empty-state">${message}</div>`;
  }

  window.BahnApp = {
    attachWishlistHandlers,
    fetchJson,
    formatPrice,
    getCurrentUser,
    getLanguage,
    getPriceUnitLabel,
    getVehicleText,
    getWishlist,
    hydrateChrome,
    isWishlisted,
    renderListingCard,
    saveWishlist,
    setCurrentUser,
    setDocumentTitle,
    setLanguage,
    setupSearchForms,
    showEmptyState,
    t,
    toggleWishlist,
    translateCondition,
    updateWishlistCount
  };

  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(getLanguage(), { skipEvent: true });
    setupSearchForms();
    attachWishlistHandlers();
  });
})();
