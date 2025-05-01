document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const sidebar = document.querySelector(".sidebar")
  const overlay = document.createElement("div")
  overlay.className = "menu-overlay"
  document.body.appendChild(overlay)

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active")

    if (sidebar.classList.contains("active")) {
      overlay.style.display = "block"
      setTimeout(() => {
        overlay.style.opacity = "0.5"
      }, 10)
      document.body.style.overflow = "hidden"
    } else {
      overlay.style.opacity = "0"
      setTimeout(() => {
        overlay.style.display = "none"
      }, 300)
      document.body.style.overflow = ""
    }
  })

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active")
    overlay.style.opacity = "0"
    setTimeout(() => {
      overlay.style.display = "none"
    }, 300)
    document.body.style.overflow = ""
  })

  // Style the overlay
  overlay.style.position = "fixed"
  overlay.style.top = "0"
  overlay.style.left = "0"
  overlay.style.right = "0"
  overlay.style.bottom = "0"
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
  overlay.style.zIndex = "90"
  overlay.style.display = "none"
  overlay.style.opacity = "0"
  overlay.style.transition = "opacity 0.3s ease"

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Elements to animate on scroll
  const animateElements = document.querySelectorAll(".feature-card, .model-card, .step-card, .section-title")
  animateElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Add animate class when element is in viewport
  document.addEventListener("scroll", () => {
    animateElements.forEach((el) => {
      if (isInViewport(el) && !el.classList.contains("animate")) {
        el.classList.add("animate")
      }
    })
  })

  // Helper function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0 &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
      rect.right >= 0
    )
  }

  // Add animate class to elements that are already in viewport
  animateElements.forEach((el) => {
    if (isInViewport(el)) {
      el.classList.add("animate")
    }
  })

  // Style for animated elements
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <style>
      .animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    </style>
  `,
  )

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })
})
