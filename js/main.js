// runs the main application logic on load of window.
window.onload = function() {
  console.log("hello world");

  const bookPaths = [
    "../raw-data/read-books.json",
    "../raw-data/to-read-books.json"
  ];

  let aggrBook = [];
  const listOfPromises = bookPaths.slice().map(path => () =>
    $.getJSON(path, function(json) {
      handleResponse(json.items);
      aggrBook = aggrBook.concat(json.items);
    })
  );
  afterAll(listOfPromises, () => processBooks(aggrBook));
};

// takes a list of books from the Google Books API and reads them into the app.
function processBooks(books) {
  console.log("books:", books);

  let missingCategory = 0;
  const aggrCategories = books.reduce((aggr, book) => {
    const categories = book.volumeInfo.categories;

    if (!categories) {
      missingCategory++;
      return aggr;
    }

    // categories is a list of size one always
    if (categories.length > 1) console.log("wow so category:", categories);

    const cat = book.volumeInfo.categories[0].toProperCase();
    if (!aggr[cat]) aggr[cat] = 0;
    aggr[cat] += 1;

    return aggr;
  }, {});

  const categoryList = dictToList(aggrCategories).sort((a, b) => {
    if (a.value > b.value) return -1;
    else return 1;
  });

  const totalCategories = categoryList.reduce(
    (aggr, item) => aggr + item.value,
    0
  );
  categoryList.forEach((item, index) => {
    categoryList[index] = Object.assign({}, item, {
      percentage: Math.round((item.value / totalCategories) * 100)
    });
  });

  populateGenreCard(categoryList);
  populateBookTable(books);

  console.log("categoryList:", categoryList);

  console.log("totaaal:", totalCategories);
  console.log("missingCategory", missingCategory);
  console.log("category total!", aggrCategories);
}

function handleResponse(books) {
  if (!books) throw "no books provide";

  shuffle(books);
  const contentElement = document.getElementById("books-container");
  books.forEach(item => createBookCard(item, contentElement));
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