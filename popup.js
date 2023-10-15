// Function to fetch and display user data
function fetchAndDisplayUserData() {
    fetch('http://34.27.8.186:3000/get-user-data')
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data); // Log the data here

            // `data` is an object where keys are emails and values are arrays of { title, url } objects
            for (const [email, records] of Object.entries(data)) {
                // Check if a dropdown for this user already exists
                let existingDropdown = document.getElementById(`dropdown-${email}`);
                if (existingDropdown) {
                    // If the dropdown exists, clear its content and refill it
                    let dropdownContent = existingDropdown.querySelector('.dropdown-content');
                    dropdownContent.innerHTML = ''; // Clear existing content
                    records.forEach(record => {
                        const { title, url } = record;
                        const contentItem = document.createElement('a');
                        contentItem.href = url;
                        contentItem.textContent = `${title}: ${url}`;
                        dropdownContent.appendChild(contentItem);
                    });
                } else {
                    // If the dropdown doesn't exist, create it
                    createDropdownForUser(email, records);
                }
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });
}

// Function to dynamically create a dropdown for a user
// Function to dynamically create a dropdown for a user
function createDropdownForUser(email, records) {
    // Create the dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'dropdown-container';
    dropdownContainer.id = `dropdown-${email}`; // Set the ID here for the container, not the button

    // Create the dropdown button
    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'dropdown-button';
    dropdownButton.textContent = email;
    dropdownContainer.appendChild(dropdownButton); // append the button to the container

    // Create the dropdown content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    records.forEach(record => {
        const { title, url } = record;
        const contentItem = document.createElement('a');
        contentItem.href = url;
        contentItem.textContent = `${title}: ${url}`;
        dropdownContent.appendChild(contentItem);
    });

    // Append everything to the dropdown container
    dropdownContainer.appendChild(dropdownContent);

    // Add click event listener to the dropdown button
    dropdownButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents the click from propagating to parent elements

        let dropdownContent = this.nextElementSibling;
        
        // Toggle the 'show' class
        dropdownContent.classList.toggle('show');
    });

    // This event listener closes the dropdown if you click outside of it
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-button')) {
            let dropdowns = document.getElementsByClassName("dropdown-content");
            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    });

    // Append the dropdown container to the body or another parent element
    document.body.appendChild(dropdownContainer);
}


// This will close any dropdown if you click outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-button')) {
        let dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};
document.addEventListener('DOMContentLoaded', function () {
    fetchAndDisplayUserData();
    let userToken = null; // Variable to store the temporary ID
    let currentTabInfo = {};

    // Set up the auth token event listener for 'Auth' button
    function handleAuth() {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
                return;
            }
            const encrypted_token = btoa(token);

            userToken = encrypted_token; // Store the token in the global variable
            populateCurrentTabInfo();
            fetch('http://34.27.8.186:3000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: encrypted_token, tempId: userToken }), // include the new tempId
            })
                .then(response => {
                    if (!response.ok) {
                        // If the response is not 2xx, it's considered an error
                        // and we throw it to the catch block
                        return response.text().then((text) => { throw new Error(text); });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    }


    const verificationForm = document.getElementById('verification-form');

    function populateCurrentTabInfo() {
        if (userToken) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                var currentTab = tabs[0];
                currentTabInfo = {
                    title: currentTab.title,
                    url: currentTab.url,
                    tempId: userToken // Using the userToken as the tempId
                };

                // Send the currentTabInfo to the server
                fetch('http://34.27.8.186:3000/', { // the URL to your server endpoint
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(currentTabInfo), // send the currentTabInfo as JSON
                })
                    .then(response => response.json()) // if you're expecting a JSON response
                    .then(data => {
                        console.log('Success:', data);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            });
        } else {
            console.error("userToken has not been set before trying to populate currentTabInfo");
        }
        fetch('http://34.27.8.186:3000/get-url').then(response => response.json()).then(url => {window.open(url["value"])}).catch(error => {console.error('Error:', error);} );
    }


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
    document.getElementById('authorize').addEventListener('click', function (event) {
        event.preventDefault();
        handleRegistration(); // Call the same function as the form submission
    });

    // Set up the auth token event listener for 'Auth' button
    document.getElementById('Auth').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent any default button click behavior
        handleAuth();
    });
});
  