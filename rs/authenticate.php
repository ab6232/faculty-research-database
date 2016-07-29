<?php

/*Database group 8 project
--5/12/16
--Andrew Behrens, Matthew Hoover, Brednan McDonalds, Watson Powers, Dillon Puglisi
--kelvin link: http://kelvin.ist.rit.edu/~dbgroup8/rs/faculty.php

--Datalayer
--handles datalayer manipulations for authentication of users
--includes the all the necessary functionality to connect to sql without the data_layer.php
--Inputs: credentials (username and password) from user, 
--compares the credentials against the faculty table in the database
--Returns: true if that pair of username and password exist in the faculty database, false if not
*/

	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$db = "484PROJECT";


	// Create connection to database
	$conn = new mysqli($servername, $username, $password, $db);

	// Check connection to database
	if (mysqli_connect_error()) {
		die("Database connection failed: " . mysqli_connect_error());
	}
	
	//get username and password from webpage form
	if(isset($_POST['username']))
		{ $username = $_POST['username']; }
	
	if(isset($_POST['password']))
		{ $password = md5($_POST['password']); }
	
	//CONFIRMED< gets username and password successfully
	//echo $username + ', ' + $password;
	//echo $username . ', ' . $password . '///';

	
	//run authentication function
	execute($conn,$username,$password);	
	
	
	//close connection to database
	$conn->close();	
	
	//connects to sql database, checks if user's username and password are valid
	function execute($conn,$username,$password){
		$sql = "select email,password from faculty";
		$result = $conn->query($sql);	//run query
		//echo $result;
		/*$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
			$rows[] = $r;
		}
		echo json_encode($rows);*/
		$isFound = "false";	//boolean that represents 
		while($row = $result->fetch_assoc()){
			//echo $row["email"] . "/" . $row["password"] . "//";
			if($row["email"]==$username && $row["password"]==$password){	//if username and password are in the table
				$isFound = "true";
			}
		}
		echo $isFound;	//return whether or not the users credentials are good
	}
?>