// West Africa Pumping Services - site behaviour (no dependencies)
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  // Mobile menu
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        document.body.style.overflow = "";
      }
    });
  }

  // Header turns solid after the hero on the home page
  if (header && !header.classList.contains("solid")) {
    var onScroll = function () {
      header.classList.toggle("solid", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Pump range rail buttons
  var rail = document.querySelector("[data-rail]");
  if (rail) {
    var step = function (dir) {
      var card = rail.querySelector(".pcard");
      var amount = card ? card.getBoundingClientRect().width + 16 : 320;
      rail.scrollBy({ left: dir * amount, behavior: "smooth" });
    };
    var prev = document.querySelector("[data-rail-prev]");
    var next = document.querySelector("[data-rail-next]");
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
  }

  // Count-up for key figures (final value is already in the HTML)
  var counters = document.querySelectorAll("[data-count]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (counters.length && "IntersectionObserver" in window && !reduce) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      var start = null;
      var dur = 1400;
      var tick = function (ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(tick);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }

  // Contact form: opens the visitor's email app with the message filled in
  var form = document.getElementById("quote-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var subject = (data.get("subject") || "").toString().trim() || "Enquiry from wapsltd.com";
      var body = "Name: " + data.get("name") + "\nEmail: " + data.get("email") + "\n\n" + data.get("message");
      window.location.href = "mailto:info@wapsltd.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  // Footer year
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
