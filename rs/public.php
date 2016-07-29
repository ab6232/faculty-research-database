<?php include 'database_layer.php';

/*Database group 8 project
--5/12/16
--Andrew Behrens, Matthew Hoover, Brednan McDonalds, Watson Powers, Dillon Puglisi
--kelvin link: http://kelvin.ist.rit.edu/~dbgroup8/rs/public.php

--Datalayer
--handles datalayer manipulations for public users, who have less access than faculty users
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
		if($firstWord =="UPDATE" || $firstWord=="INSERT" || $firstWord=="ALTER" || $firstWord=="DROP" || $firstWord=="DELETE")
		{ echo 'fail'; }	//public users cant run anything that changes the database, so returns fail if they tried
		else
		{
			$output = getData($input);	//run query that returns data
			echo $output;
		}
	}
	close();	//close connection to database
?>