(() => {
  "use strict";

  const body = document.body;
  const main = document.querySelector("main");

  if (main) {
    main.id = main.id || "conteudo-principal";

    const skipLink = document.createElement("a");
    skipLink.className = "skip-link";
    skipLink.href = `#${main.id}`;
    skipLink.textContent = "Pular para o conteúdo";
    body.prepend(skipLink);
  }

  body.classList.add("js-ready");

  document.querySelectorAll("a[target='_blank']").forEach((link) => {
    if (!link.hasAttribute("aria-label")) {
      link.setAttribute("aria-label", `${link.textContent.trim()} — abre em nova aba`);
    }
  });

  const nav = document.querySelector(".nav-wrap");
  const navLinks = document.querySelector(".nav-links");

  if (nav && navLinks) {
    navLinks.id = navLinks.id || "navegacao-principal";

    const activeLink = navLinks.querySelector("a.active");
    if (activeLink) {
      activeLink.setAttribute("aria-current", "page");
    }

    const navToggle = document.createElement("button");
    const navToggleBars = document.createElement("span");
    navToggle.type = "button";
    navToggle.className = "nav-toggle";
    navToggle.setAttribute("aria-controls", navLinks.id);
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu de navegação");
    navToggleBars.className = "nav-toggle-bars";
    navToggleBars.setAttribute("aria-hidden", "true");
    navToggle.append(navToggleBars);
    nav.insertBefore(navToggle, navLinks);

    const closeMenu = (restoreFocus = false) => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Abrir menu de navegação");

      if (restoreFocus) {
        navToggle.focus();
      }
    };

    const openMenu = () => {
      navLinks.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Fechar menu de navegação");
    };

    navToggle.addEventListener("click", () => {
      if (navLinks.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("click", (event) => {
      if (navLinks.classList.contains("is-open") && !nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("is-open")) {
        closeMenu(true);
      }
    });

    const desktopNavigation = window.matchMedia("(min-width: 761px)");
    const handleDesktopNavigation = (event) => {
      if (event.matches) {
        closeMenu();
      }
    };

    if (desktopNavigation.addEventListener) {
      desktopNavigation.addEventListener("change", handleDesktopNavigation);
    } else {
      desktopNavigation.addListener(handleDesktopNavigation);
    }
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealTargets = document.querySelectorAll(
    ".section-head, .grid > *, .stats-grid > *, .skill-board > *, .project-list article, .timeline-list li, .featured-certificate, .certificate-summary > *, .certificate-category, .contact-card, .pill-list li"
  );

  if (reducedMotion.matches) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    revealTargets.forEach((element, index) => {
      element.dataset.reveal = "";
      element.style.transitionDelay = `${Math.min((index % 6) * 55, 220)}ms`;
    });

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px" }
    );

    revealTargets.forEach((element) => observer.observe(element));
  }

  const certificateSearch = document.querySelector("[data-certificate-search]");
  const certificateBoard = document.querySelector(".certificate-board");

  if (certificateSearch && certificateBoard) {
    const categories = Array.from(certificateBoard.querySelectorAll(".certificate-category"));
    const links = categories.flatMap((category) =>
      Array.from(category.querySelectorAll(".certificate-list a"))
    );
    const resultCount = document.querySelector("[data-certificate-result-count]");
    const emptyState = document.createElement("p");
    emptyState.className = "certificate-empty";
    emptyState.textContent = "Nenhum certificado encontrado. Tente outro termo de busca.";
    certificateBoard.after(emptyState);

    const normalize = (value) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();

    const updateResults = () => {
      const query = normalize(certificateSearch.value);
      let matches = 0;

      categories.forEach((category) => {
        const categoryName = normalize(category.querySelector("h3")?.textContent || "");
        const categoryMatches = query && categoryName.includes(query);
        let categoryHasMatch = false;

        category.querySelectorAll(".certificate-list a").forEach((link) => {
          const linkMatches = !query || categoryMatches || normalize(link.textContent).includes(query);
          link.classList.toggle("is-filtered-out", !linkMatches);

          if (linkMatches) {
            categoryHasMatch = true;
            matches += 1;
          }
        });

        category.classList.toggle("is-filtered-out", !categoryHasMatch);
      });

      emptyState.classList.toggle("is-visible", Boolean(query) && matches === 0);

      if (resultCount) {
        resultCount.textContent = query
          ? `${matches} ${matches === 1 ? "documento encontrado" : "documentos encontrados"}`
          : `${links.length} documentos disponíveis`;
      }
    };

    certificateSearch.addEventListener("input", updateResults);
    updateResults();

    document.addEventListener("keydown", (event) => {
      const focusedElement = document.activeElement;
      const isTyping = focusedElement?.matches("input, textarea, select, [contenteditable='true']");

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        certificateSearch.focus();
      }
    });
  }
})();
