cancelled = false;

function cancelDownload() {
	cancelled = true;
}

function getImage() {
	return document.getElementsByClassName('download')[0].firstChild.href;
}

function downloadImages(amount = 0) {
	chrome.tabs.query( { url: "*://*.furaffinity.net/view/*" }
	, async tabs => {
		if (amount <= 0 || amount > tabs.length) {
			amount = tabs.length;
		}
		for (const tab of tabs.slice(0, amount)) {
			await new Promise(r => setTimeout(r, 1125));
			if (cancelled) {
				cancelled = false;
				break;
			}
			chrome.scripting.executeScript({ target: {tabId: tab.id}, func: getImage }
			, img => {
				if (img.length > 0) {
					chrome.downloads.download({ url: img[0].result, saveAs: false });
					chrome.tabs.remove(tab.id);
				}
			});
		}
	});
}

chrome.runtime.onMessage.addListener( function(request) {
	if (request.cancel) {
		cancelDownload();
	} else {
		downloadImages(request.amount);
	}
});
