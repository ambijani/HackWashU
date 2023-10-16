let googleUser = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'authenticate') {
      chrome.identity.getAuthToken({ interactive: true }, function(token) {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, message: chrome.runtime.lastError.message });
          return;
        }
        // Validate the token and verify the account with Gmail API
        verifyGoogleAccount(token).then(response => {
          if (response.verified) {
            googleUser = response.user;
            // Send the verified account information to the server for MongoDB storage
            sendToServer(googleUser);
            sendResponse({ success: true, user: googleUser });
          } else {
            sendResponse({ success: false, message: 'Failed to verify the Google account.' });
          }
        });
      });
      return true; // Required to indicate that response will be sent asynchronously
    }
  });
  
  async function verifyGoogleAccount(token) {
    // Call Gmail API to confirm the account authenticity
    // Note: Real implementation would require proper error handling
    let response = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    let user = await response.json();
    return {
      verified: response.ok,
      user: user.emailAddress 
    };
  }
  
  function sendToServer(user) {
    // data to server via IP
    fetch('https://yourserver.com/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  }
  