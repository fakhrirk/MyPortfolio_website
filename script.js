document.addEventListener("DOMContentLoaded", () => {

// Partials Loader
async function loadPartials(elementId, url) {
  try {
    const response = await fetch(url)
    if (!response.oke){
      throw new Error (`Gagal untuk memuat ${url}: ${response.statusText}`)
    }
    const htmlContent = await response.text()
    const targetElement = document.getElementById(elementId);
    if (targetElement) {
      targetElement.innerHTML = htmlContent;
    }
  } catch (error) {
    console.error("Error loading partial:", error);
  }
}


loadPartials("dynamic-header", "partials/header.html")
loadPartials("dynamic-footer", "partials/footer.html")

  // Typewriter effect for hero section
  const typewriterText = document.getElementById("typewriter-text")
  const commands = ["run portfolio.exe", "loading profile...", "initializing skills...", "ready to code!"]

  let commandIndex = 0
  let charIndex = 0
  let isDeleting = false

  function typeWriter() {
    const currentCommand = commands[commandIndex]

    if (isDeleting) {
      typewriterText.textContent = currentCommand.substring(0, charIndex - 1)
      charIndex--
    } else {
      typewriterText.textContent = currentCommand.substring(0, charIndex + 1)
      charIndex++
    }

    if (!isDeleting && charIndex === currentCommand.length) {
      setTimeout(() => (isDeleting = true), 2000)
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false
      commandIndex = (commandIndex + 1) % commands.length
    }

    const typingSpeed = isDeleting ? 50 : 100
    setTimeout(typeWriter, typingSpeed)
  }

  typeWriter()

  function initCardParallax() {
    const cards = document.querySelectorAll(".retro-card, .project-card, .tech-card")

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -10 // Max 10 degrees
        const rotateY = ((x - centerX) / centerX) * 10 // Max 10 degrees

        card.style.transform = `
          translateY(-10px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          scale(1.02)
        `
      })

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) rotateX(0) rotateY(0) scale(1)"
      })
    })
  }

  function initMonitorParallax() {
    const monitor = document.querySelector(".crt-monitor")
    if (!monitor) return

    monitor.addEventListener("mousemove", (e) => {
      const rect = monitor.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateY = ((x - centerX) / centerX) * -15 // Max 15 degrees
      const rotateX = ((y - centerY) / centerY) * 10 // Max 10 degrees

      monitor.style.transform = `
        translateZ(20px) 
        rotateY(${rotateY}deg) 
        rotateX(${rotateX}deg)
        scale(1.05)
      `
    })

    monitor.addEventListener("mouseleave", () => {
      monitor.style.transform = "translateZ(0) rotateY(0) rotateX(0) scale(1)"
    })
  }

  // Initialize remaining parallax effects (hover only)
  initCardParallax()
  initMonitorParallax()

  // Smooth scrolling for navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Glitch effect on scroll
  const glitchElements = document.querySelectorAll(".glitch")

  function addGlitchEffect() {
    glitchElements.forEach((element) => {
      if (isElementInViewport(element)) {
        element.style.animation = "glitch-1 0.3s infinite"
        setTimeout(() => {
          element.style.animation = ""
        }, 1000)
      }
    })
  }

  // Check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  // Add scroll event listener for glitch effects
  let scrollTimeout
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(addGlitchEffect, 100)
  })

  // Retro button click effects
  document.querySelectorAll(".retro-btn").forEach((button) => {
    button.addEventListener("click", function () {
      this.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)
    })
  })

  // Project card hover effects
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const scanlines = this.querySelector(".project-scanlines")
      if (scanlines) {
        scanlines.style.animation = "flicker 0.5s infinite"
      }
    })

    card.addEventListener("mouseleave", function () {
      const scanlines = this.querySelector(".project-scanlines")
      if (scanlines) {
        scanlines.style.animation = ""
      }
    })
  })

  // Add flicker animation
  const style = document.createElement("style")
  style.textContent = `
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
    `
  document.head.appendChild(style)

  // Terminal cursor blink
  const cursors = document.querySelectorAll(".cursor")
  cursors.forEach((cursor) => {
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0"
    }, 500)
  })

  // Add CRT screen flicker effect
  const screens = document.querySelectorAll(".screen")
  screens.forEach((screen) => {
    setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance
        screen.style.filter = "contrast(1.5) brightness(1.2)"
        setTimeout(() => {
          screen.style.filter = "contrast(1.2) brightness(0.9)"
        }, 100)
      }
    }, 3000)
  })

  // BARU: Logika untuk Hamburger Menu
  const hamburger = document.querySelector(".hamburger")
  const mobileNav = document.querySelector(".mobile-nav")
  const mobileLinks = document.querySelectorAll(".mobile-link")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("is-active")
    mobileNav.classList.toggle("is-active")
  })

  // BARU: Tutup menu saat link di-klik
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("is-active")
      mobileNav.classList.remove("is-active")
    })
  })

  // Initialize scroll entrance parallax (JS-only, no frameworks)
  ;(function initScrollParallax() {
    const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // HERO background layers parallax (depth by scroll)
    const hero = document.querySelector(".hero")
    const heroLayers = hero ? hero.querySelectorAll(".parallax-layer") : []

    // Elements that will animate on entrance
    const candidates = document.querySelectorAll(".parallax-element")
    // Skip elements that use strong hover transforms to avoid conflicts
    const targets = Array.from(candidates).filter(
      (el) =>
        !el.classList.contains("project-card") &&
        !el.classList.contains("tech-card") &&
        !el.closest(".project-card") &&
        !el.closest(".tech-card") &&
        !el.closest(".retro-card"),
    )

    // If user prefers reduced motion: show immediately and apply minimal movement to layers
    if (prefersReduced) {
      targets.forEach((el) => {
        el.style.opacity = "1"
        el.style.transform = "none"
      })
      heroLayers.forEach((layer) => {
        layer.style.transform = "none"
      })
      return
    }

    // Optional: stagger groups for sequential entrance per section
    // Group by data-stagger value; default no stagger
    const groupMap = new Map()
    targets.forEach((el) => {
      const key = el.getAttribute("data-stagger") || "__none__"
      if (!groupMap.has(key)) groupMap.set(key, [])
      groupMap.get(key).push(el)
    })
    // Assign staggerIndex per group based on DOM order
    groupMap.forEach((arr) => {
      arr.forEach((el, idx) => {
        el.__staggerIndex = idx
      })
    })

    // Prepare initial styles
    targets.forEach((el) => {
      el.style.willChange = "transform, opacity"
      el.style.opacity = "0"
    })
    heroLayers.forEach((layer) => {
      layer.style.willChange = "transform"
    })

    const active = new Set()
    let rafId = null
    let lastY = window.scrollY || window.pageYOffset
    let velY = 0 // smoothed scroll velocity

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    // Observe elements entering the viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          if (entry.isIntersecting) {
            const axis = (el.getAttribute("data-axis") || "y").toLowerCase()
            const distance = Number.parseFloat(el.getAttribute("data-distance") || "80")
            const scaleFrom = Number.parseFloat(el.getAttribute("data-scale-from") || "0.96")
            const rotateMax = Number.parseFloat(el.getAttribute("data-rotate") || "6")
            const follow = el.hasAttribute("data-follow") // keep subtle parallax after reveal
            const followDistance = Number.parseFloat(el.getAttribute("data-follow-distance") || "8")
            const staggerStep = Number.parseFloat(el.getAttribute("data-stagger-step") || "0.12") // fraction progress per index

            el.__parallaxCfg = { axis, distance, scaleFrom, rotateMax, follow, followDistance, staggerStep }

            // start offset
            const initial =
              axis === "x"
                ? `translate3d(${distance}px, 0, 0) scale(${scaleFrom})`
                : `translate3d(0, ${distance}px, 0) scale(${scaleFrom})`
            el.style.transform = initial
            el.style.opacity = "0"

            active.add(el)
            if (!rafId) rafId = requestAnimationFrame(tick)
          } else {
            // if not finished, reset; if finished and no follow, clear transforms
            if (!el.__parallaxDone) {
              el.style.opacity = "0"
              el.style.transform = ""
            }
            if (!el.__parallaxFollow) {
              active.delete(el)
            }
          }
        })
      },
      {
        root: null,
        rootMargin: "0px 0px -10% 0px",
        threshold: 0,
      },
    )

    targets.forEach((el) => io.observe(el))

    function updateHeroLayers() {
      if (!hero || heroLayers.length === 0) return
      const rect = hero.getBoundingClientRect()
      const h = rect.height || hero.offsetHeight || 1
      // progress of hero in viewport: 0 at top entering, to 1 near past
      const pct = clamp((window.innerHeight - rect.top) / (window.innerHeight + h), 0, 1)
      heroLayers.forEach((layer) => {
        const speed = Number.parseFloat(layer.getAttribute("data-speed") || "0.2")
        const y = (pct - 0.5) * 2 * 40 * speed // max ~40px shift scaled by speed
        layer.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`
      })
    }

    function tick() {
      const y = window.scrollY || window.pageYOffset
      const dy = y - lastY
      lastY = y
      velY = velY * 0.9 + dy * 0.1

      updateHeroLayers()

      const vh = window.innerHeight || document.documentElement.clientHeight
      active.forEach((el) => {
        const rect = el.getBoundingClientRect()

        // Entrance progress from bottom->upper third of screen
        const start = vh * 0.9
        const end = vh * 0.25
        const raw = (start - rect.top) / (start - end)

        // Apply stagger per group index (delays entrance progressively)
        const cfg = el.__parallaxCfg || {}
        const idx = el.__staggerIndex || 0
        const staggeredRaw = raw - idx * (cfg.staggerStep || 0)
        const progress = clamp(staggeredRaw, 0, 1)
        const eased = easeOutCubic(progress)

        const axis = cfg.axis || "y"
        const distance = cfg.distance ?? 80
        const scaleFrom = cfg.scaleFrom ?? 0.96

        // interactive tilt based on scroll velocity (subtle and decays with progress)
        const tiltMax = cfg.rotateMax ?? 6
        const tilt = clamp((velY / 60) * tiltMax, -tiltMax, tiltMax) * (1 - eased)

        // translate remaining distance
        const translateRemain = (1 - eased) * distance
        const translate =
          axis === "x" ? `translate3d(${translateRemain}px, 0, 0)` : `translate3d(0, ${translateRemain}px, 0)`
        const scale = scaleFrom + (1 - scaleFrom) * eased
        const rotate = axis === "x" ? `rotateY(${tilt}deg)` : `rotateX(${tilt}deg)`

        el.style.transform = `${translate} ${rotate} scale(${scale})`
        el.style.opacity = String(eased)

        // When fully revealed
        if (progress >= 1) {
          el.__parallaxDone = true
          if (cfg.follow) {
            // keep a subtle follow/scrub effect while in viewport
            el.__parallaxFollow = true
            const inViewTop = clamp(rect.top / vh, 0, 1)
            // small micro parallax based on element relative position + velocity
            const micro = (inViewTop - 0.5) * 2 * (cfg.followDistance ?? 8)
            const microTilt = clamp((velY / 80) * (tiltMax * 0.6), -tiltMax * 0.6, tiltMax * 0.6)
            const microTranslate =
              axis === "x" ? `translate3d(${micro.toFixed(2)}px, 0, 0)` : `translate3d(0, ${micro.toFixed(2)}px, 0)`
            const microRotate =
              axis === "x" ? `rotateY(${microTilt.toFixed(2)}deg)` : `rotateX(${microTilt.toFixed(2)}deg)`
            el.style.transform = `${microTranslate} ${microRotate} scale(1)`
            el.style.opacity = "1"

            // remove follow when far out of view
            if (rect.top > vh * 1.2 || rect.bottom < -vh * 0.2) {
              el.__parallaxFollow = false
              active.delete(el)
              el.style.transform = "translate3d(0, 0, 0) scale(1)"
              el.style.opacity = "1"
            }
          } else {
            // finalize and stop observing
            el.style.transform = "translate3d(0, 0, 0) scale(1)"
            el.style.opacity = "1"
            active.delete(el)
          }
        }
      })

      if (active.size > 0) {
        rafId = requestAnimationFrame(tick)
      } else {
        rafId = null
      }
    }
  })()
  
})

// Utility function for smooth scrolling to sections
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Add retro loading effect
window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease-in-out"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})
