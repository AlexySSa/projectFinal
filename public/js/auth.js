document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#auth-form");
  const modeButtons = Array.from(document.querySelectorAll("[data-auth-mode]"));
  const registerOnly = Array.from(document.querySelectorAll("[data-register-only]"));
  const title = document.querySelector("#auth-title");
  const description = document.querySelector("#auth-description");
  const submit = document.querySelector("#auth-submit");
  const status = document.querySelector("#auth-status");
  const passwordInput = document.querySelector("#password");
  const togglePassword = document.querySelector("#toggle-password");
  let currentMode = "register";

  function applyStaticLabels() {
    document.querySelector("#label-name").textContent = BahnApp.t("auth_full_name");
    document.querySelector("#label-email").textContent = BahnApp.t("auth_email");
    document.querySelector("#label-password").textContent = BahnApp.t("auth_password");
    document.querySelector("#label-phone").textContent = BahnApp.t("auth_phone");
    document.querySelector("#label-role").textContent = BahnApp.t("auth_select_role");
    document.querySelector("#auth-demo-note").innerHTML = `${BahnApp.t("auth_demo_owner")}: <strong>owner@bahn.com</strong> / <strong>123456</strong><br>${BahnApp.t("auth_demo_client")}: <strong>client@bahn.com</strong> / <strong>123456</strong>`;
    passwordInput.placeholder = BahnApp.t("auth_password");
    document.querySelector("#name").placeholder = BahnApp.t("auth_full_name");
    document.querySelector("#email").placeholder = BahnApp.t("auth_email");
    document.querySelector("#phone").placeholder = BahnApp.t("auth_phone");
    document.querySelector("#role").options[0].textContent = BahnApp.t("role_owner");
    document.querySelector("#role").options[1].textContent = BahnApp.t("role_client");
    document.querySelector("[data-auth-mode='login']").textContent = BahnApp.t("auth_login");
    document.querySelector("[data-auth-mode='register']").textContent = BahnApp.t("auth_register");
  }

  function updateTogglePasswordLabel() {
    togglePassword.textContent = passwordInput.type === "password" ? BahnApp.t("auth_show_password") : BahnApp.t("auth_hide_password");
  }

  function updateMode(mode) {
    currentMode = mode;
    modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.authMode === mode);
    });
    registerOnly.forEach((node) => {
      node.classList.toggle("hidden", mode === "login");
    });
    title.textContent = mode === "login" ? BahnApp.t("auth_welcome_back") : BahnApp.t("auth_create_account");
    description.textContent = mode === "login" ? BahnApp.t("auth_desc_login") : BahnApp.t("auth_desc_register");
    submit.textContent = mode === "login" ? BahnApp.t("auth_submit_login") : BahnApp.t("auth_submit_register");
    status.textContent = "";
    status.className = "form-status";
  }

  togglePassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    updateTogglePasswordLabel();
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => updateMode(button.dataset.authMode));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.className = "form-status";
    status.textContent = BahnApp.t("auth_processing");

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      role: formData.get("role")
    };

    try {
      const result = await BahnApp.fetchJson(currentMode === "login" ? "/api/login" : "/api/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      BahnApp.setCurrentUser(result.user);
      status.className = "form-status is-success";
      status.textContent = currentMode === "login" ? BahnApp.t("auth_login_success") : BahnApp.t("auth_register_success");
      window.setTimeout(() => {
        window.location.href = result.user.role === "owner" ? "/dashboard" : "/catalog";
      }, 600);
    } catch (error) {
      status.className = "form-status is-error";
      status.textContent = error.message;
    }
  });

  function renderLanguageState() {
    applyStaticLabels();
    updateTogglePasswordLabel();
    updateMode(currentMode);
  }

  renderLanguageState();
  updateMode("register");

  window.addEventListener("bahn:language-change", renderLanguageState);
});
