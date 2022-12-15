document.addEventListener("click", (e) => {
	if (e.target) {
		let target = <HTMLElement>e.target;
		if (target.id === "img-download-all") {
			chrome.runtime.sendMessage({amount: 0});
		} else if (target.id === "img-download-10") {
			chrome.runtime.sendMessage({amount: 10});
		} else if (target.id === "img-download-25") {
			chrome.runtime.sendMessage({amount: 25});
		} else if (target.id === "img-download-50") {
			chrome.runtime.sendMessage({amount: 50});
		} else if (target.id === "cancel-download") {
			chrome.runtime.sendMessage({cancel: true});
		}
		e.preventDefault();
	}
});
