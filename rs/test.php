<? php

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// creates connection to sql
function createConnection(){
	$servername = "127.0.0.1";
	$username = "root";
	$password = "";
	$db = "484PROJECT";
	
	$conn = new mysqli($servername, $username, $password, $db);
}

?>