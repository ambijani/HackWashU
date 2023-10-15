document.addEventListener('DOMContentLoaded', function () {
    const verificationForm = document.getElementById('verification-form');
    let currentTabInfo = {}; // Object to store the current tab's info

    // Get the active tab's info as soon as the popup is loaded
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        console.log(currentTab.title + ':' + currentTab.url); // Here is the title and URL
        currentTabInfo = {
            title: currentTab.title,
            url: currentTab.url
        };

        // Display the tab info in the HTML
        const tabInfoDiv = document.createElement('div');
        tabInfoDiv.textContent = `Name: ${currentTab.title}, URL: ${currentTab.url}`;
        document.body.appendChild(tabInfoDiv);

        // Send the tab information to the root endpoint '/'
        fetch('http://34.27.8.186:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentTabInfo),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Listen for form submission to handle registration
    verificationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get the email and password from the form
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Construct the data to be sent in the POST request
        const postData = {
            email,
            password,
            tabInfo: currentTabInfo // Include the tab's title and URL
        };

        // Make a POST request to your server with the email, password, and tab info
        fetch('http://34.27.8.186:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
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
