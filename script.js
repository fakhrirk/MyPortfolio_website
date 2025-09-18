document.addEventListener("DOMContentLoaded", () => {
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



// function emailController() {
//   var emailTujuan = "dhehanprawira@gmail.com"; // Ganti dengan alamat email tujuan
//   var subjek = "Pesan dari Tombol";
//   var isiPesan = "Halo,\n\nSaya ingin mengirim pesan ini.";

//   window.location.href = "mailto:" + emailTujuan + "?subject=" + encodeURIComponent(subjek) + "&body=" + encodeURIComponent(isiPesan);
// }