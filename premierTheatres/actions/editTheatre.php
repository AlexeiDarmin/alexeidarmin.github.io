<?
	include('../connection.php');

	$query = "DELETE FROM theatre WHERE Name = '".$_POST['name']."'";
	$result = mysql_query($query);

	if (!$result) {
    $message  = 'Invalid query: ' . mysql_error() . "\n";
    $message .= 'Whole query: ' . $query;
    //echo $message;
    die($message);
	}

	mysql_close($conn);
	
	echo "<script>location.href='../index.php';</script>"; 
?>

<html>

<head>

<?php
	include('head.php')
?>

</head>

<body>
	




<?php
	mysql_close($conn);
	include('jsFiles.php')
?>
</body>

</html>