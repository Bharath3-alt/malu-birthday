document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const revealItems = document.querySelectorAll(".reveal");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const giftBox = document.getElementById("gift-box");
  const siteMusic = document.getElementById("site-background-music");
  const siteMusicMuteToggle = document.getElementById("site-music-mute");
  const siteMusicStatus = document.getElementById("site-music-status");
  const revealLetterButton = document.getElementById("reveal-letter");
  const birthdayLetter = document.getElementById("birthday-letter");
  const confettiLayer = document.getElementById("confetti-layer");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const typingText = document.querySelector(".typing-text");
  const portraitCards = document.querySelectorAll(".portrait-card");
  const cinematicLinks = document.querySelectorAll(".cinematic-link");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (portraitCards.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let parallaxFrame = 0;

    const updatePortraitParallax = () => {
      const viewportCenter = window.innerHeight / 2;

      portraitCards.forEach((card) => {
        const cardCenter = card.getBoundingClientRect().top + card.offsetHeight / 2;
        const offset = Math.max(-10, Math.min(10, (viewportCenter - cardCenter) * 0.015));
        card.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
      });

      parallaxFrame = 0;
    };

    const requestPortraitParallax = () => {
      if (!parallaxFrame) {
        parallaxFrame = window.requestAnimationFrame(updatePortraitParallax);
      }
    };

    window.addEventListener("scroll", requestPortraitParallax, { passive: true });
    window.addEventListener("resize", requestPortraitParallax);
    updatePortraitParallax();
  }

  if (loader) {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 900);
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.target || "#intro");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  if (giftBox) {
    giftBox.addEventListener("click", () => {
      giftBox.classList.toggle("open");
      if (confettiLayer) {
        const colors = ["#ff6ea8", "#ffd76b", "#7fe7ff", "#d5a5ff", "#8be5b3"];
        for (let i = 0; i < 30; i += 1) {
          const piece = document.createElement("span");
          piece.className = "confetti";
          piece.style.left = `${Math.random() * 100}%`;
          piece.style.background = colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDelay = `${Math.random() * 0.2}s`;
          confettiLayer.appendChild(piece);
          setTimeout(() => piece.remove(), 2800);
        }
      }
    });
  }

  if (revealLetterButton && birthdayLetter) {
    revealLetterButton.addEventListener("click", () => {
      revealLetterButton.hidden = true;
      birthdayLetter.hidden = false;
      if (confettiLayer) {
        const colors = ["#ffd8a8", "#ff8db8", "#7ee7e8", "#d6b4ff", "#ffad66"];
        for (let i = 0; i < 42; i += 1) {
          const piece = document.createElement("span");
          piece.className = "confetti";
          piece.style.left = `${Math.random() * 100}%`;
          piece.style.background = colors[Math.floor(Math.random() * colors.length)];
          piece.style.animationDelay = `${Math.random() * 0.2}s`;
          confettiLayer.appendChild(piece);
          setTimeout(() => piece.remove(), 2800);
        }
      }
    });
  }

  if (siteMusic) {
    const preferenceKeys = {
      muted: "malu-site-music-muted",
      position: "malu-site-music-position",
    };

    const readLocalPreference = (key) => {
      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.warn("Could not read the music preference from local storage.", error);
        return null;
      }
    };

    const writeLocalPreference = (key, value) => {
      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.warn("Could not save the music preference to local storage.", error);
      }
    };

    const syncMuteControl = () => {
      const muted = siteMusic.muted;
      if (siteMusicMuteToggle) {
        siteMusicMuteToggle.setAttribute("aria-label", muted ? "Unmute music" : "Mute music");
        siteMusicMuteToggle.setAttribute("title", muted ? "Unmute music" : "Mute music");
        siteMusicMuteToggle.setAttribute("aria-pressed", String(muted));
        const icon = siteMusicMuteToggle.querySelector("span");
        if (icon) {
          icon.textContent = muted ? "🔇" : "🔊";
        }
      }
    };

    const showAutoplayError = (error) => {
      if (siteMusicStatus) {
        siteMusicStatus.textContent = "Your browser blocked automatic playback. Allow sound for this site and reload.";
        siteMusicStatus.classList.add("is-visible");
      }
      console.warn("The browser did not allow automatic background music playback.", error);
    };

    const startPlayback = async () => {
      try {
        await siteMusic.play();
        if (siteMusicStatus) {
          siteMusicStatus.textContent = "";
          siteMusicStatus.classList.remove("is-visible");
        }
      } catch (error) {
        showAutoplayError(error);
      }
    };

    const setSavedPosition = () => {
      const savedPosition = Number(readLocalPreference(preferenceKeys.position));
      if (Number.isFinite(savedPosition) && savedPosition > 0 && Number.isFinite(siteMusic.duration)) {
        siteMusic.currentTime = Math.min(savedPosition, Math.max(0, siteMusic.duration - 0.1));
      }
    };

    let lastPositionSave = 0;
    const savePosition = (force) => {
      const now = Date.now();
      if (!force && now - lastPositionSave < 1000) {
        return;
      }
      lastPositionSave = now;
      if (Number.isFinite(siteMusic.currentTime)) {
        writeLocalPreference(preferenceKeys.position, String(siteMusic.currentTime));
      }
    };

    siteMusic.muted = readLocalPreference(preferenceKeys.muted) === "true";
    siteMusic.addEventListener("play", syncMuteControl);
    siteMusic.addEventListener("volumechange", syncMuteControl);
    siteMusic.addEventListener("timeupdate", () => savePosition(false));
    siteMusic.addEventListener("error", () => {
      const mediaError = siteMusic.error;
      const errorMessage = mediaError ? `Media error ${mediaError.code}.` : "Unknown media error.";
      if (siteMusicStatus) {
        siteMusicStatus.textContent = "Music file could not be loaded. Check media/music/until-i-found-you.mp3.";
        siteMusicStatus.classList.add("is-visible");
      }
      console.error(`The background music file could not be loaded. ${errorMessage}`, mediaError);
    });
    window.addEventListener("pagehide", () => savePosition(true));

    const retryAutoplay = () => {
      if (siteMusic.paused) {
        startPlayback();
      }
    };
    document.addEventListener("pointerdown", retryAutoplay, { passive: true });
    document.addEventListener("keydown", retryAutoplay);
    siteMusic.addEventListener(
      "play",
      () => {
        document.removeEventListener("pointerdown", retryAutoplay);
        document.removeEventListener("keydown", retryAutoplay);
      },
      { once: true }
    );

    if (siteMusicMuteToggle) {
      siteMusicMuteToggle.addEventListener("click", () => {
        siteMusic.muted = !siteMusic.muted;
        writeLocalPreference(preferenceKeys.muted, String(siteMusic.muted));
        syncMuteControl();
      });
    }

    const restoreAndPlay = () => {
      setSavedPosition();
      startPlayback();
    };

    if (siteMusic.readyState >= 1) {
      restoreAndPlay();
    } else {
      siteMusic.addEventListener("loadedmetadata", restoreAndPlay, { once: true });
    }
    syncMuteControl();
  }

  if (lightbox && lightboxImage && lightboxCaption) {
    document.querySelectorAll(".lightbox-trigger").forEach((item) => {
      item.addEventListener("click", () => {
        lightboxImage.src = item.dataset.image || "";
        lightboxImage.alt = item.querySelector("img")?.alt || "Expanded memory";
        lightboxCaption.textContent = item.dataset.caption || "";
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
      });
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
      }
    });

    const closeButton = document.querySelector(".lightbox-close");
    closeButton?.addEventListener("click", () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("open")) {
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
      }
    });
  }

  if (cinematicLinks.length) {
    cinematicLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetUrl = link.getAttribute("href");
        if (!targetUrl) return;

        event.preventDefault();
        document.body.classList.add("transitioning");

        setTimeout(() => {
          window.location.href = targetUrl;
        }, 650);
      });
    });
  }

  if (typingText) {
    const fullText = typingText.dataset.text || "";
    let index = 0;

    const typeText = () => {
      typingText.textContent = fullText.slice(0, index);
      index += 1;
      if (index <= fullText.length) {
        setTimeout(typeText, 16);
      }
    };

    setTimeout(typeText, 500);
  }
});
