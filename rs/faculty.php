<?php include 'database_layer.php';

/*Database group 8 project
--5/12/16
--Andrew Behrens, Matthew Hoover, Brednan McDonalds, Watson Powers, Dillon Puglisi
--kelvin link: http://kelvin.ist.rit.edu/~dbgroup8/rs/faculty.php

--Datalayer
--handles datalayer manipulations for faculty users
--includes the functionality of the database_layer.php 
--Inputs: takes input query from user, 
--checks the first word of the query to make sure its a function theyre allowed to run
--runs query if its permitted
--Returns: Data from the database after running the query, or invalid if query is invalid 
*/
	connect();	//open connection to database
	if(isset($_POST['input'])) //if input was passed in
	{
		$input = $_POST['input'];	//get input from parent source/whatever called this file
		$firstWord = strtok($input, ' ');	//gets first word of the query
		$firstWord = strtoupper($firstWord);	//makes first word of query uppercase for easier comparison
		
		//makes sure the passed-in query is one this user is permitted to run
		if($firstWord =="SELECT" || $firstWord=="DESC" || $firstWord=="DESCRIBE" || $firstWord=="SHOW")
		{
			$output = getData($input);	//run query that returns data
			echo $output;
		}
		else if($firstWord =="INSERT" || $firstWord =="UPDATE" || $firstWord =="DELETE")
		{
			if(setData($input)==true) { echo 'Values changed'; }//run query that changes data
			else { echo 'Warning:'.$conn->error;  }	//if query failed, return warning
		}
		else { echo 'Invalid query'; }	//if query was formatted/structured incorrectly, returns invalid query
	}
	close();	//close connection to database
?>