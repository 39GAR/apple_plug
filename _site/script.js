window.addEventListener("load", () => {
  const video = document.getElementById("heroVideo");
  const poster = document.querySelector(".hero-poster");
  if (!video || !poster) return;

  const FADE_START_TIME = 0.9; // seconds into playback

  // Play once after load
  video.play().catch(() => {});

  const onTime = () => {
    // only fade once the video has truly advanced
    if (video.currentTime >= FADE_START_TIME) {
      poster.classList.add("fade-out");
      video.removeEventListener("timeupdate", onTime);
    }
  };

  // Start listening only after playback begins (prevents “instant fade”)
  video.addEventListener("playing", () => {
    video.addEventListener("timeupdate", onTime);
  });

  // After ending: show poster again and reset
  video.addEventListener("ended", () => {
    poster.classList.remove("fade-out");
    video.currentTime = 0;
    video.load();
  });
});
//STORY LINE
window.addEventListener("load", () => {
  const slider = document.getElementById("storySlider");
  if (!slider) return;

  const track = slider.querySelector(".slides");
  const slides = Array.from(track.querySelectorAll(".slide"));
  const dots = Array.from(slider.querySelectorAll(".dot"));

  const setActive = (index) => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));

    slides.forEach((s, i) => {
      const v = s.querySelector("video");
      if (!v) return;

      if (i === index) v.play().catch(() => {});
      else { v.pause(); v.currentTime = 0; }
    });
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      track.scrollTo({ left: slides[i].offsetLeft, behavior: "smooth" });
      setActive(i);
    });
  });

  let rafId = null;
  track.addEventListener("scroll", () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const left = track.scrollLeft;
      let best = 0;
      let bestDist = Infinity;

      slides.forEach((s, i) => {
        const dist = Math.abs(s.offsetLeft - left);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });

      setActive(best);
    });
  });

  setActive(0);
});
// iPhone 14 pro MAX
window.addEventListener("load", () => {
  const productPage = document.querySelector(".product-page");
  if (!productPage) return;

  const WHATSAPP_NUMBER = "27604973873"; 

  const getSelected = (key) => {
    const group = productPage.querySelector(`.pills[data-option="${key}"]`);
    if (!group) return "";
    const selected = group.querySelector(".pill.is-selected");
    return selected ? selected.dataset.value : "";
  };

  const setSelected = (btn) => {
    const group = btn.closest(".pills");
    if (!group) return;
    group.querySelectorAll(".pill").forEach(b => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    updateWhatsAppLink();
  };

  productPage.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => setSelected(btn));
  });

  const custName = document.getElementById("custName");
  const custCity = document.getElementById("custCity");
  const delivery = document.getElementById("delivery");
  const whatsappBtn = document.getElementById("whatsappOrder");
  const copyBtn = document.getElementById("copyDetails");

  [custName, custCity, delivery].forEach(el => {
    if (!el) return;
    el.addEventListener("input", updateWhatsAppLink);
    el.addEventListener("change", updateWhatsAppLink);
  });

  function buildMessage() {
    const productName = productPage.dataset.product || "iPhone";

    const msg =
`Hi, I want to order:

Model: ${productName}
Color: ${getSelected("color")}
Storage: ${getSelected("storage")}
Condition: ${getSelected("condition")}
Network: ${getSelected("network")}
RAM: ${getSelected("ram")}

Name: ${custName?.value || ""}
City: ${custCity?.value || ""}
Delivery: ${delivery?.value || ""}

Please confirm availability and final price.`;

    return msg;
  }

  function updateWhatsAppLink() {
    const text = encodeURIComponent(buildMessage());
    if (whatsappBtn) {
      whatsappBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(buildMessage());
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy details"), 1200);
      } catch {
        alert("Copy failed. Please copy manually from the WhatsApp message.");
      }
    });
  }

  updateWhatsAppLink();
});
