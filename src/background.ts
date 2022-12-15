let cancelled: boolean;

function cancelDownload(): void {
	cancelled = true;
}

function downloadImages(amount: number = 0): void {
	chrome.tabs.query( { url: "*://*.furaffinity.net/view/*" }
	, async (tabs) => {
		if (amount <= 0 || amount > tabs.length) {
			amount = tabs.length;
		}
		cancelled = false;
		for (const tab of tabs.slice(0, amount)) {
			await new Promise(r => setTimeout(r, 1125));
			if (cancelled) {
				break;
			}
			if (tab.id === undefined) {
				continue;
			}
			let id: number = tab.id;
			try {
				chrome.scripting.executeScript({ target: {tabId: id}, func: () => {
					return (<HTMLAnchorElement>document
						.getElementsByClassName('download')[0].firstChild).href;
				}}, (img) => {
					if (img.length > 0) {
						chrome.downloads.download({ url: img[0].result, saveAs: false });
						chrome.tabs.remove(id);
					}
				});
			} catch (err) {
				console.error(`failed to execute script: ${err}`);
			}
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
