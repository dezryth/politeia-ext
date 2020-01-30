// Message listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.command === 'injectKey') {
            importKey(request.passphrase);
        }
    sendResponse({result: "success"});
});

function importKey(password) {
    // Validate password and decrypt keys
    var letterNumber = /^[0-9a-zA-Z]+$/;
    var publicKey;
    var secretKey;
    chrome.storage.sync.get('pubKey', function(data) {
        publicKey = CryptoJS.AES.decrypt(data.pubKey, password).toString(CryptoJS.enc.Utf8);
        if (!publicKey.match(letterNumber))
        {
            alert("You entered an incorrect password to the Politeia Identity Manager extension.");
            return;
        }
        chrome.storage.sync.get('privKey', function(data) {
            secretKey = CryptoJS.AES.decrypt(data.privKey, password).toString(CryptoJS.enc.Utf8);
            clickButton('Import identity', function () {
                // Paste in decrypted keys    
                document.getElementById('publicKey').setAttribute('value', publicKey);
                document.getElementById('secretKey').setAttribute('value', secretKey);
                
                // TO DO: Figure out how to enable the submit button
            });
        });                          
    });
};

function clickButton(buttonText, callback) {
     // Find the button on user page and click it
     var buttons = document.getElementsByTagName('button');
     var searchText = buttonText;
     var button;
     for (var i = 0; i <= buttons.length; i++) {
      if (buttons[i].innerText == searchText) {
       button = buttons[i];
       break;
      }
     }

    button.removeAttribute('disabled');
    button.click();
    
    if (callback) {
        setTimeout(callback, 500);
    }    
};