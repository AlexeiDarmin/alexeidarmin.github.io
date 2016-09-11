<?php
	include('connection.php');
	include('adminController.php');
	//include('userController.php');
?>

<html>

<head>
 
<title>
Admin Home
</title>

<?php
	include('head.php')
?>

</head>

<body>
<div class="container-fluid">
	<h1 id="adminHeader">Premier Theatres Admin Home Page</h1>

	<?php

		echo "Hello World<br />";

		//executes the SQL query and returns records
		$records = mysql_query("SELECT * FROM theatre");


		echo '<table class="table table-bordered table-striped" id="adminTable">' .
				'<th>Theatre Name <span class="action">Action</span></th>';


			//fetches tha data from the database 
			while ($row = mysql_fetch_array($records)) {
			  echo "<tr><td>" . $row{'Name'} . 
			   		'<form action="actions/deleteTheatre.php" method="POST" class="formAction">
							<input type="hidden" name="name" value="'.$row{'Name'}.'" class="form-control ">
							<input type="submit" value="Delete" class="btn btn-danger btn-xs action">
						</form>' .

						'<form action="editTheatre.php" method="POST" class="formAction">
							<input type="hidden" name="name" value="'.$row{'Name'}.'" class="form-control ">
							<input type="submit" value="Edit" class="btn btn-info btn-xs action">
						</form>' .




			   		'<button type="button" class="btn btn-primary btn-xs action">Features</button>' ;
			}
		echo '<tr><td>
				<form action="actions/createTheatre.php" method="POST">
				<input type="text" name="name" class="form-control nameInput" required>
				<input type="submit" value="Create" class="btn btn-success btn-xs action">
			</form>
			</td></tr>';
		echo '</table>';
	?>





	<?php
		mysql_close($conn);		//closes the DB connection

	?>

	<?php
		include('jsFiles.php')
	?>
</div>	<!-- end container -->
</body>

</html>