// this layer takes data, builds components, and attaches these components to the dom.

function populateGenreCard(categoryList) {
  const top10 = categoryList.slice(0, 5);

  const contentElement = document.getElementById("genre-table");
  top10.forEach(item => inject(createRow(item), contentElement));

  // Drawing a pie chart with padding and labels that are outside the pie
  new Chartist.Pie(
    ".genre-chart",
    {
      series: top10.map(item => item.value),
      labels: top10.map(item => item.category)
    },
    {
      chartPadding: 30,
      labelOffset: 50,
      labelDirection: "explode"
    }
  );
}

function populateBookTable(books) {
  const contentElement = document.getElementById("book-table");
  books.forEach(item => inject(createBookRow(item), contentElement));
}
