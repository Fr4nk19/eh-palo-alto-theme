
  document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");

    if (from && from.includes("wholesale")) {
      document.body.classList.add("is-wholesale-login");

      const title = document.querySelector("login-heading");
      if (title) title.textContent = "Acceso para mayoristas";
    }
  });
