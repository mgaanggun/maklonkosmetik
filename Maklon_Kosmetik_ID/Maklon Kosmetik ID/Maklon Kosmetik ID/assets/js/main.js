/**
* Template Name: Stratify
* Fast load & instant rendering optimizations for Maklon Kosmetik ID
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader) return;
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  if (document.readyState !== 'loading') {
    toggleScrolled();
  } else {
    document.addEventListener('DOMContentLoaded', toggleScrolled);
  }

  /**
   * Mobile nav toggle & dropdown handling
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    const body = document.querySelector('body');
    body.classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  // Handle dropdown toggles on mobile & desktop
  document.addEventListener('click', function(e) {
    const toggleBtn = e.target.closest('.mobile-nav-toggle');
    if (toggleBtn && !mobileNavToggleBtn) {
      mobileNavToogle();
      return;
    }

    const dropdownLink = e.target.closest('.navmenu .dropdown > a');
    if (dropdownLink) {
      const isMobile = window.innerWidth < 1200 || document.querySelector('.mobile-nav-active');
      if (isMobile) {
        const submenu = dropdownLink.nextElementSibling;
        if (submenu && submenu.tagName === 'UL') {
          e.preventDefault();
          dropdownLink.classList.toggle('active');
          submenu.classList.toggle('dropdown-active');
        }
      }
    } else {
      const regularNav = e.target.closest('#navmenu a:not(.dropdown > a)');
      if (regularNav && document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    }
  });

  /**
   * Preloader - Remove instantly
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    preloader.remove();
  }

  /**
   * Scroll top button
   */
  function toggleScrollTop() {
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }

  document.addEventListener('click', function(e) {
    const scrollTopBtn = e.target.closest('.scroll-top');
    if (scrollTopBtn) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });

  if (document.readyState !== 'loading') {
    toggleScrollTop();
  } else {
    document.addEventListener('DOMContentLoaded', toggleScrollTop);
  }
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init (Instant DOMContentLoaded Execution)
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 300,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }

  if (document.readyState !== 'loading') {
    aosInit();
  } else {
    document.addEventListener('DOMContentLoaded', aosInit);
  }

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    if (typeof imagesLoaded !== 'undefined' && typeof Isotope !== 'undefined') {
      imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
        initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
          itemSelector: '.isotope-item',
          layoutMode: layout,
          filter: filter,
          sortBy: sort
        });
      });
    }

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        if (initIsotope) {
          initIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
        }
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;
      let config = JSON.parse(configEl.innerHTML.trim());

      if (config.pagination && typeof config.pagination.el === 'string') {
        const pagEl = swiperElement.querySelector(config.pagination.el);
        if (pagEl) config.pagination.el = pagEl;
      }
      if (config.navigation) {
        if (typeof config.navigation.nextEl === 'string') {
          const next = swiperElement.querySelector(config.navigation.nextEl);
          if (next) config.navigation.nextEl = next;
        }
        if (typeof config.navigation.prevEl === 'string') {
          const prev = swiperElement.querySelector(config.navigation.prevEl);
          if (prev) config.navigation.prevEl = prev;
        }
      }

      if (swiperElement.classList.contains("swiper-tab")) {
        if (typeof initSwiperWithCustomPagination === 'function') {
          initSwiperWithCustomPagination(swiperElement, config);
        }
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  if (document.readyState !== 'loading') {
    initSwiper();
  } else {
    document.addEventListener('DOMContentLoaded', initSwiper);
  }

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  function handleHashScroll() {
    if (window.location.hash) {
      let section = document.querySelector(window.location.hash);
      if (section) {
        let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
        window.scrollTo({
          top: section.offsetTop - parseInt(scrollMarginTop || 0),
          behavior: 'smooth'
        });
      }
    }
  }
  if (document.readyState !== 'loading') {
    handleHashScroll();
  } else {
    document.addEventListener('DOMContentLoaded', handleHashScroll);
  }

  /**
   * Active Navigation Management
   * Automatically synchronizes active navigation state based on current URL path and user clicks
   */
  function syncActiveNav() {
    try {
      const pathname = window.location.pathname.replace(/\\/g, '/');
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1).toLowerCase() || 'index.html';
      
      const isHome = filename === '' || filename === 'index.html';
      const isLayanan = filename === 'layanan.html' || pathname.includes('/layanan/') || ['proses-maklon.html', 'moq-maklon.html', 'biaya-maklon.html'].includes(filename);
      const isPaket = filename === 'paket.html' || pathname.includes('/paket/');
      const isProduk = filename === 'produk.html' || pathname.includes('/produk/');
      const isBlog = filename === 'blog.html' || pathname.includes('/blog/');
      const isTentang = filename === 'tentang-kami.html';
      const isGaleri = filename === 'galeri.html';

      const navLinks = document.querySelectorAll('#navmenu a');
      if (!navLinks.length) return;

      navLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase().split('#')[0].split('?')[0];
        const hrefFilename = href.substring(href.lastIndexOf('/') + 1);

        let makeActive = false;
        if (isHome && (hrefFilename === 'index.html' || href === 'index.html' || href === '/')) {
          if (!link.closest('.dropdown ul')) makeActive = true;
        } else if (isTentang && hrefFilename === 'tentang-kami.html') {
          makeActive = true;
        } else if (isGaleri && hrefFilename === 'galeri.html') {
          makeActive = true;
        } else if (isBlog && hrefFilename === 'blog.html') {
          makeActive = true;
        } else if (isLayanan) {
          if (hrefFilename === 'layanan.html' && !link.closest('.dropdown ul')) {
            makeActive = true;
          } else if (hrefFilename === filename) {
            makeActive = true;
          }
        } else if (isPaket) {
          if (hrefFilename === 'paket.html' && !link.closest('.dropdown ul')) {
            makeActive = true;
          } else if (hrefFilename === filename) {
            makeActive = true;
          }
        } else if (isProduk) {
          if (hrefFilename === 'produk.html' && !link.closest('.dropdown ul')) {
            makeActive = true;
          } else if (hrefFilename === filename) {
            makeActive = true;
          }
        }

        if (makeActive) {
          link.classList.add('active');
          const parentDropdown = link.closest('.dropdown');
          if (parentDropdown) {
            const toggle = parentDropdown.querySelector(':scope > a');
            if (toggle) toggle.classList.add('active');
          }
        }
      });
    } catch (e) {
      // Graceful fallback
    }
  }

  // Instant visual feedback when clicking nav links
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', function() {
      if (this.hash && !this.pathname) return;
      document.querySelectorAll('#navmenu a.active').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
      const parentDropdown = this.closest('.dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector(':scope > a');
        if (toggle) toggle.classList.add('active');
      }
    });
  });

  if (document.readyState !== 'loading') {
    syncActiveNav();
  } else {
    document.addEventListener('DOMContentLoaded', syncActiveNav);
  }

  /**
   * Navmenu Scrollspy (only for intra-page hash navigation)
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash || navmenulink.hash === '#') return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      }
    });
  }
  if (document.readyState !== 'loading') {
    navmenuScrollspy();
  } else {
    document.addEventListener('DOMContentLoaded', navmenuScrollspy);
  }
  document.addEventListener('scroll', navmenuScrollspy);

})();