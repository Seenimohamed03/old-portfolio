(function ($) {
  "use strict";

  // Custom easing function for smooth scrolling
  $.easing.easeInOutCubic = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  };

  // loader
  var loader = function () {
    setTimeout(function () {
      if ($("#loader").length > 0) {
        $("#loader").removeClass("show");
      }
    }, 1);
  };
  loader();

  // Initiate the wowjs
  new WOW().init();

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Optimized Navbar with Throttled Scroll Events
  let lastScrollTop = 0;
  let navbar = $(".navbar");
  let scrollThreshold = 50;
  let ticking = false;

  // Ensure navbar is visible on page load
  navbar.addClass("navbar-visible");

  // Throttled scroll function for better performance
  function updateNavbar() {
    let scrollTop = $(window).scrollTop();

    // Add sticky class when scrolled
    if (scrollTop > scrollThreshold) {
      navbar.addClass("nav-sticky");

      // Hide/Show navbar based on scroll direction
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide navbar
        navbar.addClass("navbar-hidden").removeClass("navbar-visible");
      } else {
        // Scrolling up - show navbar
        navbar.addClass("navbar-visible").removeClass("navbar-hidden");
      }
    } else {
      // At top of page - remove sticky and ensure navbar is visible
      navbar.removeClass("nav-sticky navbar-hidden").addClass("navbar-visible");
    }

    lastScrollTop = scrollTop;
    ticking = false;
  }

  // Throttled scroll event
  $(window).scroll(function () {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // Modern navbar link effects
  $(".navbar-nav .nav-link").hover(
    function () {
      // Mouse enter
      $(this).addClass("nav-link-hover");
    },
    function () {
      // Mouse leave
      $(this).removeClass("nav-link-hover");
    }
  );

  // Optimized active section detection with better positioning
  let sectionTicking = false;

  function updateActiveSection() {
    let scrollPos = $(document).scrollTop();
    let windowHeight = $(window).height();
    let currentSection = null;

    // Check each section to find the current one
    $(".navbar-nav .nav-link").each(function () {
      let currLink = $(this);
      let refElement = $(currLink.attr("href"));
      if (refElement.length && refElement.offset()) {
        let elementTop = refElement.offset().top;
        let elementBottom = elementTop + refElement.height();

        // More precise detection with fixed offsets
        if (scrollPos + 150 >= elementTop && scrollPos < elementBottom) {
          currentSection = currLink;
        }
      }
    });

    // Update active state only if changed
    if (currentSection && !currentSection.hasClass("active")) {
      $(".navbar-nav .nav-link").removeClass("active");
      currentSection.addClass("active");
    }

    sectionTicking = false;
  }

  // Throttled scroll event for active section
  $(window).scroll(function () {
    if (!sectionTicking) {
      requestAnimationFrame(updateActiveSection);
      sectionTicking = true;
    }
  });

  // Enhanced Smooth scrolling on the navbar links
  $(".navbar-nav a").on("click", function (event) {
    if (this.hash !== "") {
      event.preventDefault();

      // Show navbar when clicking navigation
      navbar.addClass("navbar-visible").removeClass("navbar-hidden");

      let target = $(this.hash);
      let offsetTop;

      // Calculate proper offset based on section with fixed positioning
      if (this.hash === "#home") {
        offsetTop = 0; // Home section starts at top
      } else {
        // Fixed offset calculation for consistent positioning
        let fixedNavbarHeight = 70; // Fixed height for consistent calculation
        offsetTop = target.offset().top - fixedNavbarHeight;

        // Special adjustments for specific sections
        switch (this.hash) {
          case "#about":
            offsetTop = target.offset().top - 80;
            break;
          case "#service":
            offsetTop = target.offset().top - 90;
            break;
          case "#experience":
            offsetTop = target.offset().top - 80;
            break;
          case "#contact":
            offsetTop = target.offset().top - 100;
            break;
          default:
            offsetTop = target.offset().top - 80;
        }
      }

      // Fast smooth scroll with optimized timing
      $("html, body").stop().animate(
        {
          scrollTop: offsetTop,
        },
        600, // Further reduced to 600ms for faster response
        "easeInOutCubic"
      );

      // Update active states immediately
      $(".navbar-nav .active").removeClass("active");
      $(this).addClass("active");

      // Close mobile menu if open
      if ($(".navbar-collapse").hasClass("show")) {
        $(".navbar-toggler").click();
      }
    }
  });

  // Typed Initiate
  if ($(".hero .hero-text h2").length == 1) {
    var typed_strings = $(".hero .hero-text .typed-text").text();
    var typed = new Typed(".hero .hero-text h2", {
      strings: typed_strings.split(", "),
      typeSpeed: 100,
      backSpeed: 20,
      smartBackspace: false,
      loop: true,
    });
  }

  // Skills
  $(".skills").waypoint(
    function () {
      $(".progress .progress-bar").each(function () {
        $(this).css("width", $(this).attr("aria-valuenow") + "%");
      });
    },
    { offset: "80%" }
  );

  // Contact Form Handling
  $("#contactForm").on("submit", function (event) {
    event.preventDefault();

    // Get form data
    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const message = $("#message").val().trim();

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    // Create mailto link with form data
    const subject = `Contact from ${firstName} ${lastName}`;
    const body = `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:sseenimohamed2003@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Show success message and reset form
    showMessage(
      "Email client opened! Please send the email to complete your message.",
      "success"
    );
    $("#contactForm")[0].reset();
  });

  // Function to show messages
  function showMessage(message, type) {
    const successDiv = $("#success");
    successDiv.html(`
      <div class="alert alert-${
        type === "success" ? "success" : "danger"
      } alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      successDiv.find(".alert").fadeOut();
    }, 5000);
  }
})(jQuery);
