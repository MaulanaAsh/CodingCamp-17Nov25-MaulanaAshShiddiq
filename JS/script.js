// script.js - welcome name, form validation, preview, time

(function () {
  // elements
  const nameDisplay = document.getElementById("nameDisplay");
  const currentTimeEl = document.getElementById("currentTime");
  const previewBox = document.getElementById("previewBox");
  const form = document.getElementById("contactForm");

  // load stored name
  try {
    const stored = localStorage.getItem("user_name");
    if (stored) {
      nameDisplay.textContent = stored;
    }
  } catch (e) {
    /* ignore */
  }

  // time update (static)
  function updateTime() {
    if (currentTimeEl) currentTimeEl.textContent = new Date().toString();
  }
  updateTime();
  setInterval(updateTime, 30000);

  // form submit -> validate & preview
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("formName").value.trim();
      const date = document.getElementById("formDate").value;
      const genderEl = form.querySelector('input[name="gender"]:checked');
      const gender = genderEl ? genderEl.value : "";
      const message = document.getElementById("formMessage").value.trim();

      const errors = [];
      if (!name) errors.push("Nama wajib diisi.");
      if (!date) errors.push("Tanggal Lahir wajib diisi.");
      if (!gender) errors.push("Jenis Kelamin wajib dipilih.");
      if (!message) errors.push("Pesan tidak boleh kosong.");

      if (errors.length) {
        previewBox.style.color = "crimson";
        previewBox.textContent = "Error:\n" + errors.join("\n");
        // Scroll ke error juga
        previewBox.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Format preview seperti di wireframe
      const out = [
        "Nama : " + name,
        "Tanggal Lahir : " + date,
        "Jenis Kelamin : " + gender,
        "Pesan : " + message,
      ].join("\n");

      previewBox.style.color = "black";
      previewBox.textContent = out;

      // Simpan nama ke localStorage
      try {
        localStorage.setItem("user_name", name);
      } catch (e) {}

      // ✅ SCROLL OTOMATIS KE PREVIEW (UX MOBILE)
      previewBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // ===========================================
  // REAL-TIME CLOCK (DETIK JALAN TERUS)
  // ===========================================
  function updateClock() {
    const clockEl = document.getElementById("clock");
    const fullDateEl = document.getElementById("fullDate");
    const gmtEl = document.getElementById("gmtInfo");

    const now = new Date();

    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString("id-ID", {
        hour12: false,
      });
    }

    if (fullDateEl) {
      fullDateEl.textContent = now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    if (gmtEl) {
      const offset = now.getTimezoneOffset();
      const hours = Math.floor(Math.abs(offset) / 60);
      const sign = offset <= 0 ? "+" : "-";
      gmtEl.textContent = `GMT${sign}${hours}`;
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  // Fade transition saat klik link internal 
  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll('a[href^="index.html"], a[href^="profile.html"]')
      .forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          document.body.style.opacity = "0";
          document.body.style.transition = "opacity 0.3s ease";
          setTimeout(() => {
            window.location.href = this.href;
          }, 300);
        });
      });
  });
})();
