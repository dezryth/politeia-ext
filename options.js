document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('clearbtn').addEventListener('click', clearStorage);
  });

function clearStorage() {
    chrome.storage.sync.set({pubKey: '', privKey: ''}, function() {
        document.getElementById('result').innerHTML = "Storage Cleared!";        
    })        
};