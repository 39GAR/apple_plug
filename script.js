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
