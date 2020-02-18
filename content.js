initialize();

// Message listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.method === 'setClipboard') {
            sendResponse(setClipboard(request.value));
            return;
        }
    sendResponse({result: "fail"});
});

// Functions
function initialize() {    
    let textarea = document.getElementById('pidClipboard');
    if (!textarea) {
        let script = document.createElement('script');
        script.textContent = `
        input = document.createElement("input");
        input.id = 'pidClipboard';
        document.body.appendChild(input);
        `;
        (document.head||document.documentElement).appendChild(script);  
    }      
}

function setClipboard(value) {
    let result = false;
    let input = document.getElementById('pidClipboard');
        
    input.style.visibility = "visible";
    input.value = value;
    input.select();

    if (document.execCommand('copy')) {
        result = true;
    } else {
        console.error('Pid extension failed to set clipboard content.');
    }
        
    input.value = '';
    input.style.visibility = "hidden";
    return result;    
};