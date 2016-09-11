<?
	include('connection.php');

	$theatreName = $_POST['name'];
	$query = "SELECT * FROM theatre WHERE Name = '".$theatreName."'";
	$result = mysql_query($query);

	if (!$result) {
    $message  = 'Invalid query: ' . mysql_error() . "\n";
    $message .= 'Whole query: ' . $query;
    //echo $message;
    die($message);
	}

	$theatreRow = mysql_fetch_array($result);
?>

<html>

<head>

<?php
	include('head.php')
?>

</head>

<body>
<div class="container-fluid">
	<h1 id="adminHeader">Editing <?php echo $theatreRow{'Name'} ?> Theatre</h1>
	
	<?php	

	echo '<table class="table table-bordered table-striped" id="adminTable">' .
				'<th>Screen Name <span class="action">Action</span></th>';


		foreach (json_decode($theatreRow{'screenNames'}) as $tuple) {
			echo '<tr><td>'.$tuple[0]. " - " .$tuple[1].'</td></tr>';
		}
		echo '<tr><td>
					<form action="actions/addScreen.php" method="POST">
					<input type="text" name="newScreenName" class="form-control nameInput" required>
					<input type="text" name="maxShows" class="form-control numberInput" required pattern="^[0-9]{1,2}$" maxlength="2">
					<input type="submit" value="Add" class="btn btn-success btn-xs action">
					<input type="hidden" name="name" value="'.$theatreRow{'Name'}.'" class="form-control nameInput">
				</form>
				</td></tr></table>';

	?>




	<?php
		echo $theatreRow{'Name'};
		echo printf($theatreRow{'Name'});
	?>
</div> <!-- end container-fluid -->




<?php
	mysql_close($conn);
	include('jsFiles.php')
?>
</body>

</html>