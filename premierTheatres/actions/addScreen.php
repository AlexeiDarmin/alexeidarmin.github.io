<?
	include('../connection.php');

	echo print_r($_POST);
	echo "<br />";

	//Gets all screen names
	$query = "SELECT screenNames FROM theatre WHERE Name = '".$_POST['name']."'";
	$ContainScreens = mysql_fetch_array(mysql_query($query));
	$allScreens = json_decode($ContainScreens[0]);

	echo "from DB all screens: ".print_r($allScreens) ."<br />";

	//Initializes as empty array if none exist in DB
	if (empty($allScreens)){
		$allScreens = array();
		echo var_dump($allScreens)."ALL SCREENS EMPTY <br />";
	}

	//Creates tuple element [screenName, maxShows] and appends to allScreens
	$newTuple = array();
	array_push($newTuple, $_POST['newScreenName']);
	array_push($newTuple, $_POST['maxShows']);
	echo "new tuple: " . print_r($newTuple)."<br />";

	array_push($allScreens, $newTuple);

	echo "append tuple ". print_r($allScreens) ."<br />";

	$final = json_encode($allScreens);

	$query = "UPDATE theatre SET screenNames = '".$final."' WHERE Name = '".$_POST['name']."'";
	$result = mysql_query($query);

	if (!$result) {
    $message  = 'Invalid query: ' . mysql_error() . "\n";
    $message .= 'Whole query: ' . $query;
    die($message);
	}

	//echo "postname: ". $_POST['name'] . "<br />";
	echo "allscreens: ". $allScreens . "<br />";
	echo "final: ". $final . "<br />";
	echo "query: ". $query . "<br />";



	mysql_close($conn);
	//echo "<script>location.href='../editTheatre.php';</script>"; 

	$url = '../editTheatre.php';
	$data = array('name' => $_POST['name']);

	// use key 'http' even if you send the request to https://...
	$options = array(
	    'http' => array(
	        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data),
	    ),
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);

?>