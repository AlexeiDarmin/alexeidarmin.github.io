/*
 | Start of search
*/

var dictionary = ["HTML", "CSS3", "JavaScript", "PHP", "Python", "MySQL", "Laravel 5", "SailsJS"];
dictionary.sort();

function search(){
	var query = document.getElementById("search").value.toUpperCase();
	if (query.length > 0){
		$('#search-results').removeClass('hidden');
		var results = [];
		for (i = 0; i < dictionary.length; i++){
			if (dictionary[i].toUpperCase().indexOf(query) > -1){
				results.push(dictionary[i]);
			}
		}
		if (results.length > 0){
			displayResults(results, query);
		} else {
			$('#search-results').addClass('hidden');
		}
	} else {
		$('#search-results').addClass('hidden');
	}
}

$("#search").focusout(function(){
    $('#search-results').addClass('hidden');
});

$("#search").focusin(function(){
    search();
});

function displayResults(results, query){
	var obj = $('#search-results > tbody');
	obj.html("");
	var index;
	var html;
	var prefix;
	var suffix;
	for (i = 0; i < Math.min(results.length, 5); i++){
		index = -1;
		prefix = "";
		suffix = "";

		index = results[i].toUpperCase().indexOf(query.toUpperCase());
		if (index != 0) {
			prefix = results[i].substring(0, index);
		}

		if (index + query.length <= results[i].length){
			suffix = results[i].substring(index + query.length, results[i].length);
		}

		html = prefix + '<span class="highlight">' + results[i].substring(index, index + query.length) + '</span>' + suffix;
		obj.append('<tr><td class="mdl-data-table__cell--non-numeric">'+html+'</td></tr>');
	}
}
/*
 | End of search
*/

/*
 | Delayed event handler so value is present when requested by the search function.
 |http://stackoverflow.com/questions/1338483/detecting-value-of-input-text-field-after-a-keydown-event-in-the-text-field
*/
document.getElementById("search").addEventListener("keydown", function(){
	window.setTimeout(search);
});