let running = false
let cancelled: boolean

function cancelDownload(): void {
	cancelled = true
}

function downloadImages(index: number | undefined = undefined) {
	if (running) {
		return
	}
	running = true

	chrome.tabs.query({ url: "*://*.furaffinity.net/view/*" })
	.then( async (tabs) => {
		let first = 0, last = tabs.length - 1
		if (index !== undefined) {
			if (index < 0) {
				index = -index
				for (const tab of tabs) {
					if (tab.index >= index) {
						last = tabs.indexOf(tab) - 1
						break
					}
				}
			} else {
				for (const tab of tabs) {
					if (tab.index > index) {
						first = tabs.indexOf(tab)
						break
					}
				}
			}
		}

		cancelled = false
		for (let i = first; i <= last; i++) {
			await new Promise( (r) => setTimeout(r, 1125) )
			if (cancelled) {
				break
			}

			const tab = tabs[i]
			if (tab.id === undefined) {
				continue
			}
			const id: number = tab.id
			chrome.scripting.executeScript({ target: {tabId: id}, func: () => {
				const a = document.getElementsByClassName('download')[0].firstChild
				return (a && a instanceof HTMLAnchorElement) ? a.href : undefined
			}}).then( (img) => {
				if (img.length > 0 && img[0].result) {
					chrome.downloads.download({ url: img[0].result, saveAs: false })
					if (i === last) {
						chrome.tabs.query({ windowType: 'normal' })
						.then( (all) => {
							if (all.length > 1) {
								chrome.tabs.remove(id)
							}
						}, (err) => {
							console.error(`Count Error: ${err}`)
						})
					} else {
						chrome.tabs.remove(id)
					}
				}
			}, (err) => {
				console.error(`Script Error: ${err}`)
			})
		}
	}, (err) => {
		console.error(`Walk Error: ${err}`)
	})
	running = false
}

chrome.runtime.onMessage.addListener( (request) => {
	switch (request.type) {
	case 'btn':
		chrome.downloads.download(
			{ url: request.src, filename: request.filename, saveAs: false })
		break
	case 'left':
		chrome.tabs.query({ active: true, currentWindow: true })
		.then( (tab) => {
			if (tab[0].index > 0) {
				downloadImages(-tab[0].index)
			}
		})
		break
	case 'right':
		chrome.tabs.query({ active: true, currentWindow: true })
		.then( (tab) => {
			downloadImages(tab[0].index)
		})
		break
	case 'cancel':
		cancelDownload()
		break
	default:
		downloadImages()
	}
})
