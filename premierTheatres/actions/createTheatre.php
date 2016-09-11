<?
	include('../connection.php');

	$query = "INSERT INTO theatre (Name) VALUES ('".$_POST['name']."')";
	$result = mysql_query($query);

	if (!$result) {
    $message  = 'Invalid query: ' . mysql_error() . "\n";
    $message .= 'Whole query: ' . $query;
    die($message);
	}

	mysql_close($conn);
	echo "<script>location.href='../index.php';</script>"; 
?>