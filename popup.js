//create backend server (Node.js), store email acc/access tokens
//endpoints for auth, user management, accessing Gmail data via API

//handle user auth using OAuth 2.0

//load environment variables into node.js
//require('dotenv').config();
document.addEventListener('DOMContentLoaded', function () {
	const verificationForm = document.getElementById('verification-form');
 
	verificationForm.addEventListener('submit', function (event) {
    	event.preventDefault();

    	const email = document.getElementById('email').value;
    	const password = document.getElementById('password').value;

    	// Make a POST request to your server with the email and password
    	fetch('http://34.27.8.186:3000/register', {
        	method: 'POST',
        	headers: {
            	'Content-Type': 'application/json',
        	},
        	body: JSON.stringify({ email, password }),
    	})
    	.then(response => response.json())
    	.then(data => {
        	// Handle the server response here
        	console.log(data);
        	// You can display a success message or handle errors
    	})
    	.catch(error => {
        	// Handle any errors that occur during the fetch
        	console.error('Error:', error);
    	});
	});
});



