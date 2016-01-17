/*
 | Search related code
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
			displayResults(results);
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

function displayResults(results){
	var obj = $('#search-results > tbody');
	obj.html("");
	var html = "";
	for (i = 0; i < Math.min(results.length, 5); i++){
		obj.append('<tr><td class="mdl-data-table__cell--non-numeric">'+results[i]+'</td></tr>');
	}
}

/*
 | Delayed event handler so value is present when requested by the search function.
 |http://stackoverflow.com/questions/1338483/detecting-value-of-input-text-field-after-a-keydown-event-in-the-text-field
*/
document.getElementById("search").addEventListener("keydown", function(){
	window.setTimeout(search);
});