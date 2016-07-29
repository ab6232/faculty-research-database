<!DOCTYPE html>
<!--Database group 8 project
--5/12/16
--Andrew Behrens, Matthew Hoover, Brednan McDonalds, Watson Powers, Dillon Puglisi
--kelvin link: http://kelvin.ist.rit.edu/~dbgroup8/

--main page for interface
--most elements are created dynamically and assigned click functions by the javascript mainScript.js
--faculty members can log in giving them greater control of the interface
-->
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>Research Database</title>
	<link rel="stylesheet" type="text/css" href="myStyle.css">
	
	
	<!--jQuery		http://jquery.com/download/	-->
    <!--<script src="https://code.jquery.com/jquery-2.2.2.min.js" integrity="sha256-36cp2Co+/62rEAAYHLmRCPIych47CvdM+uTBJwSzWjI=" crossorigin="anonymous"></script>-->
    <script type="text/javascript" src="js/jquery-1.12.3.js"></script>

	<!--UI (w/Sortable Tabs) plugin		https://jqueryui.com/sortable/-->	
	<link rel="stylesheet" href="js/plugins/ui/jquery-ui.css">
    <script src="js/plugins/ui/jquery-ui.js"></script>
	
	<!--DataTables -->
	<link rel="stylesheet" href="js/plugins/datatables/jquery.dataTables.min.css">
    <script src="js/plugins/datatables/jquery.dataTables.min.js"></script>
	
	<!--Modal plugin -->	<!-- http://jquerymodal.com/ -->
	<script src="js/plugins/modal/jquery.modal.js" type="text/javascript" charset="utf-8"></script>
	<link rel="stylesheet" href="js/plugins/modal/jquery.modal.css" type="text/css" media="screen" />
	
	<!--MD5 plugin-->
	<script type="text/javascript" src="js/plugins/md5/jquery.md5.js"></script>
	
	<!--custom script-->
	<script src="mjs/mainScript.js" type="text/javascript"></script>
    
	
</head>
<body>

	<!--THIS IS THE DIV FOR THE HEADER OF THE PAGE -->
	<div id="header">
	
		<!--THIS IS THE DIV WHERE USERS CAN LOGIN AND LOGOUT -->
		<div id="loginDiv">	<!--top bottom left right-->
			<h3 id="loginHeader">Faculty Login:</h3>
			
			<label id="usernameLabel" for="username">Username:</label><br> <input type="text" id="userInpt" name="username"><br>
			<label id="passwordLabel" for="password">Password:</label><br> <input type="password" id="passInpt" name="password"><br>
			<button id="loginBtn" type="button" onclick="login()" style = "margin-top: 5pt;float:right;">Login</button>
			<button id="logoutBtn" type="button" onclick="logout()"  style = "margin-top: 5pt;float:right;">Logout</button>
			
		</div>
		
		<div style="clear:both;"></div>
		
	</div>


	<!--This contains the data outputs (table display)and controls (buttons)-->
	<div id="container">
		<h1 style="text-align: center;">Faculty Research Database</h1>
		
		<!--where the main data is presented -->
		<div id="display">
			<table id='outputTable'>
				
				
			</table>
		</div>
		
		<!--THIS IS THE DIV WHERE ADMINS CAN FURTHER MANIPULATE THE DATABASE -->
		<div id="adminDiv" style="text-align: center;"> 
			ADMIN: Run any other queries: <input id="adminInput" type="text">
			<button type='button' id='adminBtn' name='adminBtn'>Enter</button>
		</div>
		
		<!--THIS IS THE DIV WHERE FACULTY CAN MANIPULATE THE DATABASE -->
		<div id="manipulator">
			<!--<form id='mainForm' action="" method="get">-->
			<div id='mainForm'>	
				<h3>Faculty Access:</h3>
				Use this form to make changes to the database.<br>
				Note: No inputs may include semi-colons (;)
				
				<!--<button type='button' id='facultyBtn' name='facultyBtn'>Submit</button>-->	<!--makes page not refresh!-->
				
				<!--<form action="">
				  Function: <input type="radio" name="actionType" id="insertSelect" value="insert"> Insert
				  <input type="radio" name="actionType" id="updateSelect" value="update"> Update
				  <input type="radio" name="actionType" id="deleteSelect" value="delete"> Delete
				</form>-->
				
				<!--<button type='button' id='submitBtn' name='submitBtn'>Submit</button>-->	<!--makes page not refresh!-->
				
			</div>
			<!--</form>	-->
			<br><button type='button' id='submitBtn' name='submitBtn'>Submit</button>
		</div>
		
		<!--THIS IS THE DIV WHERE THE PUBLIC CAN MANIPULATE THE DATABASE -->
		<div id='publicManipulator'>
			Enter query (only SELECTs permitted): <input id="publicInput" type="text">
			<button type='button' id='publicBtn' name='publicBtn'>Submit</button>
		</div>
		<hr style="margin: 10pt 5pt 10pt 5pt;">	<!--top right bottom left-->
		<p id='instructions'>Only run one query at a time. Do not use ";"</p>
		
		<!--THIS IS THE DIV WHERE SOME FACULTY OUTPUTS ARE DISPLAYED -->
		<div id="testOutputDiv">
			<p id="output" style = 'padding: 7pt 2pt 2pt 2pt; font-style: italic;'></p>
			<table id="testTable">
				<tbody id='testTableBody'>
				
				</tbody>
			</table>
			
		</div>	

		<!--THIS IS THE DIV WHERE ADMIN OUTPUTS ARE DISPLAYED -->
		<div id="adminOutputDiv">
			<p id="output" style = 'padding: 7pt 2pt 2pt 2pt; font-style: italic;'></p>
			<table id="adminTestTable">
				<tbody id='adminTestTableBody'>
				
				</tbody>
			</table>
			
		</div>			
				
		
			
		
		
	</div>
	
	
</body>
</html>