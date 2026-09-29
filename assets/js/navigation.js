const menuToggle = document.querySelector('.menu-toggle');
const mobileNavigation = document.getElementById('mobile-navigation');
function closeNavigation() {
    mobileNavigation.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
}
menuToggle.addEventListener('click', () => {
    const opening = mobileNavigation.hidden;
    mobileNavigation.hidden = !opening;
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close navigation menu' : 'Open navigation menu');
});
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileNavigation.hidden) {
        closeNavigation();
        menuToggle.focus();
    }
});
document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeNavigation();
});
window.matchMedia('(min-width: 1280px)').addEventListener('change', closeNavigation);
