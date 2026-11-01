document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visualizer = document.getElementById("heroVisualizer");
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  let savedTheme = "dark";
  try {
    const storedTheme = localStorage.getItem("harrymusic-theme");
    if (storedTheme === "light" || storedTheme === "dark") savedTheme = storedTheme;
  } catch (error) {
    // Keep the default theme if browser storage is unavailable.
  }

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (!themeToggle) return;
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    themeToggle.title = `Switch to ${nextTheme} theme`;
  };

  applyTheme(savedTheme);
  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    try {
      localStorage.setItem("harrymusic-theme", nextTheme);
    } catch (error) {
      // Theme still changes for this page view.
    }
  });

  const diwaliNotice = document.getElementById("diwaliNotice");
  let diwaliTimer;

  const dismissDiwaliNotice = () => {
    if (!diwaliNotice || diwaliNotice.hidden) return;
    window.clearTimeout(diwaliTimer);
    if (diwaliNotice.contains(document.activeElement)) document.activeElement.blur();
    diwaliNotice.classList.remove("is-visible");
    diwaliNotice.classList.add("is-leaving");

    window.setTimeout(() => {
      diwaliNotice.hidden = true;
      diwaliNotice.setAttribute("aria-hidden", "true");
      diwaliNotice.classList.remove("is-leaving");
    }, reducedMotion ? 0 : 460);
  };

  const showDiwaliNotice = () => {
    if (!diwaliNotice) return;
    diwaliNotice.hidden = false;
    diwaliNotice.setAttribute("aria-hidden", "false");
    diwaliNotice.style.setProperty("--notice-duration", "7000ms");
    window.requestAnimationFrame(() => diwaliNotice.classList.add("is-visible"));
    diwaliTimer = window.setTimeout(dismissDiwaliNotice, 7_000);
  };

  diwaliNotice?.querySelector(".notice-close")?.addEventListener("click", dismissDiwaliNotice);

  window.setTimeout(showDiwaliNotice, 2600);

  if (visualizer && !reducedMotion) {
    const fragment = document.createDocumentFragment();
    for (let index = 0; index < 56; index += 1) {
      const bar = document.createElement("span");
      const wave = Math.abs(Math.sin(index * 0.37) * Math.cos(index * 0.13));
      bar.style.setProperty("--bar-height", `${18 + wave * 82}%`);
      bar.style.setProperty("--bar-delay", `-${(index % 13) * 0.11}s`);
      bar.style.setProperty("--bar-speed", `${0.55 + (index % 7) * 0.12}s`);
      fragment.append(bar);
    }
    visualizer.append(fragment);
  }

  const revealTargets = document.querySelectorAll(
    ".section-kicker, .display-heading, .section-intro, .stat, .release-card, .platform-card, .shop-card, .service-card, .quotes blockquote, .contact-form"
  );
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -35px 0px" });

    revealTargets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 55}ms`);
      revealObserver.observe(element);
    });
  }

  if (!reducedMotion) {
    document.querySelectorAll(".platform-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty("--card-tilt-x", `${x * 4}deg`);
        card.style.setProperty("--card-tilt-y", `${y * -4}deg`);
        card.style.setProperty("--card-light-x", `${((x + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty("--card-light-y", `${((y + 0.5) * 100).toFixed(1)}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--card-tilt-x");
        card.style.removeProperty("--card-tilt-y");
      });
    });
  }

  const statsRow = document.querySelector(".stats-row");
  const counters = Array.from(document.querySelectorAll(".stat-value[data-count]"));
  if (!reducedMotion && statsRow && counters.length && "IntersectionObserver" in window) {
    const formatCount = (value, element) => {
      if (element.dataset.format === "compact" && value >= 1000) {
        return `${Math.floor(value / 1000)}k`;
      }
      return new Intl.NumberFormat("en-IN").format(value);
    };

    const animateCount = (element) => {
      const target = Number(element.dataset.count);
      const duration = target > 1000 ? 1700 : 1250;
      const startedAt = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = formatCount(Math.floor(target * eased), element);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      counters.forEach(animateCount);
      observer.disconnect();
    }, { threshold: 0.3 });
    statsObserver.observe(statsRow);
  }

  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");

  const closeMenu = () => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      primaryNav.classList.toggle("is-open", !isOpen);
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const releaseCards = Array.from(document.querySelectorAll(".release-card"));
  const filterStatus = document.getElementById("filterStatus");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isSelected = item === button;
        item.classList.toggle("is-active", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });

      let visibleCount = 0;
      releaseCards.forEach((card) => {
        const genres = (card.dataset.genres || "").split(/\s+/);
        const isVisible = selectedFilter === "all" || genres.includes(selectedFilter);
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (filterStatus) {
        filterStatus.textContent = selectedFilter === "all"
          ? "Showing all releases."
          : `Showing ${visibleCount} release${visibleCount === 1 ? "" : "s"}.`;
      }
    });
  });

  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");
  const submitButton = contactForm?.querySelector('button[type="submit"]');

  if (contactForm && formFeedback && submitButton) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formFeedback.textContent = "";
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");

      const originalLabel = submitButton.innerHTML;
      submitButton.textContent = "Sending…";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("The message could not be sent.");

        contactForm.reset();
        formFeedback.textContent = "Thanks — your inquiry has been sent.";
      } catch (error) {
        formFeedback.textContent = "We couldn’t send that just now. Please email Harry directly.";
      } finally {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
        submitButton.innerHTML = originalLabel;
      }
    });
  }
});
