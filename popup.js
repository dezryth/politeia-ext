document.addEventListener('DOMContentLoaded', function() {
    checkStorage();
    document.getElementById('pubKey').addEventListener('change', validateInput);
    document.getElementById('privKey').addEventListener('change', validateInput);
    document.getElementById('savebtn').addEventListener('click', saveKey);
    document.getElementById('importbtn').addEventListener('click', importKey);
    document.getElementById('showpassword').addEventListener('click', showPassword);
});

function checkStorage() {
    chrome.storage.sync.get('pubKey', function(data) {
        if (data.pubKey) {
            var x = document.getElementsByClassName('keys');
            for (i = 0; i < x.length; i++) {
                x[i].style.display = 'none';
            }
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
        document.getElementById('savebtn').disabled = true;
    } 
    else 
    {
        document.getElementById('savebtn').removeAttribute('disabled');
    }
};

function saveKey() {
    let pubKey = document.getElementById('pubKey').value;
    let privKey = document.getElementById('privKey').value;
    let password = document.getElementById('password').value;
    
    let ePubKey = CryptoJS.AES.encrypt(pubKey, password).toString();
    let ePrivKey = CryptoJS.AES.encrypt(privKey, password).toString();

    // Store keys
    chrome.storage.sync.set({pubKey: ePubKey, privKey: ePrivKey}, function () {
        // Run checkStorage to hide elements
        checkStorage(); 
    });              
};

function importKey() {
    let password = document.getElementById('password').value;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "injectKey", passphrase: password}, function(response) {
            console.log(response.result);
        });
    });
};