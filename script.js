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
