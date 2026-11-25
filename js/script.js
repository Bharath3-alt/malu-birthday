document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const revealItems = document.querySelectorAll(".reveal");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const giftBox = document.getElementById("gift-box");
  const siteMusic = document.getElementById("site-background-music");
  const siteMusicPlayToggle = document.getElementById("site-music-play");
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
      playing: "malu-site-music-playing",
      paused: "malu-site-music-paused",
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

    const syncPlayControl = () => {
      const isPlaying = !siteMusic.paused;
      if (siteMusicPlayToggle) {
        siteMusicPlayToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
        siteMusicPlayToggle.setAttribute("title", isPlaying ? "Pause music" : "Play music");
        siteMusicPlayToggle.setAttribute("aria-pressed", String(isPlaying));
        const icon = siteMusicPlayToggle.querySelector("span");
        if (icon) {
          icon.textContent = isPlaying ? "❚❚" : "▶";
        }
      }
    };

    const showPlaybackError = (error) => {
      if (siteMusicStatus) {
        siteMusicStatus.textContent =
          error.name === "NotAllowedError"
            ? "Your browser blocked autoplay. Tap Play to start the music."
            : "Playback could not start. Tap Play to try again.";
        siteMusicStatus.classList.add("is-visible");
      }
      console.warn("The browser did not allow background music playback.", error);
    };

    const startPlayback = async () => {
      try {
        await siteMusic.play();
        writeLocalPreference(preferenceKeys.playing, "true");
        writeLocalPreference(preferenceKeys.paused, "false");
        if (siteMusicStatus) {
          siteMusicStatus.textContent = "";
          siteMusicStatus.classList.remove("is-visible");
        }
        syncPlayControl();
      } catch (error) {
        syncPlayControl();
        showPlaybackError(error);
      }
    };

    const pausePlayback = () => {
      siteMusic.pause();
      writeLocalPreference(preferenceKeys.playing, "false");
      writeLocalPreference(preferenceKeys.paused, "true");
      syncPlayControl();
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
    siteMusic.addEventListener("play", () => {
      syncMuteControl();
      syncPlayControl();
    });
    siteMusic.addEventListener("pause", syncPlayControl);
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

    if (siteMusicPlayToggle) {
      siteMusicPlayToggle.addEventListener("click", () => {
        if (siteMusic.paused) {
          writeLocalPreference(preferenceKeys.paused, "false");
          startPlayback();
        } else {
          pausePlayback();
        }
      });
    }

    if (siteMusicMuteToggle) {
      siteMusicMuteToggle.addEventListener("click", () => {
        siteMusic.muted = !siteMusic.muted;
        writeLocalPreference(preferenceKeys.muted, String(siteMusic.muted));
        syncMuteControl();
      });
    }

    const restoreAndPlay = () => {
      setSavedPosition();
      syncPlayControl();
      syncMuteControl();
      if (readLocalPreference(preferenceKeys.paused) !== "true") {
        startPlayback();
      }
    };

    if (siteMusic.readyState >= 1) {
      restoreAndPlay();
    } else {
      siteMusic.addEventListener("loadedmetadata", restoreAndPlay, { once: true });
    }
    syncMuteControl();
    syncPlayControl();
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

  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatTranscript = document.getElementById("chat-transcript");
  const chatTypingIndicator = document.getElementById("chat-typing-indicator");
  const chatError = document.getElementById("chat-error");
  const chatSendButton = document.getElementById("chat-send");
  const chatClearButton = document.getElementById("chat-clear");
  const chatRevealButton = document.getElementById("chat-reveal-button");
  const chatFinalMessage = document.getElementById("chat-final-message");

  if (
    chatForm &&
    chatInput &&
    chatTranscript &&
    chatTypingIndicator &&
    chatError &&
    chatSendButton
  ) {
    const config = window.BIRTHDAY_CHAT_CONFIG || {};
    const apiBaseUrl = typeof config.apiBaseUrl === "string" ? config.apiBaseUrl.trim().replace(/\/+$/, "") : "";
    const welcomeMessage =
      "Hi Malu! Happy birthday! I'm your little birthday assistant. Ask me anything—or ask me who made this little corner of the internet. 👀";
    let chatHistory = [{ role: "assistant", content: welcomeMessage }];
    let isSending = false;

    const appendMessage = (role, content) => {
      const message = document.createElement("div");
      message.className = `chat-message chat-message-${role}`;

      if (role === "assistant") {
        const avatar = document.createElement("span");
        avatar.className = "chat-message-avatar";
        avatar.setAttribute("aria-hidden", "true");
        avatar.textContent = "✦";
        message.appendChild(avatar);
      }

      const bubble = document.createElement("p");
      bubble.className = "chat-message-bubble";
      bubble.textContent = content;
      message.appendChild(bubble);
      chatTranscript.appendChild(message);
      chatTranscript.scrollTo({ top: chatTranscript.scrollHeight, behavior: "smooth" });
    };

    const updateSendButton = () => {
      chatSendButton.disabled = isSending || !chatInput.value.trim();
      chatInput.disabled = isSending;
      chatForm.setAttribute("aria-busy", String(isSending));
    };

    const clearError = () => {
      chatError.textContent = "";
      chatError.classList.remove("is-visible");
    };

    const showError = (message) => {
      chatError.textContent = message;
      chatError.classList.add("is-visible");
    };

    const getApiUrl = () => {
      if (!apiBaseUrl) {
        throw new Error("The AI chat backend isn't connected yet. Please try again after it's set up.");
      }

      let url;
      try {
        url = new URL(apiBaseUrl);
      } catch {
        throw new Error("Our birthday assistant is not available right now. Please try again soon.");
      }

      const isLocalHttp = url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname);
      if (url.protocol !== "https:" && !isLocalHttp) {
        throw new Error("Our birthday assistant is not available right now. Please try again soon.");
      }

      return `${apiBaseUrl}/api/chat`;
    };

    const sendMessage = async (messageText) => {
      if (isSending || !messageText) {
        return;
      }

      isSending = true;
      clearError();
      appendMessage("user", messageText);
      chatHistory.push({ role: "user", content: messageText });
      chatInput.value = "";
      chatTypingIndicator.hidden = false;
      chatTranscript.scrollTo({ top: chatTranscript.scrollHeight, behavior: "smooth" });
      updateSendButton();

      const requestMessages = chatHistory.slice(-20);
      while (
        requestMessages.length > 1 &&
        requestMessages.reduce((total, item) => total + item.content.length, 0) > 9500
      ) {
        requestMessages.shift();
      }

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 45000);
      try {
        const response = await fetch(getApiUrl(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "omit",
          body: JSON.stringify({ messages: requestMessages }),
          signal: controller.signal,
        });
        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            typeof result?.detail === "string"
              ? result.detail
              : "The birthday assistant is taking a little break. Please try again."
          );
        }

        if (typeof result?.reply !== "string" || !result.reply.trim()) {
          throw new Error("The birthday assistant couldn't reply just now. Please try again.");
        }

        const reply = result.reply.trim();
        chatHistory.push({ role: "assistant", content: reply });
        appendMessage("assistant", reply);
      } catch (error) {
        chatHistory.pop();
        const message =
          error.name === "AbortError"
            ? "That took a little too long. Please try sending your message again."
            : error.message || "The birthday assistant is unavailable right now. Please try again soon.";
        showError(message);
      } finally {
        window.clearTimeout(timeoutId);
        chatTypingIndicator.hidden = true;
        isSending = false;
        chatInput.focus();
        updateSendButton();
      }
    };

    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      sendMessage(chatInput.value.trim());
    });
    chatInput.addEventListener("input", updateSendButton);

    document.querySelectorAll(".chat-suggestion").forEach((suggestion) => {
      suggestion.addEventListener("click", () => {
        if (!isSending) {
          sendMessage(suggestion.textContent.trim());
        }
      });
    });

    chatClearButton?.addEventListener("click", () => {
      if (isSending || !window.confirm("Clear this conversation? This only clears the chat on this page.")) {
        return;
      }
      chatHistory = [{ role: "assistant", content: welcomeMessage }];
      chatTranscript.replaceChildren();
      appendMessage("assistant", welcomeMessage);
      clearError();
      chatInput.value = "";
      updateSendButton();
      chatInput.focus();
    });

    chatRevealButton?.addEventListener("click", () => {
      const message =
        typeof config.finalRevealMessage === "string" ? config.finalRevealMessage.trim() : "";
      if (!message) {
        showError("Add your personal reveal message in js/chat-config.js first.");
        return;
      }
      chatFinalMessage.textContent = message;
      chatFinalMessage.hidden = false;
      chatRevealButton.hidden = true;
      chatFinalMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    updateSendButton();
  }
});
