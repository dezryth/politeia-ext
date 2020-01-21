chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({pubKey: '', privKey: ''}, function() {
		console.log("Thank you for using Politeia Identity Manager.");
	});
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'proposals.decred.org'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});