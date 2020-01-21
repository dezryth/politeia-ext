document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById("button");
  addListener();
  });

function clearStorage() {
    chrome.storage.sync.set({pubKey: '', privKey: ''}, function() {
        document.getElementById('result').innerHTML = "Storage Cleared!";        
    })        
};

function addListener() {
 var button = document.getElementById('button')
 if (button){
     button.addEventListener('click', function() {
      clearStorage();
     })
 }
};