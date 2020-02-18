// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('pubKey').addEventListener('change', validateInput);
    document.getElementById('privKey').addEventListener('change', validateInput);
    document.getElementById('saveBtn').addEventListener('click', saveKey);
    document.getElementById('recallBtn').addEventListener('click', recallKey);
    document.getElementById('showPassword').addEventListener('click', showPassword);
    document.getElementById('copyPubKey').addEventListener('click', function() { 
        copyToClipboard(publicKey); 
        document.getElementById('copyPubKey').innerHTML = 'Copied!';
        setTimeout(function(){ document.getElementById('copyPubKey').innerHTML = 'Copy Public Key'; }, 3000);
    });
    document.getElementById('copyPrivKey').addEventListener('click', function() { 
        copyToClipboard(secretKey);
        document.getElementById('copyPrivKey').innerHTML = 'Copied!';
        setTimeout(function(){ document.getElementById('copyPrivKey').innerHTML = 'Copy Private Key'; }, 3000);
    });            
    initialize();
    
    // Uncomment below if testing to save time. Sets fake identity and password of '1'
    //saveKey();
});
window.addEventListener('load', (event) => {
    chrome.tabs.executeScript(null, {
      file: 'content.js', }, 
    );
});

// Global Variables
var publicKey;
var secretKey;

// Functions
function initialize() {
    // hide copy keys textboxes until recalled
    var z = document.getElementsByClassName('copyKeys');
    for (i = 0; i < z.length; i++) {
        z[i].style.display = 'none';
    }
    
    chrome.storage.sync.get('pubKey', function(data) {
        if (data.pubKey) {
            // hide keys div since already stored
            var x = document.getElementsByClassName('keys');
            for (i = 0; i < x.length; i++) {
                x[i].style.display = 'none';
            }
            // show stored related elements
            var y = document.getElementsByClassName('stored');
            for (i = 0; i < x.length; i++) {
                y[i].style.display = 'block';
            }
        }        
    });
};

function showPassword() {
 let password = document.getElementById('password');

 if (password.type === "password") {
        password.type = 'text';
    } else {
        password.type = 'password';
    }
};

function validateInput() {
    let pubKey = document.getElementById('pubKey').value;
    let privKey = document.getElementById('privKey').value;
    
    if (pubKey.length < 64 || privKey.length < 128)
    {
        document.getElementById('saveBtn').disabled = true;
    } 
    else 
    {
        document.getElementById('saveBtn').removeAttribute('disabled');
    }
};

function saveKey() {    
    let pubKey = document.getElementById('pubKey').value;
    let privKey = document.getElementById('privKey').value;
    let password = document.getElementById('password').value;    
    
    // Uncomment below if testing to save time. No, the identity isn't valid.    
    //if (pubKey === ''){ pubKey = 'cc0f0a8df403d8516049d9364e45fac0cf10ce3019eac27fd970ff4ba4d582c9'; privKey = 'e6810fc9b7273a8e148a084986d17d74a0c5040b23921b5859d777187a453e5acc0f0a8bf453d8516049e9764e49fac0cf10ce3019eac27fd980ff4ba4d582c9'; password = '1'; }        

    let ePubKey = CryptoJS.AES.encrypt(pubKey, password).toString();
    let ePrivKey = CryptoJS.AES.encrypt(privKey, password).toString();

    // Store keys
    chrome.storage.sync.set({pubKey: ePubKey, privKey: ePrivKey}, function () {
        // Run initialize to hide elements
        initialize(); 
    });              
};

function recallKey() {
    let password = document.getElementById('password').value;

    let letterNumber = /^[0-9a-zA-Z]+$/;
    chrome.storage.sync.get('pubKey', function(data) {
        publicKey = CryptoJS.AES.decrypt(data.pubKey, password).toString(CryptoJS.enc.Utf8);
        if (!publicKey.match(letterNumber))
        {
            console.log("Incorrect Password entered to PiD extension.");
            return;
        } else {
            chrome.storage.sync.get('privKey', function(data) {
                secretKey = CryptoJS.AES.decrypt(data.privKey, password).toString(CryptoJS.enc.Utf8);                
            }); 

            // Hide password elements
            let x = document.getElementsByClassName('locked');
            for (i = 0; i < x.length; i++) {
                x[i].style.display = 'none';
            }

            // show copy keys text boxes
            let y = document.getElementsByClassName('copyKeys');
            for (i = 0; i < y.length; i++) {
                y[i].style.display = 'block';
            } 
        }                        
    });
};

function copyToClipboard(value) {
    let text = value;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {method: "setClipboard", value: text}, function(response) {
            console.log('Value copied to clipboard successfully by PiD extension.', response);
        });
    });
};