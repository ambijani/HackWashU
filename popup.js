document.addEventListener('DOMContentLoaded', function () {
    const verificationForm = document.getElementById('verification-form');
    
    // Add this section for getting tab info
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        console.log(currentTab.title + ':' + currentTab.url); // Here is the title and URL
        // You might want to show this information in your HTML, you can do it here
        // For example, create a new div or use an existing one to display the information
        const tabInfoDiv = document.createElement('div');
        tabInfoDiv.textContent = `Name: ${currentTab.title}, URL: ${currentTab.url}`;
        document.body.appendChild(tabInfoDiv);
    });

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
