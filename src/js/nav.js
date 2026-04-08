// Active page links
const navLinks = document.querySelectorAll("[data-navLink]");
navLinks.forEach((link) => {
    if (link.getAttribute("href") === window.location.pathname) {
        link.setAttribute("aria-current", "page");
    }
});

// Shared scroll handler
const navContainer = document.getElementById('nav-container');
const mobileControls = document.getElementById('mobile-controls');

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 300;
    navContainer?.classList.toggle('scrolled', scrolled);
    mobileControls?.classList.toggle('scrolled', scrolled);
});

// Desktop scroll-to-top drip
document.getElementById('scroll-to-top')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile scroll-to-top
document.getElementById('mobile-scroll-top-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile hamburger menu
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburgerBtn && mobileMenu) {
    const menuLinks = Array.from(mobileMenu.querySelectorAll('a'));

    function openMenu() {
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        hamburgerBtn.setAttribute('aria-label', 'Close menu');
        mobileMenu.classList.add('open');
        mobileMenu.removeAttribute('aria-hidden');
        menuLinks.forEach(a => a.removeAttribute('tabindex'));
        // Move focus to first menu item
        menuLinks[0]?.focus();
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        hamburgerBtn.setAttribute('aria-label', 'Open menu');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuLinks.forEach(a => a.setAttribute('tabindex', '-1'));
        // Return focus to the button that opened the menu
        hamburgerBtn.focus();
    }

    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#mobile-controls')) {
            closeMenu();
        }
    });

    // Close when a link is clicked
    menuLinks.forEach((link) => {
        link.addEventListener('click', () => closeMenu());
    });
}
