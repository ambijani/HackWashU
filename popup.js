document.addEventListener('DOMContentLoaded', function () {
    // Set up the auth token event listener for 'Auth' button
    function handleAuth() {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
            const encrypted_token = btoa(token);
            console.log("Encrypted token:", encrypted_token);
            fetch('http://34.27.8.186:3000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({token: encrypted_token}),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    const verificationForm = document.getElementById('verification-form');
    let currentTabInfo = {};

    // Get the active tab's info
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currentTab = tabs[0];
        currentTabInfo = {
            title: currentTab.title,
            url: currentTab.url
        };

        const tabInfoDiv = document.createElement('div');
        tabInfoDiv.textContent = `Name: ${currentTab.title}, URL: ${currentTab.url}`;
        document.body.appendChild(tabInfoDiv);
    });

    // Function to handle registration
    function handleRegistration() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const postData = {
            email,
            password,
            tabInfo: currentTabInfo
        };

        fetch('http://34.27.8.186:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Listen for form submission to handle registration
    verificationForm.addEventListener('submit', function (event) {
        event.preventDefault();
        handleRegistration();
    });

    // 'Authorize' button behavior
    document.getElementById('authorize').addEventListener('click', function(event) {
        event.preventDefault();
        handleRegistration(); // Call the same function as the form submission
    });

	// Set up the auth token event listener for 'Auth' button
    document.getElementById('Auth').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent any default button click behavior
        handleAuth();
    });
});
