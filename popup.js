document.addEventListener("click", (e) => {
	if (e.target.id === "img-download-all") {
		chrome.runtime.sendMessage({amount: 0});
	} else if (e.target.id === "img-download-10") {
		chrome.runtime.sendMessage({amount: 10});
	} else if (e.target.id === "img-download-25") {
		chrome.runtime.sendMessage({amount: 25});
	} else if (e.target.id === "img-download-50") {
		chrome.runtime.sendMessage({amount: 50});
	} else if (e.target.id === "cancel-download") {
		chrome.runtime.sendMessage({cancel: true});
	}
	e.preventDefault();
});
