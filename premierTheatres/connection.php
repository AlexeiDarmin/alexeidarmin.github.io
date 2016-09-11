<?php
	$username = "DrPatr0n";
	$password = "*IGsVGCXT{%m";
	$hostname = "localhost"; 

	//connects to the database
	$conn = mysql_connect($hostname, $username, $password) or die("Unable to connect to MySQL");
	echo "Connected to MySQL<br>";

	//selects a database to work with
	$DB = mysql_select_db("Premier",$conn) 
			or die("Could not select database <br />".mysql_error());

	//executes the SQL query and return records
	//$result = mysql_query("SELECT id, model,year FROM cars");

	//fetches tha data from the database 
	//while ($row = mysql_fetch_array($result)) {
	//   echo "ID:".$row{'id'}." Name:".$row{'model'}."Year: ". //display the results
	//   $row{'year'}."<br>";
	//}
	//close the connection
	//mysql_close($dbhandle);
?>