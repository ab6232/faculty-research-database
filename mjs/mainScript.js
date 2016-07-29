// JavaScript source code
/*Database group 8 project
--5/12/16
--Andrew Behrens, Matthew Hoover, Brednan McDonalds, Watson Powers, Dillon Puglisi

--This javascript handles communication between view layer (index.php) 
--and data layer (authentication.php, faculty.php, public.php)
--dynamically creates most of the elements on the page and assigns them click functions
--handles most of the logic outside of the actual database manipulation
*/


var outputData;	//contains the data returned from running a query through sql: is global scope so can be viewed in console

var test = false;	//boolean for whether or not login has been run using correct credentials

var outputData2;
//var outputData2;


var selectedFunction = "";	//represents the currently selected operation the user wishes to perform


var facultyData;
var authorshipData;
var papersData;
var paper_keywordsData;
/*
--
--
*/
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*Runs when document is first loaded
--preps page: logs in if credentials are stored
--adds click functions to the buttons on the page
--disables buttons until the user enters information into the form
--gives formatting to the data tables
--call the function that fills the public data table with the 
--cumulative table data using big join sql query
*/
$(function() { 

	console.log("update 5/18/16 4:41p");
	
	console.log("onload() called");
	
	
	
	//hide logout button
	$("#logoutBtn").hide();	
	
	//hide admin access 
	$('#adminDiv').hide();
	$('#adminOutputDiv').hide();
	$( "#adminBtn" ).click(function() {
	  adminBtnClick();
	});
	
	getAllData();	
	
	$('#manipulator').hide();	//remove the manipulator div, which is where FACULTY users manipulate the data
	
	//if user previously logged in and their credentials were saved, remembers and logs them in
	if (localStorage.username!="" && localStorage.username!=undefined){
		console.log("localstorage found: " + localStorage.username);
		$('#userInpt').val(localStorage.username);
		$('#passInpt').val(localStorage.password);
		login();
	}
	
	
	createVarForm();	//create form with radio buttons for each tablename
	
	
	
	//makes formatting of table more reasonable
	$('#outputTable').css('font-size','110%');	
	$('#outputTable').css('width','95%');
	$('#outputTable').css('margin-top','10pt%');
	$('#container').css('width','90%');
	
	fillStaticPublicTable();	//fill main table on page with the aggregate data
	
	$('#display').css('overflow','auto');	//allows user to scroll through table if its too big to fit within its parent element
	$('#display').css('height','450pt');
	
	$('#manipulator').hide(); //hide query box
	$('#publicManipulator').hide();
	$('#instructions').hide();
	$('#testOutputDiv').hide();//hide extra table and output
})

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*runs when the user clicks the login button
--retrieves username and password from the login form ont he page
--shakes the login box if either input is blank
--otherwise, runs authenticate method to check user credentials
*/
function login() {
	console.log("login() called");
	
		//console.log("logging in as faculty");
		var username = $('#userInpt').val();
		var password = $('#passInpt').val();
		
		if (username=="" || password==""){
			$( "#loginDiv" ).effect( "shake" );
		}
		else {
			//console.log("Login: " + username + ", " + password);
			
			//check login
			var check = authenticate(username,password);
		}	
	
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*runs AFTER authenticate function
--accepts boolean representing status of authentication (true if their credentials were good, false if not), and the username and password
--if credentials are good, changes the login box to reflect: changes login button to logout, removes input boxes and their labels, converts page to faculty mode
--in faculty mode, the user is granted more options to manipulate the data
--if credentials are bad, calls authenticateAdmin() to check if user is ADMIN
*/
function login2(check,username,password) {
	console.log("login2() called");
	
		console.log("check: " + check);
		
		//if login is correct 
			if (check){
				console.log("correct login");
				//alert("Welcome, " + username + "!");
				$("#logoutBtn").show();	//show logout button
				$("#loginHeader").html("Welcome, " + username);	//change header
				$("#loginBtn").hide();	//hide login button
				$('#userInpt').hide();	//hide inputs
				$('#passInpt').hide();
				$('#usernameLabel').hide();	//hide labels
				$('#passwordLabel').hide();
				$('#manipulator').show();	//allow functions
				
				$('#testOutputDiv').show();
				
				//stores credentials locally
				localStorage.username = username;
				localStorage.password = password;
				
				$('#publicManipulator').hide();
			}
			else {	//if login is incorrect for FACULTY 
				console.log("incorrect faculty login");
				//$( "#loginDiv" ).effect( "shake" );	//shake the login box to visually make it clear that their login was incorrect
				
				//check if ADMIN
				authenticateAdmin(username,password);
			}


}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*runs AFTER authenticateAdmin function
--accepts boolean representing status of authentication (true if their credentials were good, false if not), and the username and password
--if credentials are good, changes the login box to reflect: changes login button to logout, removes input boxes and their labels, converts page to admin mode
--in admin mode, the user is granted more options to manipulate the data
*/
function login3(check,username,password) {
	console.log("login3() called");
	
		console.log("check: " + check);
		
		//if login is correct 
			if (check){
				console.log("correct login: ADMIN");
				//alert("Welcome, " + username + "!");
				$("#logoutBtn").show();	//show logout button
				$("#loginHeader").html("Welcome, " + username);	//change header
				$("#loginBtn").hide();	//hide login button
				$('#userInpt').hide();	//hide inputs
				$('#passInpt').hide();
				$('#usernameLabel').hide();	//hide labels
				$('#passwordLabel').hide();
				$('#manipulator').show();	//allow functions
				
				$('#adminDiv').show();
				$('#adminOutputDiv').show();
				
				$('#testOutputDiv').show();
				
				//stores credentials locally
				localStorage.username = username;
				localStorage.password = password;
				
				$('#publicManipulator').hide();
			}
			else {	//if login is incorrect for ADMIN (which means didnt authenticate for either user type)
				console.log("incorrect login for ADMIN");
				$( "#loginDiv" ).effect( "shake" );	//shake the login box to visually make it clear that their login was incorrect
			}


}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*runs when the user clicks the logout button
--converts the page back to public mode, which involves:
--turning the logout button back to login, adding back the inputs for username and password
--clears the credentials from local storage so that if the page is refreshed, they wont be logged back in
*/
function logout() {
	console.log("logout() called");
	//alert("Goodbye!");
	$("#loginHeader").html("Login: ");	//change header
	$("#loginBtn").show();	//show login button
	$("#logoutBtn").hide();	//hide logout button
	$('#userInpt').show();	//show inputs
	$('#passInpt').show();
	$('#userInpt').val("");	//clear inputs
	$('#passInpt').val("");
	$('#usernameLabel').show();	//show labels
	$('#passwordLabel').show();
	$('#manipulator').hide();	//remove functions
	localStorage.clear();
	$('#testOutputDiv').hide();//hide extra table and output
	//$('#publicManipulator').show();
	
	$('#adminDiv').hide();
	$('#adminOutputDiv').hide();
}



//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*accepts username and password, checks credentials against thedatabase via ajax call to php
--calls the login2 function, passing in true if the login is valid, false if not
*/
function authenticate(usrNme, psswrd)
{	
	console.log("authenticate() called");
	var isGood = false;
	
	//get input
		var username = usrNme; //$("#usernameInput").val();
		var password = psswrd; //$("#usernameInput").val();
		//console.log(username + ', ' + password);
		
		//var postData = userInput;
		
		//run ajax call that passes data to authenticate.php
		//authenticate.php will either return true, false or an error
		$.ajax({
			//url : "input.php",
			url: "rs/authenticate.php",
			type: "POST",
			data : { username : username.trim(), password : password.trim() },	//removes whitespace from the inputs
			success: function(data,status, xhr)	//if ajax call is successful
			{
				console.log("success");
				console.log("output: " + data);
				
				
				//if the database includes the given credentials
				if (data.trim()=="true"){
					isGood = true;
					test = true;
				}
				//if the database doesnt include the given credentials
				else {
					isGood = false;
					test = false;
				}
				console.log("Good login: " + isGood);
				//console.log("end of authenticate() 1");
				//return isGood;
				
				//calls login 2 function which completes the process
				//calls here so that its not called before the ajax call is complete
				login2(isGood,username,password);	
				
			}/*,
			error: function (jqXHR, status, errorThrown)//if ajax call fails
			{
				console.log("failure");
				//if fail show error and server status
				$("#status_text").html('there was an error ' + errorThrown + ' with status ' + textStatus);
			}*/
		});
	//console.log("end of authenticate() 2");
	//return isGood;
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*accepts username and password, checks credentials against the database for ADMINS  via ajax call to php
--calls the login3 function, passing in true if the login is valid, false if not
*/
function authenticateAdmin(usrNme, psswrd)
{	
	console.log("authenticateAdmin() called");
	var isGood = false;
	
	//get input
		var username = usrNme; //$("#usernameInput").val();
		var password = psswrd; //$("#usernameInput").val();
		//console.log(username + ', ' + password);
		
		//var postData = userInput;
		
		//run ajax call that passes data to authenticate.php
		//authenticate.php will either return true, false or an error
		$.ajax({
			//url : "input.php",
			url: "rs/authenticateAdmin.php",
			type: "POST",
			data : { username : username.trim(), password : password.trim() },	//removes whitespace from the inputs
			success: function(data,status, xhr)	//if ajax call is successful
			{
				console.log("success");
				console.log("output: " + data);
				
				
				//if the database includes the given credentials
				if (data.trim()=="true"){
					isGood = true;
					test = true;
				}
				//if the database doesnt include the given credentials
				else {
					isGood = false;
					test = false;
				}
				console.log("Good login: " + isGood);
				//console.log("end of authenticate() 1");
				//return isGood;
				
				//calls login 2 function which completes the process
				//calls here so that its not called before the ajax call is complete
				login3(isGood,username,password);	
				
			}/*,
			error: function (jqXHR, status, errorThrown)//if ajax call fails
			{
				console.log("failure");
				//if fail show error and server status
				$("#status_text").html('there was an error ' + errorThrown + ' with status ' + textStatus);
			}*/
		});
	//console.log("end of authenticate() 2");
	//return isGood;
}

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*gets all the data from the database
--stores each in variables
*/
function getAllData() {
	console.log("getAllData() called");
	
	//reset values to prevent caching?
	facultyData = null;
	authorshipData = null;
	papersData = null;
	paper_keywordsData = null;

	//get faculty data
		$.ajax({
			url: "rs/faculty.php",
			type: "POST",
			data : { input : "select * from faculty" },	
			success: function(data,status, xhr)
			{
				console.log("Got faculty data");
				if (data.substr(0,8).trim().toLowerCase()!="warning"){	//makes sure returned data isnt 'warning'
					try {facultyData = JSON.parse(data);}
					catch (err) {  console.log("Output is not in JSON format"); }
				}
			},
			//if ajax call fails
			error: function (jqXHR, status, errorThrown) { console.log("failed to get faculty data"); }
		});
		
		//get authorship data
		$.ajax({
			url: "rs/faculty.php",
			type: "POST",
			data : { input : "select * from authorship" },	
			success: function(data,status, xhr)
			{
				console.log("Got authorship data");
				if (data.substr(0,8).trim().toLowerCase()!="warning"){	//makes sure returned data isnt 'warning'
					try {authorshipData = JSON.parse(data);}
					catch (err) {  console.log("Output is not in JSON format"); }
				}
			},
			//if ajax call fails
			error: function (jqXHR, status, errorThrown) { console.log("failed to get authorship data"); }
		});
		
		//get papers data
		$.ajax({
			url: "rs/faculty.php",
			type: "POST",
			data : { input : "select * from papers" },	
			success: function(data,status, xhr)
			{
				console.log("Got papers data");
				if (data.substr(0,8).trim().toLowerCase()!="warning"){	//makes sure returned data isnt 'warning'
					try {papersData = JSON.parse(data);}
					catch (err) {  console.log("Output is not in JSON format"); }
				}
			},
			//if ajax call fails
			error: function (jqXHR, status, errorThrown) { console.log("failed to get papers data"); }
		});
		
		//get keywords data
		$.ajax({
			url: "rs/faculty.php",
			type: "POST",
			data : { input : "select * from paper_keywords" },	
			success: function(data,status, xhr)
			{
				console.log("Got paper_keywords data");
				if (data.substr(0,8).trim().toLowerCase()!="warning"){	//makes sure returned data isnt 'warning'
					try {paper_keywordsData = JSON.parse(data);}
					catch (err) {  console.log("Output is not in JSON format"); }
				}
			},
			//if ajax call fails
			error: function (jqXHR, status, errorThrown) { console.log("failed to get paper_keywords data"); }
		});
		
}



//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*runs the static query that gets one massive aggregate JOINed table of all data
--sends data to generateStaticTable() method, which creates main table using datatables plugin
*/
function fillStaticPublicTable(){
	
	//get input
		var userInput = 'select DISTINCT group_concat(CONCAT(faculty.fName," ",faculty.lName)) AS "Name",papers.id,papers.title AS "Title",papers.abstract AS "Abstract",papers.citation AS "Citation",group_concat(paper_keywords.keyword) AS "Keywords" from papers JOIN authorship ON authorship.paperID = papers.id JOIN faculty ON faculty.id = authorship.facultyId JOIN paper_keywords ON (paper_keywords.id = papers.id) GROUP BY papers.id';
		//console.log("Input: " + userInput);
		
		//runs ajax call which passes this sql query into the faculty.php and returns all the data
		$.ajax({
			//url : "input.php",
			url: "rs/faculty.php",
			type: "POST",
			data : { input : userInput },	//input should be like: SELECT * from faculty
			success: function(data,status, xhr)
			{
				//console.log("success");
				 
				//console.log("output: " + data);
				
				
				var isGood = false;	//boolean represents if data is properly formatted
				
				if (data.substr(0,8).trim().toLowerCase()!="warning"){	//makes sure returned data isnt a 'warning: etc etc'
					try {
						outputData = JSON.parse(data);	//parses data into JSON object
						console.log(outputData);
						isGood = true;	//data is properly formatted					
					}
					catch (err) { 
						//alert("Error: Unexpected value in returned data"); 
						console.log("Output is not in JSON format");
						
						//prints output (which here, is an error message) to table
						var table = $('#testTableBody');
						table.empty();
						table.append(data);
						
					}
				}
				else { alert("Incorrect query"); }
				
				
				//if (isGood) {generateTable(outputData);}
				if (isGood) {generateStaticTable(outputData);}	//if data is properly formatted, sends to funciton which posts it to table
				
			},
			//if ajax call fails
			error: function (jqXHR, status, errorThrown)
			{
				console.log("failure");
				//if fail show error and server status
				$("#status_text").html('there was an error ' + errorThrown + ' with status ' + textStatus);
			}
		});
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*fills main output table with the main aggregate data, combination of all tables relevant information, for public user use
--COLUMN VALUES HARDCODED
*/
function generateStaticTable(tableData)
{
	console.log("generateStaticTable() called");
	console.log("data passed in: " + tableData);
	
	
	try {	//destroys datatable if its been created already, so it can be repopulated
		if ( $.fn.DataTable.isDataTable( '#outputTable' ) ) {
			console.log("destroying datatable");
			$('#outputTable').DataTable().destroy();
		}
	}
	catch (err){console.log("couldnt destroy table: " + err);}
	
	$('#outputTable').empty();	//clears contents of output table
	
	
	
	//get keys and keycount of data
	var keys = Object.keys(outputData[0]);
		console.log("Keys: " + keys);
	var numKeys = Object.keys(outputData[0]).length;
		console.log("numKeys: " + numKeys);
	
	//create string representing row of table
	var columnString = "";
	for (i = 0; i < numKeys; i++) {
		if (i < numKeys-1){ columnString+='{"mData": "' + keys[i] + '"},';}
		else { columnString+='{"mData": "' + keys[i] + '"}'; }
	}
	console.log("Column string: " + columnString);
	console.log("Column string type: " + jQuery.type(columnString));
	
	//add table headers before adding data to table	
	$('#outputTable').append('<thead><tr>');
	//adds header for each column
	for (i = 0; i < numKeys; i++) {
		$('#outputTable').append('<th>' + keys[i] + '</th>');
	}
	$('#outputTable').append('</tr></thead>');
	
	//testTable(tableData);
	
	//tries to bind data to data
	try {
		console.log("creating table...");
		//binds to datatable plugin
		$('#outputTable').DataTable({   
			"aaData": tableData,
			bAutoWidth: false, 
			"aoColumns": [   
            {"mData": "Name", "width": "5%"},
			{"mData": "id", "width": "10%"},
			{"mData": "Title", "width": "5%"},	//sWidth
			{"mData": "Abstract", "width": "50%"},
			{"mData": "Citation", "width": "20%"},
			{"mData": "Keywords", "width": "10%"}
         ]
		});
	}
	catch (err) {
		console.log("Error: " + err)
	}
	
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//populates outputTable/testTable to substitute datatables output table
function testTable(tableData)
{
	console.log('testTable() called');
	
	var table = $('#testTableBody');
	table.empty();
	
	//get keys and keycount of data
	var keys = Object.keys(tableData[0]);
		console.log("Keys: " + keys);
	var numKeys = Object.keys(tableData[0]).length;
		console.log("numKeys: " + numKeys);
	
	//add headers
	table.append('<tr>');
	for (i=0; i<numKeys; i++) { table.append('<th>' + keys[i] + '</th>'); }
	table.append('</tr>');
	
	//try to create table using data
	//for the length of the data, create rows for the table
	for (i=0; i < tableData.length; i++) {	//for each object
	
		/*$.each( outputData[0], function( key, value ) {
		  console.log( key + ": " + value );
		});*/
		//var values =[];
		
		//create row
		table.append('<tr>');
		$.each( outputData[i], function( key, value ) {	//add each value from the data to the row
			//values.push(value );
			table.append('<td>' + value + '</td>');
		});
		table.append('</tr>');	//end row of table
	}
}



//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*create the variance form
--variance form includes radio buttons that represent the functions the faculty user can run 
--clicking on a function's radio button gives a new set of options
--
*/
function createVarForm(){
	console.log("createVarForm() called");
	
	//getTableNames();
	
	//CREATE FORM
	var mainForm = $('#mainForm');
	var toAppend = '';
	
	
	//create an radio button option for each function that user can run
	toAppend+='<div id = "functionForm">';
		toAppend+='<hr>Function: ';
		toAppend+= '<input type="radio" name="function" id="insertSelect" value="insert"> Insert new entry';
		toAppend+= '<input type="radio" name="function" id="updateSelect" value="update"> Update existing entry';
		toAppend+= '<input type="radio" name="function" id="deleteSelect" value="delete"> Delete existing entry';
	toAppend+='</div>';
	
	
	//create section for operations
	toAppend+='<div id = "operationForm"></div>';
	
	
	//create section for values
	toAppend+='<div id = "valuesForm"></div>';
	
	mainForm.append(toAppend);	//add to page 
	
	//CREATE VARIABLE FORM
	//mainForm.append('<div id = "variableForm"></div>');
	//var variableForm = $('#variableForm');
	//ADD click functions to radio buttons
	addRBClicks();
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*adds click functions to the radio buttons
--makes it so that when a user clicks on a radio button corresponding to a table, it gives options for that tables fields
*/
function addRBClicks(){
	//give click function to submit button
	console.log("addRBClicks() called");
	
	$("#submitBtn").click(function(){
		 submitBtn();
		
	});
	
	
	//give click function to insert
	//calls function that builds the form tailored to the function the user picked
	$("#insertSelect").click(function(){
		console.log("insert selected");		
		buildForm("insert");
	});
	
	
	
	
	//give click function to update
	//calls function that builds the form tailored to the function the user picked
	$("#updateSelect").click(function(){
		console.log("update selected");	
		buildForm("update");
	});
	
	
	
	
	//give click function to delete
	//calls function that builds the form tailored to the function the user picked
	$("#deleteSelect").click(function(){
		console.log("delete selected");	
		buildForm("delete");
	});

}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*checks value inputs to make sure theyre not null or empty or otherwise invalid
*/
function validateInput(value){
	if (value==null){return false;}	//checks not null
	else if (value==""){return false;}	//checks not space 
	else if (value.trim()==""){return false;}	//removes whitespace
	else if (value.indexOf(";") >= 0){return false;}	//if contains ;
	else {return true;}
	
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*run when/linked to the faculty user clicking the submit button
--populates the variable form with a radio button corresponding to each field in the database
--takes in the id of the clicked table select element: "table0" or "table1" etc
--uses that to retrieve fields corresponding to each table in the database
*/
function submitBtn(){
	console.log("submitBtn() called");

	
		//get which function and operation the user chose 
		var sFunction = $('input[name="function"]:checked').val();
		var sOperation = $('input[name="operation"]:checked').val();
		
		//if (sFunction==null){console.log("No function selected");}
		//else if (sFunction=="insert"){ }
		
		
		
		
		if (sOperation==null){console.log("No function selected"); alert("No function selected!");}
		
		//insert faculty -------------------------------------------------------------------------------
		else if (sOperation=="insertFaculty"){ 
			console.log("Inserting faculty");
			var fNameI = $('#fNameInput').val();
			var lNameI = $('#lNameInput').val();
			var passwordI = $('#passwordInput').val();
				var md5Password = $.md5(passwordI);	//converts to md5
			var emailI = $('#emailInput').val();
			
			//validation?
			//if (fNameI==null || lNameI==null || passwordI==null || emailI==null ||
			//	fNameI=="" || lNameI=="" || passwordI=="" || emailI==""){
			if (validateInput(fNameI) && validateInput(lNameI) && validateInput(passwordI) && validateInput(emailI)){
				
				//get highest current id in faculty
				var highestId = 0;
				for (i = 0; i < facultyData.length; i++){
					if (facultyData[i].id>highestId){highestId = facultyData[i].id}
				}
				console.log("highest current faculty id is: " + highestId);
				highestId++;
				
				var query = 'INSERT into faculty values (' + highestId + ',"' + fNameI + '","' + lNameI + '","' + md5Password + '","' + emailI + '")';
				//var fields = [];
				
				//var query = createInsertQuery("faculty",fName,lName,password,email);
				runInsertUpdateDeleteQuery(query);
				
				//TODO: option to link to books? 
				
			}
			else { alert("Invalid or missing value!"); }
		}
		
		//insert paper -------------------------------------------------------------------------------
		else if (sOperation=="insertPaper"){ 
			console.log("Inserting paper");
			var titleI = $('#titleInput').val().trim();
			var abstractionI = $('#abstractionInput').val().trim();
			var citationI = $('#citationInput').val().trim();
			var keyswordsI = $('#keywordsInput').val().trim();
				//separate by ,
				var keywordsArray = keyswordsI.split(",");
			var authorI = $('#authorSelect').val();
				//separate with _
				var authorI2 = authorI.split("_");
				var fNameI = authorI2[0];
				var lNameI = authorI2[1];
				//get id of this author
				var facultyId = 0;
				for (i = 0; i < facultyData.length; i++){
					if (facultyData[i].fName==fNameI && facultyData[i].lName==lNameI)
						{facultyId = facultyData[i].id}
				}
				console.log("Faculty: " + fNameI + " " + lNameI + ": " + facultyId);
			
			//if (titleI==null || abstractionI==null || citationI==null || keyswordsI==null || authorI==null){
			//	alert("All values must be entered!");
			//}
			if (validateInput(titleI) && validateInput(abstractionI) && validateInput(citationI) && validateInput(keyswordsI)){
			
				//get highest current id in papers
				var highestId = 0;
				for (i = 0; i < papersData.length; i++){
					if (papersData[i].id>highestId){highestId = papersData[i].id}
				}
				console.log("highest current paper id is: " + highestId);
				//var paperId = 0;
				var paperId = Number(highestId) + Number(1);
				
				var query = 'INSERT into papers values (' + paperId + ',"' + titleI + '","' + abstractionI + '","' + citationI + '")';
				runInsertUpdateDeleteQuery(query);
				
				//insert into authorship 
				var query = 'INSERT into authorship values (' + facultyId + ',' + paperId + ')';
				runInsertUpdateDeleteQuery(query);
				
				//for each keyword, insert into paper_keywords 
				for (i=0; i<keywordsArray.length; i++){
					//insert into paper_keywords 
					var query = 'INSERT into paper_keywords values (' + paperId + ',"' + keywordsArray[i].trim() + '")';
					runInsertUpdateDeleteQuery(query);
				}
			}
			else { alert("Invalid or missing value!"); }
			
			
		}
		
		
		//update faculty -------------------------------------------------------------------------------
		else if (sOperation=="updateFaculty"){ 
			console.log("Updating faculty");
			
			var authorI = $('#authorSelect').val();
				//separate with _
				var authorI2 = authorI.split("_");
				var fNameI2 = authorI2[0];
				var lNameI2 = authorI2[1];
				//get id of this author
				var facultyId = 0;
				for (i = 0; i < facultyData.length; i++){
					if (facultyData[i].fName==fNameI2 && facultyData[i].lName==lNameI2)
						{facultyId = facultyData[i].id}
				}
				console.log("Faculty: " + fNameI2 + " " + lNameI2 + ": " + facultyId);
				
				
			var fNameI = $('#fNameInput').val().trim();
			var lNameI = $('#lNameInput').val().trim();
			var passwordI = $('#passwordInput').val().trim();
				var md5Password = $.md5(passwordI);	//converts to md5
			var emailI = $('#emailInput').val().trim();
			
			if (validateInput(fNameI)){	//if they entered in an fname
				var query = 'UPDATE faculty SET fName = "' + fNameI + '" WHERE id = ' + facultyId;
				runInsertUpdateDeleteQuery(query);
			}
			if (validateInput(lNameI)){	//if they entered in an lname
				var query = 'UPDATE faculty SET lName = "' + lNameI + '" WHERE id = ' + facultyId;
				runInsertUpdateDeleteQuery(query);
			}
			if (validateInput(passwordI)){	//if they entered in an password
				var query = 'UPDATE faculty SET password = "' + md5Password + '" WHERE id = ' + facultyId;
				runInsertUpdateDeleteQuery(query);
			}
			if (validateInput(emailI)){	//if they entered in an email
				var query = 'UPDATE faculty SET email = "' + emailI + '" WHERE id = ' + facultyId;
				runInsertUpdateDeleteQuery(query);
			}
			
			
		}
		//update paper -------------------------------------------------------------------------------
		else if (sOperation=="updatePaper"){ 
			console.log("Updating paper");
			
			//get selected paper and its id
			var titleI = $('#paperSelect').val();
			var paperId = 0;
			for (i = 0; i < papersData.length; i++){
				if (papersData[i].title==titleI)
					{paperId = papersData[i].id}
			}
			console.log("Paper: " + titleI + ": " + paperId);
			
			//get user inputs
			var titleI = $('#titleInput').val().trim();
			var abstractionI = $('#abstractionInput').val().trim();
			var citationI = $('#citationInput').val().trim();
			var keyswordsI = $('#keywordsInput').val().trim();
				//separate by ,
				var keywordsArray = keyswordsI.split(",");
			
			//update values IF the user entered them 			
			if (validateInput(titleI)){	//if they entered in a title
				var query = 'UPDATE papers SET title = "' + titleI + '" WHERE id = ' + paperId;
				runInsertUpdateDeleteQuery(query);
			}
			if (validateInput(abstractionI)){	//if they entered in an abstraction
				var query = 'UPDATE papers SET abstraction = "' + abstractionI + '" WHERE id = ' + paperId;
				runInsertUpdateDeleteQuery(query);
			}
			if (validateInput(citationI)){	//if they entered in a citation
				var query = 'UPDATE papers SET citation = "' + citationI + '" WHERE id = ' + paperId;
				runInsertUpdateDeleteQuery(query);
			}
			
			//TODO: option to link to authors 
			
			
			//delete and update keywords if the user entered keywords
			if (validateInput(keyswordsI)){	//if they entered in keywords, delete existing keywords
				
				//remove corresponding keywords from paper_keywords table 
				var query = 'DELETE from paper_keywords WHERE id = ' + paperId;			
				runInsertUpdateDeleteQuery(query);
				
				//for each keyword, insert into paper_keywords 
				for (i=0; i<keywordsArray.length; i++){
					//insert into paper_keywords 
					var query = 'INSERT into paper_keywords values (' + paperId + ',"' + keywordsArray[i].trim() + '")';
					runInsertUpdateDeleteQuery(query);
				}
			}
			
			
		}
		//delete faculty -------------------------------------------------------------------------------
		else if (sOperation=="deleteFaculty"){ 
			console.log("Deleting faculty");
			
			//get selected faculty member and their id
			var authorI = $('#authorSelect').val();
				//separate with _
				var authorI2 = authorI.split("_");
				var fNameI2 = authorI2[0];
				var lNameI2 = authorI2[1];
				//get id of this author
				var facultyId = 0;
				for (i = 0; i < facultyData.length; i++){
					if (facultyData[i].fName==fNameI2 && facultyData[i].lName==lNameI2)
						{facultyId = facultyData[i].id}
				}
				console.log("Faculty: " + fNameI2 + " " + lNameI2 + ": " + facultyId);
			
			//delete all the books by this author(id)
			/*for (i = 0; i < authorshipData.length; i++){
				if (authorshipData[i].facultyId==facultyId) {
					
					//delete this paper from database 
					var paperId = authorshipData[i].paperId;
					
					//console.log("deleting book: " + paperId);
					//console.log("authorshipData[i]: " + authorshipData[i]);
					
					//remove paper from paper table
					var query = 'DELETE from papers WHERE id = ' + paperId;			
					runInsertUpdateDeleteQuery(query);
					removeFromObjectAtId(papersData,paperId); //papersData.splice(paperId,1);	//removes this element from papersdata because refreshign doesnt delete it
					
					//remove corresponding keywords from paper_keywords table 
					var query = 'DELETE from paper_keywords WHERE id = ' + paperId;			
					runInsertUpdateDeleteQuery(query);
					
					//remove corresponding entry from authorship table 
					var query = 'DELETE from authorship WHERE paperId = ' + paperId;			
					runInsertUpdateDeleteQuery(query,true);					
				}
			}*/
			  
			//remove faculty member from faculty table 
			var query = 'DELETE from faculty WHERE id = ' + facultyId;			
			runInsertUpdateDeleteQuery(query);
			//facultyData[facultyId];
			removeFromObjectAtId(facultyData,facultyId)//facultyData.splice(facultyId,1);	//removes this element from facultydata because refreshign doesnt delete it
			
			//remove faculty member entry from authorship table 
			var query = 'DELETE from authorship WHERE facultyid = ' + facultyId;			
			runInsertUpdateDeleteQuery(query);
		}
		//delete paper -------------------------------------------------------------------------------
		else if (sOperation=="deletePaper"){ 
			console.log("Deleting paper");
			
			//get selected paper and its id
			var titleI = $('#paperSelect').val();
			var paperId = 0;
			for (i = 0; i < papersData.length; i++){
				if (papersData[i].title==titleI)
					{paperId = papersData[i].id}
			}
			console.log("Paper: " + titleI + ": " + paperId);
			
			//remove paper from paper table
			var query = 'DELETE from papers WHERE id = ' + paperId;			
			runInsertUpdateDeleteQuery(query);
			removeFromObjectAtId(papersData,paperId)//papersData.splice(paperId,1);	//removes this element from papersdata because refreshign doesnt delete it
			
			//remove corresponding keywords from paper_keywords table 
			var query = 'DELETE from paper_keywords WHERE id = ' + paperId;			
			runInsertUpdateDeleteQuery(query);
			
			//remove corresponding entry from authorship table 
			var query = 'DELETE from authorship WHERE paperId = ' + paperId;			
			runInsertUpdateDeleteQuery(query,true);
		}
		
		//getAllData();	//update stored data sets, in case the data was updated by these queries
}

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*deletes from given array the object within it that has the .id passed in
--used to keep local data objects up to date with database manipulations
*/
function removeFromObjectAtId(object, id){
	console.log("removeFromObjectAtId(" + object + "," + id + ") called");
	//console.log("running query: " + query);
	for (i=0; i < object.length; i++){
		if (object.id==id){
			console.log("removing item here: " + i);
			object.splice(i,1);	//remove this object from array 
			break;
		}
	}
	//console.log("spliced object: " + object);
}


//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*called by SubmitBtn(), runs the user selected function
--executes an sql query via ajax call to the sqj database
*/
function runInsertUpdateDeleteQuery(query){
	//console.log("runInsertQuery() called");
	console.log("runInsertQuery() called- running query: " + query);
	
	//AJAX CALL
	//runs ajax call which passes this sql query into the faculty.php and returns all the data
		$.ajax({
			//url : "input.php",
			url: "rs/faculty.php",
			type: "POST",
			data : { input : query },	//input should be like: SELECT * from faculty
			success: function(data,status, xhr)
			{
				//console.log("success");
				 
				//console.log("output: " + data);
				
				
				var isGood = false;	//boolean represents if data is properly formatted
				
				if (data.substr(0,8).trim().toLowerCase()!="warning"){	//makes sure returned data isnt a 'warning: etc etc'
					try {
						outputData = JSON.parse(data);	//parses data into JSON object
						console.log(outputData);
						isGood = true;	//data is properly formatted					
					}
					catch (err) { 
						//alert("Error: Unexpected value in returned data"); 
						console.log("Output is not in JSON format");
						
						//prints output (which here, is an error message) to table
						var table = $('#testTableBody');
						table.empty();
						table.append(data);
						isGood=true;	//because "Values inserted" is still good and should be displayed 
					}
				}
				else { alert("Incorrect query"); }
				
				
				//if (isGood) {generateTable(outputData);}
				//if (isGood && isFinal) {  //if data is properly formatted, sends to funciton which posts it to table
				if (isGood) {  //if data is properly formatted, sends to funciton which posts it to table
					//generateStaticTable(outputData);
					getAllData();	//update stored data sets, in case the data was updated by these queries
					fillStaticPublicTable();	//reset main public table
					//testTable(outputData);
					//alert("Success!");
					//location.reload(true);
					$("#insertSelect").prop("checked", true);	//resets selection form
					buildForm('insert');	//resets selection form
				}	
				
			},
			//if ajax call fails
			error: function (jqXHR, status, errorThrown)
			{
				console.log("failure");
				//if fail show error and server status
				$("#status_text").html('there was an error ' + errorThrown + ' with status ' + textStatus);
			}
		});
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*called when an ADMIN enters a query into the adminInput and clicks run 
--only for testing OR ADMIN purposes
*/
function adminBtnClick(){
	var query = $('#adminInput').val();
	adminQuery(query);
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*only called in the console window, OR BY ADMIN
--for testing OR ADMIN purposes
--runs given query, passes data into adminTable() which puts the resulting output into a table
*/
function adminQuery(query){
	
	//AJAX CALL
	//runs ajax call which passes this sql query into the faculty.php and returns all the data
		$.ajax({
			//url : "input.php",
			url: "rs/admin.php",
			type: "POST",
			data : { input : query },	//input should be like: SELECT * from faculty
			success: function(data,status, xhr)
			{
				//console.log("success");
				 
				console.log("output: " + data);
				
				
				var isGood = false;	//boolean represents if data is properly formatted
				
				if (data.substr(0,8).trim().toLowerCase()!="warning"){	//makes sure returned data isnt a 'warning: etc etc'
					try {
						outputData = JSON.parse(data);	//parses data into JSON object
						console.log(outputData);
						isGood = true;	//data is properly formatted					
					}
					catch (err) { 
						//alert("Error: Unexpected value in returned data"); 
						console.log("Output is not in JSON format");
						
						//prints output (which here, is an error message) to table
						var table = $('#adminTestTableBody');
						table.empty();
						table.append(data);
						//isGood=true;	//because "Values inserted" is still good and should be displayed 
					}
				}
				else { alert("Incorrect query"); }
				if (isGood){
					adminTable(outputData);
				}
				
			},
			//if ajax call fails
			error: function (jqXHR, status, errorThrown)
			{
				console.log("failure");
			}
		});
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*populates adminTable from data passed in by the adminQuery
*/
function adminTable(tableData)
{
	console.log('testTable() called');
	
	var table = $('#adminTestTableBody');
	table.empty();
	
	//get keys and keycount of data
	var keys = Object.keys(tableData[0]);
		console.log("Keys: " + keys);
	var numKeys = Object.keys(tableData[0]).length;
		console.log("numKeys: " + numKeys);
	
	//add headers
	table.append('<tr>');
	for (i=0; i<numKeys; i++) { table.append('<th>' + keys[i] + '</th>'); }
	table.append('</tr>');
	
	//try to create table using data
	//for the length of the data, create rows for the table
	for (i=0; i < tableData.length; i++) {	//for each object
	
		/*$.each( outputData[0], function( key, value ) {
		  console.log( key + ": " + value );
		});*/
		//var values =[];
		
		//create row
		table.append('<tr>');
		$.each( outputData[i], function( key, value ) {	//add each value from the data to the row
			//values.push(value );
			table.append('<td>' + value + '</td>');
		});
		table.append('</tr>');	//end row of table
	}
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*called by the click function of the insert, update, delete radiobuttons
--begins the process of building the form
--runs all functions that are consistent for each operation (ie clear whats already there)
--then calls the function() specific to what operation the user chose 
*/
function buildForm(functionName){
	console.log("buildForm(" + functionName + ") called");
	selectedFunction = functionName;	//sets the selected function to a global scope for later use
	
		//clear and create operationForm
		var operationForm =  $("#operationForm");
		operationForm.empty();	//clear contents
		
		
		//build section ie "insert faculty, update book, etc"
		operationForm.append('<hr>Operation: ');
		
		if (functionName == 'insert'){
			operationForm.append('<input type="radio" name="operation" id="operationInsertFaculty" value="insertFaculty" onclick="fillValuesForm(this.id)">Add new faculty member');
			operationForm.append('<input type="radio" name="operation" id="operationInsertPaper" value="insertPaper" onclick="fillValuesForm(this.id)">Add new paper');
		}
		
		
		else if (functionName == 'update'){
			operationForm.append('<input type="radio" name="operation" id="operationUpdateFaculty" value="updateFaculty" onclick="fillValuesForm(this.id)">Modify existing faculty member');
			operationForm.append('<input type="radio" name="operation" id="operationUpdatePaper" value="updatePaper" onclick="fillValuesForm(this.id)">Modify existing paper');
		}
		
		
		else if (functionName == 'delete'){
			operationForm.append('<input type="radio" name="operation" id="operationDeleteFaculty" value="deleteFaculty" onclick="fillValuesForm(this.id)">Remove existing faculty member');
			operationForm.append('<input type="radio" name="operation" id="operationDeletePaper" value="deletePaper" onclick="fillValuesForm(this.id)">Remove existing paper');
		}
		
		
		var valuesForm = $("#valuesForm");
		valuesForm.empty();
		
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*
--create the label and input text box structure and formatting given a name and id 
--replaces the functionality of appending:
//valuesForm.append('First Name: <input type="text" id="fNameInput" name="fNameInput"><br>');
//valuesForm.append('Last Name: <input type="text" id="lNameInput" name="lNameInput"><br>');
*/
function createLabelInputString(name,id){
	return '<label style="display: inline-block;width: 80pt;text-align: right;" for="' + id + '">' + name + '</label> ' + '<input type="text" id="' + id + '" name="' + id + '"><br>';
		
}
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
/*called when user clicks on the radiobutton for an operation ie "add new faculty"
--builds the cascading forms that correspond with the operation
*/
function fillValuesForm(id){
	console.log("fillOperationForm(" + id + ") called");

	var valuesForm = $("#valuesForm");
	valuesForm.empty();
	
	if (id=='operationInsertFaculty'){
		//<label style="display: inline-block;width: 80pt;text-align: right;" for="sFieldInput">sFieldInput</label> 
		//<input type="text" id="sFieldInput" name="sFieldInput"><br>
		valuesForm.append('<hr>');
		
		valuesForm.append(createLabelInputString("First Name: ", "fNameInput"));
		valuesForm.append(createLabelInputString("Last Name: ", "lNameInput"));
		valuesForm.append(createLabelInputString("Password: ", "passwordInput"));
		valuesForm.append(createLabelInputString("Email: ", "emailInput"));
		valuesForm.append('<br>Please enter values for all of these fields corresponding to a faculty person, then click submit.');
	}
	
	
	else if (id=='operationInsertPaper'){
		valuesForm.append('<hr>');
		
		valuesForm.append(createLabelInputString("Title: ", "titleInput"));
		valuesForm.append(createLabelInputString("Abstraction: ", "abstractionInput"));
		valuesForm.append(createLabelInputString("Citation: ", "citationInput"));
		valuesForm.append(createLabelInputString("Keywords (delineate with commas): ", "keywordsInput"));
		
		valuesForm.append('Author (must already exist in database): <select name="authorSelect" id="authorSelect">');
		for (i=0; i < facultyData.length; i++){	//add each existing author to select input
			$('#authorSelect').append('<option value="' + facultyData[i].fName + "_" + facultyData[i].lName + '">' + facultyData[i].fName + " " + facultyData[i].lName + '</option>');
		}
		valuesForm.append('</select>');
		valuesForm.append('<br>(If author does not already exist, they must be created first)');
		valuesForm.append('<br><br>Please enter values for all of these fields corresponding to a paper, then click submit.');
	}
	
	
	else if (id=='operationUpdateFaculty'){
		valuesForm.append('<hr>Pick Faculty member to edit (must already exist in database): <select name="authorSelect" id="authorSelect">');
		for (i=0; i < facultyData.length; i++){	//add each existing author to select input
			$('#authorSelect').append('<option value="' + facultyData[i].fName + "_" + facultyData[i].lName + '">' + facultyData[i].fName + " " + facultyData[i].lName + '</option>');
		}
		valuesForm.append('<br><br>Enter in values for the fields you wish to update for this faculty memeber, then click submit.<br>');
		
		valuesForm.append(createLabelInputString("First Name: ", "fNameInput"));
		valuesForm.append(createLabelInputString("Last Name: ", "lNameInput"));
		valuesForm.append(createLabelInputString("Password: ", "passwordInput"));
		valuesForm.append(createLabelInputString("Email: ", "emailInput"));
	}
	
	
	else if (id=='operationUpdatePaper'){
		valuesForm.append('<hr>Pick paper to edit (must already exist in database): <select name="paperSelect" id="paperSelect">');
		for (i=0; i < papersData.length; i++){	//add each existing paper to select input
			$('#paperSelect').append('<option value="' + papersData[i].title + '">' + papersData[i].title + '</option>');
		}
		valuesForm.append('<br><br>Enter in values for the fields you wish to update for this paper, then click submit.<br>');
		
		valuesForm.append(createLabelInputString("Title: ", "titleInput"));
		valuesForm.append(createLabelInputString("Abstraction: ", "abstractionInput"));
		valuesForm.append(createLabelInputString("Citation: ", "citationInput"));
		valuesForm.append(createLabelInputString("Keywords (delineate with commas): ", "keywordsInput"));
	}
	
	
	else if (id=='operationDeleteFaculty'){
		valuesForm.append('<hr>Pick Faculty member to delete (must already exist in database): <select name="authorSelect" id="authorSelect">');
		for (i=0; i < facultyData.length; i++){	//add each existing author to select input
			$('#authorSelect').append('<option value="' + facultyData[i].fName + "_" + facultyData[i].lName + '">' + facultyData[i].fName + " " + facultyData[i].lName + '</option>');
		}
		//valuesForm.append('<br>Warning: This will also delete any papers associated with this author');
		
	}
	
	
	else if (id=='operationDeletePaper'){
		valuesForm.append('<hr>Pick paper to delete (must already exist in database): <select name="paperSelect" id="paperSelect">');
		for (i=0; i < papersData.length; i++){	//add each existing paper to select input
			$('#paperSelect').append('<option value="' + papersData[i].title + '">' + papersData[i].title + '</option>');
		}
	}
	
	
	
}






/*FUNCTIONS THE USER CAN RUN
484project: 
authorship
- facultyId 
- paperId 

faculty 
- id 
- fName 
- lName 
- password 
- email 

paper_keywords 
- id 
- keyboard 

papers 
- id 
- title 
- abstract 
- citation 

INSERT-------------------------------------------------
--add faculty: 
	- get increment id, fname, lname, password, email to faculty
	- did they write paper? 
		- if so, add facultyid and paperid to authorship 
		- if not, done

--add paper
	- get title, abstract, citation, increment id 
		- link to existing author? 
			- if so, provide id or name 
			- ir not, create author 
	
	
UPDATE---------------------------------------------------
--update faculty
	- enter name (get ID)
	- show all fields using current dynamic field creation
		- fname, lname, password, email 

--update book
	- enter name (get ID)
		- show all fields
			- title, 
		- add keywords (comma delineated?) 
			- for each: insert into paper_keywords values (id, keyword)
		

	
DELETE-----------------------------------------------------
-- delete faculty 
	- enter name (get ID)
	- delete from faculty where id = _
	- delete associated books: 
		- get associated paperid's 
		- delete from authorship where facultyID = _ 
		- delete from papers where id=_
		- delete from paper_keywords where id=_
		
		
-- delete book 
	- enter title (get ID)
	- delete from papers where id = _
	(- DONT change id of existing authors)
	
-- delete keywords for book 
	- enter title (get ID number)
	- show keywords (by ID number)
	- use checkboxes to pick keywords to remove 
	- for each keyword: delete * from _ whre id = _ and keyword =_ 
*/


