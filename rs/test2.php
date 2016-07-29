<?php
	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$db = "484PROJECT";


	// Create connection
	$conn = new mysqli($servername, $username, $password, $db);

	// Check connection
	if (mysqli_connect_error()) {
		die("Database connection failed: " . mysqli_connect_error());
	}
	
	if(isset($_POST['input']))
	{
		$input = $_POST['input'];
		execute($conn, $input);
	}
		
	
	/*
	$outputs = "TESTING";
	echo "TESTING1";
	postData();
	
	function postData(){
		echo "TESTING2";
		
		if(isset($_POST['input']))
		{
			$input = $_POST['input'];
			echo $input;
		}
	}*/
	
	//close connection
	$conn->close();	
	
	function execute($conn, $input){
		$sql = $input;
		$result = $conn->query($sql);
		//echo $result;
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
			$rows[] = $r;
		}
		echo json_encode($rows);
		
		
	}
?>