/*
    This file contains the components that are used to create the dashboard.

    Each function returns a valid HTML string to be injected into the DOM.
*/

function createHamburgerMenuItem(title, link) {
  return `
    <div class="menu-item-root">
    ${title} <i class="fas fa-angle-down chevron" />
    </div>
    `;
}
