const manifest = chrome.runtime.getManifest()
const header = document.getElementsByClassName('ext-version')
if (header.length > 0) {
	const text = document.createTextNode(manifest.version)
	header[0].appendChild(text)
}

document.addEventListener('click', (e) => {
	if (e.target instanceof HTMLElement) {
		chrome.runtime.sendMessage({ type: e.target.id })
	}
	e.preventDefault()
})
