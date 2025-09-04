// Initialize animations
      AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
      });

      // Initialize feather icons
      feather.replace();

      // Mobile menu toggle
      document
        .getElementById("mobileMenuButton")
        .addEventListener("click", function () {
          const menu = document.getElementById("mobileMenu");
          menu.classList.toggle("hidden");
        });

      // Theme functionality
      const themeDropdownButton = document.getElementById(
        "themeDropdownButton"
      );
      const themeDropdown = document.getElementById("themeDropdown");
      const body = document.body;

      // Theme toggle functionality
      themeDropdownButton.addEventListener("click", function () {
        themeDropdown.classList.toggle("hidden");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", function (event) {
        if (
          !themeDropdownButton.contains(event.target) &&
          !themeDropdown.contains(event.target)
        ) {
          themeDropdown.classList.add("hidden");
        }
      });

      // Set theme function
      function setTheme(theme) {
        if (theme === "system") {
          // Check system preference
          if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            body.classList.remove("dark");
            body.classList.add("light");
          } else {
            body.classList.remove("light");
            body.classList.add("dark");
          }
          localStorage.setItem("theme", "system");
        } else {
          body.classList.remove("light", "dark");
          body.classList.add(theme);
          localStorage.setItem("theme", theme);
        }

        // Update icons and close dropdown
        themeDropdown.classList.add("hidden");
        feather.replace();
      }

      // Theme selection handlers
      document.querySelectorAll("[data-theme]").forEach((button) => {
        button.addEventListener("click", function () {
          setTheme(this.getAttribute("data-theme"));
        });
      });

      // Check for saved theme preference or respect OS preference
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
        setTheme("light");
      } else {
        setTheme("dark");
      }

      // Listen for system theme changes
      window
        .matchMedia("(prefers-color-scheme: light)")
        .addEventListener("change", (e) => {
          if (localStorage.getItem("theme") === "system") {
            if (e.matches) {
              body.classList.remove("dark");
              body.classList.add("light");
            } else {
              body.classList.remove("light");
              body.classList.add("dark");
            }
          }
        });

      // Testimonial slider
      const testimonials = document.querySelectorAll(".testimonial-slide");
      const dots = document.querySelectorAll(".testimonial-dot");
      let currentTestimonial = 0;

      function showTestimonial(n) {
        testimonials.forEach((testimonial) =>
          testimonial.classList.remove("active")
        );
        dots.forEach((dot) => dot.classList.remove("bg-opacity-100"));

        currentTestimonial = (n + testimonials.length) % testimonials.length;

        testimonials[currentTestimonial].classList.add("active");
        dots[currentTestimonial].classList.add("bg-opacity-100");
      }

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => showTestimonial(index));
      });

      // Auto rotate testimonials
      setInterval(() => {
        showTestimonial(currentTestimonial + 1);
      }, 5000);

      // Initialize dots opacity
      dots[0].classList.add("bg-opacity-100");

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();

          const targetId = this.getAttribute("href");
          if (targetId === "#") return;

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: "smooth",
            });

            // Close mobile menu if open
            document.getElementById("mobileMenu").classList.add("hidden");
          }
        });
      });

      // Portfolio data - using your project images
      const portfolioItems = [];
      for (let i = 1; i <= 24; i++) {
        portfolioItems.push({
          id: i,
          title: `Project ${i}`,
          category:
            i % 3 === 0 ? "solar" : i % 3 === 1 ? "electrical" : "maintenance",
          image: `images/project${i}.jpg`,
        });
      }

      // Initialize carousel
      function initCarousel() {
        const carouselTrack = document.querySelector(".carousel-track");
        const carouselNav = document.querySelector(".carousel-nav");

        // Clear existing content
        carouselTrack.innerHTML = "";
        carouselNav.innerHTML = "";

        // Add first 3 items to carousel
        const carouselItems = portfolioItems.slice(0, 3);

        carouselItems.forEach((item, index) => {
          // Create slide
          const slide = document.createElement("div");
          slide.className = "carousel-slide";
          slide.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                        <h3 class="text-xl font-bold text-white">${item.title}</h3>
                    </div>
                `;
          carouselTrack.appendChild(slide);

          // Create dot
          const dot = document.createElement("div");
          dot.className = `carousel-dot ${index === 0 ? "active" : ""}`;
          dot.dataset.index = index;
          dot.addEventListener("click", () => showSlide(index));
          carouselNav.appendChild(dot);
        });

        // Set up carousel navigation
        let currentSlide = 0;

        function showSlide(index) {
          currentSlide = index;
          carouselTrack.style.transform = `translateX(-${index * 100}%)`;

          // Update active dot
          document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
            if (i === index) {
              dot.classList.add("active");
            } else {
              dot.classList.remove("active");
            }
          });
        }

        // Previous button
        document
          .querySelector(".carousel-btn.prev")
          .addEventListener("click", () => {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) newIndex = carouselItems.length - 1;
            showSlide(newIndex);
          });

        // Next button
        document
          .querySelector(".carousel-btn.next")
          .addEventListener("click", () => {
            let newIndex = currentSlide + 1;
            if (newIndex >= carouselItems.length) newIndex = 0;
            showSlide(newIndex);
          });

        // Auto slide
        setInterval(() => {
          let newIndex = currentSlide + 1;
          if (newIndex >= carouselItems.length) newIndex = 0;
          showSlide(newIndex);
        }, 5000);
      }

      // Initialize portfolio grid
      function initPortfolioGrid(limit = 6) {
        const portfolioGrid = document.querySelector(".portfolio-grid");
        portfolioGrid.innerHTML = "";

        const itemsToShow = portfolioItems.slice(0, limit);

        itemsToShow.forEach((item) => {
          const portfolioItem = document.createElement("div");
          portfolioItem.className = "portfolio-item";
          portfolioItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="portfolio-image">
                    <div class="portfolio-overlay">
                        <h3 class="text-lg font-bold text-white dark:text-neutral-dark">${item.title}</h3>
                    </div>
                `;

          // Add click event to open modal
          portfolioItem.addEventListener("click", () => {
            openModal(item.image, item.title);
          });

          portfolioGrid.appendChild(portfolioItem);
        });
      }

      // View more functionality
      let showingAll = false;
      const viewMoreBtn = document.getElementById("viewMoreBtn");

      viewMoreBtn.addEventListener("click", () => {
        if (showingAll) {
          initPortfolioGrid(6);
          viewMoreBtn.textContent = "View More Projects";
          showingAll = false;
        } else {
          initPortfolioGrid(portfolioItems.length);
          viewMoreBtn.textContent = "View Less Projects";
          showingAll = true;
        }
      });

      // Image Modal functionality
      const imageModal = document.getElementById("imageModal");
      const modalImage = document.getElementById("modalImage");
      const modalTitle = document.getElementById("modalTitle");
      const modalClose = document.getElementById("modalClose");

      function openModal(imageSrc, title) {
        modalImage.src = imageSrc;
        modalTitle.textContent = title;
        imageModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
      }

      function closeModal() {
        imageModal.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable scrolling
      }

      modalClose.addEventListener("click", closeModal);

      // Close modal when clicking outside the image
      imageModal.addEventListener("click", (e) => {
        if (e.target === imageModal) {
          closeModal();
        }
      });

      // Close modal with Escape key
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && imageModal.classList.contains("active")) {
          closeModal();
        }
      });

      // Initialize everything when DOM is loaded
      document.addEventListener("DOMContentLoaded", function () {
        initCarousel();
        initPortfolioGrid();

        // Reinitialize feather icons after dynamic content is added
        feather.replace();
      });