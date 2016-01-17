/*
 | Search related code
*/

var dictionary = ["HTML", "CSS3", "JavaScript", "PHP", "Python", "MySQL", "Laravel 5", "SailsJS"];
dictionary.sort()

function search(){
	var query = document.getElementById("search").value.toUpperCase();
	var results = [];
	for (i = 0; i < dictionary.length; i++){
		if (dictionary[i].toUpperCase().indexOf(query) > -1){
			results.push(dictionary[i]);
		}
	}
	alert(results);
}

document.getElementById("search").addEventListener("keydown", search);