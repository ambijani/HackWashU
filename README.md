# Email Verifier Chrome Extension

This repository contains a Chrome extension that uses the Gmail API and OpenAI to find and open verification links from the most recent email. The extension allows users to automatically verify emails and store the history of verified websites in a MongoDB database.

## Features
- **Automatic Email Verification:** The extension listens for email verification requests and automatically verifies emails by opening the provided verification link.

- **OpenAI Integration:** It uses OpenAI to assist in identifying and extracting verification links from email content.

- **MongoDB Integration:** The extension stores the history of verified websites in a MongoDB database for future reference.

## Prerequisites
Before using this Chrome extension, you should have the following prerequisites:

- [Google Developer Console](https://console.developers.google.com/): You need to set up a project and enable the Gmail API to allow the extension to access your Gmail account.
+++++++++++++ authentication and mail api


- [OpenAI API Key](https://beta.openai.com/): You'll need an API key to use OpenAI for email content analysis.

- [MongoDB](https://www.mongodb.com/): You should have a MongoDB database set up where the verified website history can be stored.

## Getting Started
Follow these steps to set up and use the Chrome extension:

1. Clone this repository or download the code.

2. Modify the following parts of the code to include your API keys, URLs, and endpoints:
   - Replace `process.env.OPENAI-KEY` with your OpenAI API key.
   - Update the URLs and endpoints for your MongoDB server and other API calls as necessary.

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`.
   - Enable "Developer mode" (usually a toggle switch on the top right).
   - Click on "Load unpacked" and select the directory where the extension code is located.

4. Configure the extension:
   - Click on the extension icon in the Chrome toolbar to configure your Gmail account and authorization.

5. Use the extension:
   - The extension will automatically listen for verification emails and open the verification links.
   - The history of verified websites will be stored in your MongoDB database.

## Manifest File (manifest.json)
The manifest file (`manifest.json`) provides information about the extension, permissions, and how it should behave in the browser.

## Server-side Code
The extension interacts with a server running on `http://34.27.8.186:3000/` for user registration and storing the history of verified websites. You need to have this server set up and running with the appropriate endpoints for the extension to work correctly. We have index.js and cors.js working on the server side. We also have a python script that uses openAI API to detect the verification URL.

## Frontend Code
The extension's frontend consists of the popup HTML file (`popup.html`) and JavaScript file (`popup.js`). These files handle user interactions, including user registration and triggering email verification.

## Background Code
The background JavaScript code handles the core functionality of the extension. It listens for verification requests, verifies emails, and communicates with the server and OpenAI.
## Styles (style.css)
The CSS file (`style.css`) provides styling for the popup and dropdown menus in the extension.

## OpenAI Integration
The code includes an OpenAI API key and uses the OpenAI engine to assist in identifying and extracting verification links from email content. Ensure your OpenAI API key is properly configured and secured.

## MongoDB Integration
The extension interacts with a MongoDB database to store the history of verified websites. Make sure your MongoDB server is accessible, and you have configured the server endpoints correctly in the code.

## Disclaimer
Please be cautious about sharing your API keys, endpoints, and other sensitive information. This README provides an overview of the code's functionality, but it's crucial to review and secure your implementation properly.

For any questions or issues related to this Chrome extension, please refer to the original code and the documentation for the services it integrates with (Google API, OpenAI, and MongoDB).

<<<<<<< HEAD
Enjoy using the Email Verifier Chrome Extension!
=======
Enjoy using the Email Verifier Chrome Extension!
>>>>>>> 16507ca227b886d7e7fa75672ce4eb0d3fd115ed
