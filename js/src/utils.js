// injects HTML into a DOM element
function inject(HTML, domElement) {
  domElement.innerHTML += HTML;
}

// converts a dictionary to a list
function dictToList(dict) {
  const arr = [];

  for (const key in dict) {
    if (dict.hasOwnProperty(key)) {
      arr.push({ category: key, value: dict[key] });
    }
  }
  return arr;
}

// executes a list of promises, once they are complete then executes the callback cb.
function afterAll(listOfPromises, cb) {
  let complete = 0;
  listOfPromises.forEach(promise => {
    promise().done(function() {
      complete++;
      if (complete === listOfPromises.length) {
        cb();
      }
    });
  });
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

String.prototype.toProperCase = function() {
  return this.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
