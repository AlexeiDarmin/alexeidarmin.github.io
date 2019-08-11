// book genre row
function createRow(item) {
  return `<div class="genre-row">
    <div class="genre-col first">${item.category}</div>
    <div class="genre-col second">${item.value}</div>
    <div class="genre-col third">${item.percentage}%</div>
  </div>`;
}

function createHamburgerMenuItem(title, link) {
  return `
      <div class="menu-item-root">
      ${title} <i class="fas fa-angle-down chevron" />
      </div>
      `;
}

// book name row
function createBookRow(item) {
  return `<div class="genre-row">
    <div class="genre-col first">${item.volumeInfo.title}</div>
    <div class="genre-col third">${item.volumeInfo.authors[0]}</div>
  </div>`;
}
{
  /* <div class="genre-col second">${item.volumeInfo.subtitle}</div> */
}

function createBookCard(item, element) {
  const { imageLinks, title } = item.volumeInfo;

  element.innerHTML += `
      <div class="book-card">
        <img
          src="${imageLinks && imageLinks.thumbnail}"
          class="book-image"
        />
        <div class="green-circle" />
        read
        <div class="book-title">${title}</div>
        <div class="book-description" />
      </div>
    `;
}
