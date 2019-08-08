// runs the main application logic on load of window. 
window.onload = function() {
  console.log("hello world");

  const bookPaths = [
    "../raw-data/read-books.json",
    "../raw-data/to-read-books.json"
  ];

  let aggrBook = []
  const listOfPromises = bookPaths.slice().map(path => () =>
    $.getJSON(path, function(json) {
      // console.log('books', json.items)
      handleResponse(json.items);
      aggrBook = aggrBook.concat(json.items);
    })
  );
  afterAll(listOfPromises, () => processBooks(aggrBook));
};

// takes a list of books from the Google Books API and reads them into the app.
function processBooks(books) {
  console.log("books:", books);

  let aggrCategory = {};
  books.forEach(book => {
    const categories = book.volumeInfo.categories;

    if (!categories) return

    if (categories.length > 0) console.log("wow so category:", categories);
    const cat = book.volumeInfo.categories[0];
    if (!aggrCategory[cat]) aggrCategory[cat] = 0;
    aggrCategory[cat] += 1;
  });

  console.log("category total!", aggrCategory);
}

// executes a list of promises, once they are complete then executes the callback cb.
function afterAll(listOfPromises, cb) {
  let complete = 0;
  listOfPromises.forEach(promise => {
    promise().done(function(json) {
      complete++;
      console.log(complete, listOfPromises.length)
      if (complete === listOfPromises.length) {
        cb();
      }
    });
  });
}

function handleResponse(books) {
  if (!books) throw "no books provide";

  shuffle(books);
  const contentElement = document.getElementById("books-container");
  books.forEach(item => createBookCard(item, contentElement));
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

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

{
  /* <div class="book-card">
  <img
    src="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1421618636l/30659.jpg"
    class="book-image"
  />
  <div class="green-circle" />
  read
  <div class="book-title">TITLE</div>
  <div class="book-description" />
</div>; */
}

// function search() {
//   const BASE_URL = "https://www.googleapis.com/books/v1/";
//   const VOLUMES_PATH = "users/106342878832515929879/bookshelves/4/volumes"
//   const KEY = "AIzaSyCXd3M-Cb0KvyBMKTNS23nfaoiez6l51Go"
//   fetch(`${BASE_URL}${VOLUMES_PATH}?key=${KEY}`, {
//     method: "GET",
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Credentials": true,
//       "Access-Control-Allow-Methods": "POST, GET",
//     }
//   })
//     .then(response => response.json())
//     .then(json => console.log(json));
// }
// search()
