document.addEventListener("DOMContentLoaded", () => {
  // === THEME TOGGLE ===
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  // === CURRENT DATE ===
  const dateEl = document.getElementById("current-date");
  if (dateEl) {
    const now = new Date();
    const day = now.getDate();
    const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    dateEl.textContent = `${day} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  // === HAMBURGER MENU ===
  const hamburger = document.getElementById("hamburger");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileOverlay.classList.toggle("active");
    document.body.style.overflow = mobileOverlay.classList.contains("active") ? "hidden" : "";
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      mobileOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // === ACTIVE NAV LINK ON SCROLL ===
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) link.classList.add("active");
        });
      }
    });
  }
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // === SCROLL DOWN BUTTON ===
  const scrollBtn = document.getElementById("scroll-down-btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // === BACK TO TOP ===
  const btnTop = document.getElementById("btn-top");
  if (btnTop) {
    btnTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // === COPY EMAIL ===
  const copyEmail = document.getElementById("copy-email");
  const copyTooltip = document.getElementById("copy-tooltip");
  if (copyEmail) {
    copyEmail.addEventListener("click", () => {
      const email = copyEmail.getAttribute("data-email");
      navigator.clipboard.writeText(email).then(() => {
        copyTooltip.classList.add("show");
        setTimeout(() => copyTooltip.classList.remove("show"), 2000);
      });
    });
  }

  // === CONTACT FORM ===
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;
      const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=dhehanprawira@gmail.com&su=${encodeURIComponent(subject || "Portfolio Contact")}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.open(mailtoLink, "_blank");
    });
  }

  // === NAVBAR SCROLL EFFECT ===
  const navbar = document.getElementById("navbar");
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScroll = scrollY;
  }, { passive: true });

  // =========================================
  // DRAG AND DROP BADGES WITH GRAVITY
  // =========================================
  const badges = document.querySelectorAll(".floating-badge");
  const heroWrapper = document.querySelector(".hero-name-wrapper");
  const heroSection = document.querySelector(".hero");

  let highestBadgeZIndex = 10;

  badges.forEach((badge, badgeIndex) => {
    let isDragging = false;
    let startX, startY;
    let currentX = 0, currentY = 0;
    let velocityX = 0, velocityY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    let lastMoveTime = 0;
    let gravityAnim = null;
    badge._isSettled = false;

    // Physics constants — tuned for natural feel
    const GRAVITY = 0.35;
    const BOUNCE_Y = 0.3;
    const BOUNCE_X = 0.4;
    const AIR_FRICTION = 0.995;
    const GROUND_FRICTION = 0.92;
    const MIN_BOUNCE_VEL = 1.5;
    const SETTLE_THRESHOLD = 0.2;

    badge.style.pointerEvents = "auto";
    badge.style.cursor = "grab";
    badge.style.userSelect = "none";
    badge.style.touchAction = "none";

    function getPointerPos(e) {
      if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    }

    function getRotation() {
      return 0; // All badges are now horizontal
    }

    function getBounds() {
      const heroCode = document.querySelector(".hero-code");
      const heroRect = heroSection.getBoundingClientRect();
      const badgeRect = badge.getBoundingClientRect();
      const badgeOriginalTop = badgeRect.top - currentY;
      const badgeOriginalLeft = badgeRect.left - currentX;
      
      // Ceiling: 3% of window height from the top of the website
      const ceilingAbsolute = heroRect.top + (window.innerHeight * 0.03);
      
      // Predicted X boundaries for collision
      const myAbsLeft = badgeOriginalLeft + currentX;
      const myAbsRight = myAbsLeft + badgeRect.width;

      // Base Floor: just above hero-code
      let floorAbsolute = heroRect.bottom;
      if (heroCode) {
        // 40px padding to account for the hero-code's initial translateY(20px) animation
        floorAbsolute = heroCode.getBoundingClientRect().top - 40;
      }

      // Check collision with other settled badges to stack on top of them
      badges.forEach(otherBadge => {
        if (otherBadge === badge) return;
        if (!otherBadge._isSettled) return; // Only stack on badges that have stopped falling

        const otherRect = otherBadge.getBoundingClientRect();
        
        // Horizontal overlap check
        const margin = 2; // small margin to allow sliding past closely
        const horizontalOverlap = (myAbsLeft < otherRect.right - margin) && (myAbsRight > otherRect.left + margin);
        
        if (horizontalOverlap) {
          // If there is horizontal overlap, this settled badge acts as a solid floor.
          // We always take the highest floor (smallest Y value).
          if (otherRect.top < floorAbsolute) {
            floorAbsolute = otherRect.top;
          }
        }
      });

      // Walls: edges of the website
      const leftAbsolute = heroRect.left;
      const rightAbsolute = heroRect.right;

      return {
        minY: ceilingAbsolute - badgeOriginalTop,
        maxY: floorAbsolute - badgeOriginalTop - badgeRect.height,
        minX: leftAbsolute - badgeOriginalLeft,
        maxX: rightAbsolute - badgeOriginalLeft - badgeRect.width
      };
    }

    function simulateGravity() {
      if (gravityAnim) cancelAnimationFrame(gravityAnim);

      function step() {
        // Gravity
        velocityY += GRAVITY;
        // Air resistance
        velocityX *= AIR_FRICTION;
        velocityY *= AIR_FRICTION;

        currentX += velocityX;
        currentY += velocityY;

        const bounds = getBounds();
        let onGround = false;

        // Floor collision
        if (currentY >= bounds.maxY) {
          currentY = bounds.maxY;
          onGround = true;
          if (Math.abs(velocityY) > MIN_BOUNCE_VEL) {
            velocityY = -velocityY * BOUNCE_Y;
          } else {
            velocityY = 0;
          }
          // Ground friction on X
          velocityX *= GROUND_FRICTION;
        }

        // Ceiling collision
        if (currentY < bounds.minY) {
          currentY = bounds.minY;
          velocityY = Math.abs(velocityY) * BOUNCE_Y;
        }

        // Wall collisions
        if (currentX > bounds.maxX) {
          currentX = bounds.maxX;
          velocityX = -Math.abs(velocityX) * BOUNCE_X;
        }
        if (currentX < bounds.minX) {
          currentX = bounds.minX;
          velocityX = Math.abs(velocityX) * BOUNCE_X;
        }

        const rot = getRotation();
        badge.style.transform = `translate(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px) rotate(${rot}deg)`;

        // Settled check
        const settled = onGround && Math.abs(velocityY) < SETTLE_THRESHOLD && Math.abs(velocityX) < SETTLE_THRESHOLD;
        if (!settled) {
          badge._isSettled = false;
          gravityAnim = requestAnimationFrame(step);
        } else {
          badge._isSettled = true;
          gravityAnim = null;
          velocityX = 0;
          velocityY = 0;
          currentY = bounds.maxY;
          badge.style.transform = `translate(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px) rotate(${rot}deg)`;
        }
      }

      gravityAnim = requestAnimationFrame(step);
    }

    function onPointerDown(e) {
      e.preventDefault();
      isDragging = true;
      badge._isSettled = false;
      if (gravityAnim) { cancelAnimationFrame(gravityAnim); gravityAnim = null; }

      const pos = getPointerPos(e);
      startX = pos.x - currentX;
      startY = pos.y - currentY;
      lastMouseX = pos.x;
      lastMouseY = pos.y;
      lastMoveTime = Date.now();
      velocityX = 0;
      velocityY = 0;

      highestBadgeZIndex++;
      badge.style.cursor = "grabbing";
      badge.style.zIndex = highestBadgeZIndex + 100;
      badge.style.transition = "none";
      badge.classList.add("dragging");

      document.addEventListener("mousemove", onPointerMove);
      document.addEventListener("mouseup", onPointerUp);
      document.addEventListener("touchmove", onPointerMove, { passive: false });
      document.addEventListener("touchend", onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const pos = getPointerPos(e);
      const now = Date.now();
      const dt = Math.max(now - lastMoveTime, 1);

      velocityX = (pos.x - lastMouseX) / dt * 16;
      velocityY = (pos.y - lastMouseY) / dt * 16;

      lastMouseX = pos.x;
      lastMouseY = pos.y;
      lastMoveTime = now;

      currentX = pos.x - startX;
      currentY = pos.y - startY;

      const rot = getRotation();
      badge.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rot}deg) scale(1.06)`;
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      badge.style.cursor = "grab";
      badge.style.zIndex = highestBadgeZIndex;
      badge.classList.remove("dragging");

      velocityX = Math.max(-12, Math.min(12, velocityX));
      velocityY = Math.max(-12, Math.min(12, velocityY));

      simulateGravity();

      document.removeEventListener("mousemove", onPointerMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchmove", onPointerMove);
      document.removeEventListener("touchend", onPointerUp);
    }

    badge.addEventListener("mousedown", onPointerDown);
    badge.addEventListener("touchstart", onPointerDown, { passive: false });

    // === DROP FROM TOP ON PAGE LOAD ===
    setTimeout(() => {
      badge.style.transition = "none";
      // Start at the ceiling
      currentY = getBounds().minY; 
      const rot = getRotation();
      badge.style.transform = `translate(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px) rotate(${rot}deg)`;
      
      // Initialize physics
      badge._isSettled = false;
      velocityX = (Math.random() - 0.5) * 2;
      velocityY = 0;
      
      simulateGravity();
    }, 400 + badgeIndex * 150);
    
    // Add window resize listener to recalculate floor and adjust badges if they are settled
    window.addEventListener('resize', () => {
      if (!isDragging && !gravityAnim) {
        currentY = getBounds().maxY;
        const rot = getRotation();
        badge.style.transform = `translate(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px) rotate(${rot}deg)`;
        badge._isSettled = true;
      }
    });
  });

  // =========================================
  // SCROLL REVEAL ANIMATIONS (Staggered)
  // =========================================
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children if it's a grid container
          const el = entry.target;
          el.classList.add("visible");

          // Stagger reveal for grid items inside
          const staggerItems = el.querySelectorAll(".stagger-child");
          staggerItems.forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.1}s`;
            child.classList.add("visible");
          });
        }
      });
    },
    { root: null, rootMargin: "0px 0px -80px 0px", threshold: 0.05 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Hero name reveal on load
  const nameLines = document.querySelectorAll(".name-line");
  nameLines.forEach((line, i) => {
    line.style.transitionDelay = `${i * 0.15}s`;
    setTimeout(() => line.classList.add("visible"), 100);
  });

  // Hero code reveal
  const heroCode = document.querySelector(".hero-code");
  if (heroCode) {
    setTimeout(() => heroCode.classList.add("visible"), 600);
  }

  // Status bar reveal
  const statusBar = document.querySelector(".hero-status-bar");
  if (statusBar) {
    setTimeout(() => statusBar.classList.add("visible"), 800);
  }

  // =========================================
  // PROJECT MOCKUP 3D TILT ON HOVER
  // =========================================
  const mockups = document.querySelectorAll(".project-mockup");

  mockups.forEach((mockup) => {
    const browser = mockup.querySelector(".mockup-browser");
    if (!browser) return;

    mockup.addEventListener("mousemove", (e) => {
      const rect = mockup.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 20; // -10 to 10 deg
      const rotateX = (0.5 - y) * 15; // -7.5 to 7.5 deg

      browser.style.transition = "transform 0.1s ease-out";
      browser.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });

    mockup.addEventListener("mouseleave", () => {
      const isReverse = mockup.closest(".project-case")?.classList.contains("reverse");
      browser.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      browser.style.transform = isReverse
        ? "rotateY(8deg) rotateX(4deg)"
        : "rotateY(-8deg) rotateX(4deg)";
    });
  });

  // =========================================
  // ABOUT CARD MODALS
  // =========================================
  const modalOverlay = document.getElementById("about-modal-overlay");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  function openModal(templateId) {
    const template = document.getElementById("modal-" + templateId);
    if (!template) return;
    // Clone template content into modal body
    modalBody.innerHTML = "";
    modalBody.appendChild(template.content.cloneNode(true));
    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Open on Detail button click
  document.querySelectorAll(".btn-detail").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal(btn.dataset.modal);
    });
  });

  // Close on X button
  if (modalClose) modalClose.addEventListener("click", closeModal);

  // Close on overlay click (outside modal)
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // =========================================
  // TIMELINE CARD HOVER TILT
  // =========================================
  const timelineCards = document.querySelectorAll(".timeline-card");

  timelineCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 6;
      const rotateX = (0.5 - y) * 6;

      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "none";
    });
  });

  // =========================================
  // MAGNETIC BUTTONS
  // =========================================
  const magneticBtns = document.querySelectorAll(".btn-submit, .btn-resume, .social-btn, .theme-toggle, .btn-top");

  magneticBtns.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
      btn.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.transition = "transform 0.15s ease-out";
    });
  });

  // =========================================
  // SMOOTH SCROLL FOR NAV LINKS
  // =========================================
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // =========================================
  // TEXT SCRAMBLE EFFECT ON SECTION TITLES
  // =========================================
  const scrambleTargets = document.querySelectorAll(".section-title, .contact-title");
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const scrambleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.scrambled) {
          entry.target.dataset.scrambled = "true";
          scrambleText(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  scrambleTargets.forEach((el) => scrambleObserver.observe(el));

  function scrambleText(el) {
    const original = el.textContent;
    const length = original.length;
    let iterations = 0;

    const interval = setInterval(() => {
      el.textContent = original
        .split("")
        .map((char, i) => {
          if (char === " " || char === "\n") return char;
          if (i < iterations) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      iterations += 1;
      if (iterations > length) {
        clearInterval(interval);
        el.textContent = original;
      }
    }, 30);
  }

  // =========================================
  // TYPEWRITER CODE EFFECT (Continuous)
  // =========================================
  const typewriterEl = document.getElementById("typewriter-code");
  if (typewriterEl) {
    const codeLines = [
      'const INITIALIZE_SYSTEM = async () => { const Developer = { ID: "MUHAMMAD_FAKHRI", Origin: "Cirebon_Indonesia", Role: "Software_Engineer" }; await System.load("React", "Laravel", "Tailwind_CSS", "Flutter"); if (Project.isComplex) return Developer.solveWith(Logic + Creativity); }',
      'const buildProject = (client) => { const stack = ["React", "Laravel", "MySQL"]; const design = Figma.prototype(); return deploy(stack.map(t => optimize(t, client.needs))); }',
      'async function solveChallenge(problem) { const analysis = await deepThink(problem); const solution = analysis.map(a => code(a)); return solution.filter(s => s.isElegant && s.isScalable); }',
      'const Developer = { name: "Muhammad Fakhri", skills: ["React", "Laravel", "Flutter", "TypeScript"], passion: "Building scalable web apps", status: "Open to work" };',
      'export default function Portfolio() { const [projects, setProjects] = useState([]); useEffect(() => { fetchProjects().then(data => setProjects(data)); }, []); return <ProjectGrid items={projects} />; }'
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function typeStep() {
      const currentLine = codeLines[lineIndex];

      if (isPaused) {
        isPaused = false;
        isDeleting = true;
        setTimeout(typeStep, 50);
        return;
      }

      if (!isDeleting) {
        // Typing
        charIndex++;
        typewriterEl.textContent = currentLine.substring(0, charIndex);

        if (charIndex >= currentLine.length) {
          // Pause before deleting
          isPaused = true;
          setTimeout(typeStep, 2500);
          return;
        }
        setTimeout(typeStep, 25 + Math.random() * 35);
      } else {
        // Deleting
        charIndex--;
        typewriterEl.textContent = currentLine.substring(0, charIndex);

        if (charIndex <= 0) {
          isDeleting = false;
          lineIndex = (lineIndex + 1) % codeLines.length;
          setTimeout(typeStep, 400);
          return;
        }
        setTimeout(typeStep, 15);
      }
    }

    // Start typewriter after hero code section becomes visible
    setTimeout(() => {
      typeStep();
    }, 800);
  }
});
