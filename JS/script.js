document.addEventListener("DOMContentLoaded", function () {
  // Ambil semua elemen yang dibutuhkan
  const nameDisplay = document.getElementById("nameDisplay");
  const currentTimeEl = document.getElementById("currentTime");
  const clockEl = document.getElementById("clock");
  const fullDateEl = document.getElementById("fullDate");
  const gmtEl = document.getElementById("gmtInfo");
  const previewBox = document.getElementById("previewBox");
  const form = document.getElementById("contactForm");

  // Muat nama dari localStorage jika ada
  try {
    const storedName = localStorage.getItem("user_name");
    if (storedName) {
      nameDisplay.textContent = storedName;
    }
  } catch (e) {
    // abaikan jika localStorage error
  }

  // Fungsi: update "Current time" (static, update tiap 30 detik)
  function updateTimeStatic() {
    if (currentTimeEl) {
      currentTimeEl.textContent = new Date().toLocaleTimeString("id-ID");
    }
  }

  // Fungsi: update jam real-time (tiap detik)
  function updateRealTimeClock() {
    const now = new Date();

    // Update jam (24 jam)
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString("id-ID", { hour12: false });
    }

    // Update tanggal lengkap
    if (fullDateEl) {
      fullDateEl.textContent = now.toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    // Update GMT berdasarkan zona waktu pengguna
    if (gmtEl) {
      const offset = now.getTimezoneOffset(); // dalam menit
      const hours = Math.floor(Math.abs(offset) / 60);
      const sign = offset <= 0 ? "+" : "-"; // offset negatif = GMT+
      gmtEl.textContent = `GMT${sign}${String(hours).padStart(2, "0")}`;
    }
  }

  // Jalankan update waktu saat halaman pertama kali dimuat
  updateTimeStatic();
  updateRealTimeClock();

  // Set interval
  setInterval(updateTimeStatic, 30000); // tiap 30 detik
  setInterval(updateRealTimeClock, 1000); // tiap 1 detik

  // Tangani submit form
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("formName").value.trim();
      const dateInput = document.getElementById("formDate").value;
      let formattedDate = "Tidak diisi";
      if (dateInput) {
        const [year, month, day] = dateInput.split("-");
        formattedDate = `${day}/${month}/${year}`;
      }
      const genderEl = form.querySelector('input[name="gender"]:checked');
      const gender = genderEl ? genderEl.value : "Tidak dipilih";
      const message = document.getElementById("formMessage").value.trim();

      // Validasi
      const errors = [];
      if (!name) errors.push("Nama wajib diisi.");
      if (!dateInput) errors.push("Tanggal Lahir wajib diisi.");
      if (!genderEl) errors.push("Jenis Kelamin wajib dipilih.");
      if (!message) errors.push("Pesan tidak boleh kosong.");

      if (errors.length > 0) {
        previewBox.style.color = "crimson";
        previewBox.textContent = "Error:\n" + errors.join("\n");
        previewBox.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      // Tampilkan preview
      const output = [
        "Nama : " + name,
        "Tanggal Lahir : " + formattedDate,
        "Jenis Kelamin : " + gender,
        "Pesan : " + message,
      ].join("\n");

      previewBox.style.color = "black";
      previewBox.textContent = output;

      // Simpan nama ke localStorage
      try {
        localStorage.setItem("user_name", name);
        nameDisplay.textContent = name;
      } catch (e) {
        // abaikan error localStorage
      }

      // Scroll ke preview
      previewBox.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // Fade saat navigasi internal (opsional)
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
