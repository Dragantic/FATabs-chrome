let manifest = chrome.runtime.getManifest();
let header = document.getElementsByClassName("ext-version");
if (header.length > 0) {
	let text = document.createTextNode(manifest.version);
	header[0].appendChild(text);
}

document.addEventListener("click", (e) => {
	if (e.target) {
		let target = <HTMLElement>e.target;
		switch (target.id) {
		case "img-download-left":
			chrome.tabs.query({ active: true, currentWindow: true })
			.then( (active) => {
				chrome.runtime.sendMessage({left: active[0].index});
			});
			break;
		case "img-download-right":
			chrome.tabs.query({ active: true, currentWindow: true })
			.then( (active) => {
				chrome.runtime.sendMessage({right: active[0].index});
			});
			break;
		case "cancel-download":
			chrome.runtime.sendMessage({cancel: true});
			break;
		default:
			chrome.runtime.sendMessage({});
		}
		e.preventDefault();
	}
});
