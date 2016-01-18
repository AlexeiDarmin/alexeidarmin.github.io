/*
 | Start of search
*/

var dictionary = ["HTML", "CSS3", "JavaScript", "PHP", "Python", "MySQL", "Laravel 5", "SailsJS"];
dictionary.sort();

function search(){
	var query = document.getElementById("search").value.toUpperCase();
	if (query.length > 0){
		var results = [];
		for (i = 0; i < dictionary.length; i++){
			// Pushes dictionary item if query string is a substring of that dictionary item.
			if (dictionary[i].toUpperCase().indexOf(query) > -1){
				results.push(dictionary[i]);
			}
		}
		if (results.length > 0){
			displayResults(results, query);
		} else {
			hideResults();
		}
	} else {
		hideResults();
	}
}

$("#search").focusout(hideResults);
$("#search").focusin(search);

function hideResults(){
	$('#search-results').addClass('hidden');
}

function displayResults(results, query){
	var index, html, prefix, suffix;
	var sortedResults = {};
	var obj = $('#search-results > tbody');
	obj.html("");
	$('#search-results').removeClass('hidden');

	// Builds a dictionary where the key is the starting index of the query substring
	// The value is a list of all results with identical starting indexies for the query.
	for (i = 0; i < results.length; i++){
		index = results[i].toUpperCase().indexOf(query.toUpperCase());
		if (!(index in sortedResults)){
			sortedResults[index] = [];
		}
		sortedResults[index].push(results[i]);
	}

	// Displays results in ascending order from the earliest to the furthest
	// occurance of the query within the result.
	// ie: query = "p", "Php" should show before "javascriPt"
	for (var key in sortedResults){
		for (j = 0; j < sortedResults[key].length; j++){
			index = -1;
			prefix = "";
			suffix = "";

			index = sortedResults[key][j].toUpperCase().indexOf(query.toUpperCase());

			if (index != 0) {
				prefix = sortedResults[key][j].substring(0, index);
			}

			if (index + query.length <= sortedResults[key][j].length){
				suffix = sortedResults[key][j].substring(index + query.length, sortedResults[key][j].length);
			}

			html = prefix + '<span class="highlight">' + sortedResults[key][j].substring(index, index + query.length) + '</span>' + suffix;
			obj.append('<tr><td class="mdl-data-table__cell--non-numeric">' + html + '</td></tr>');
		}
	}
}
/*
 | End of search
*/

/*
 | Delayed event handler so value is present when requested by the search function.
 | http://stackoverflow.com/questions/1338483/detecting-value-of-input-text-field-after-a-keydown-event-in-the-text-field
*/
document.getElementById("search").addEventListener("keydown", function(){
	window.setTimeout(search);
});
