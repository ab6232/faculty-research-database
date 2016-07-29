<?php

/*Database group 8 project
--5/12/16
--Andrew Behrens, Matthew Hoover, Brednan McDonalds, Watson Powers, Dillon Puglisi
--kelvin link: http://kelvin.ist.rit.edu/~dbgroup8/rs/database_layer.php

--Datalayer
--main php for data layer logic and manipulation of sql
--Inputs: Takes query passed in from faculty/public.php files
--connects to sql database, runs insert, update, or delete functions, closes database
--Returns: Data from the database after running the query, or invalid if query is invalid 
*/

//create connection to sql database
function connect(){
	global $conn;
	//$conn = new mysqli($servername, $username, "", $db);
	$conn = new mysqli("127.0.0.1", "root", "", "484PROJECT");
	if (mysqli_connect_error()) {
		die("Database connection failed: " . mysqli_connect_error());
	}
}

//close connection to sql database
function close(){
	global $conn;
	$conn->close();
}

//runs inputted query, assuming its been validated already
//returns json encoded data set from sql database 
function getData($query)
{
	global $conn;
	$result = $conn->query($query);
	if ($result->num_rows == 0){
		echo "0 results";
		return null;
	}
	else{
		while($r = mysqli_fetch_assoc($result)) {
			$rows[] = $r;
		}
		return json_encode($rows);
	}
	
}
//returns json encoded data from prepared query
function getPreparedData($query, $values)
{
	global $conn;
	$prepStmt = prepare($query, $values);
	$result = $conn->query($preStmt);
	if ($result->num_rows == 0){
		echo "0 results";
		return null;
	}
	else{
		while($r = mysqli_fetch_assoc($result)) {
			$rows[] = $r;
		}
		return json_encode($rows);
	}
}
//runs inputted mysql query that does not return data. 
//returns boolean value indicating if query succesful
function setData($query)
{
	global $conn;
	if ($conn->query($query) === TRUE)
	{
		return true;
	}
	else 
	{
		echo "Error: " . $query . "<br>" . $conn->error;
		return false;
	}
}

//prepared setData method
//returns boolean value depending on succes of query
function setPreparedData($query, $values)
{
	global $conn;
	$prepStmt = prepare($query, $values);
	if ($conn->query($prepStmt) === TRUE)
	{
		return true;
	}
	else 
	{
		echo "Error: " . $prepStmt . "<br>" . $conn->error;
		return false;
	}
}
//prepare methods accepts a prepared mysql statement and the values that pertain
//to that statment. 
//returns the preparedStatment object
function prepare($query, $values)
{
	global $conn;
	$statement = $db_connection->prepare($query);
	for($i=0; $i<count($values); $i++)
	{
		$statement->bindParam($i, $values[$i]);
	}
	return $statement;
}
?>