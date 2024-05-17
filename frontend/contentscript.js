const txt = 'Hello world!'; // replace w/ the ai generated text ltr
const host_name = location.hostname;
const path = btoa(location.href);
const marieAntoinette = {
    "www.amazon.com" : ["cr-product-insights-cards", ],
}

const iframe = document.createElement("iframe");
document.getElementById(marieAntoinette[host_name]).replaceWith(iframe);

iframe.src = "chrome-extension://" + chrome.runtime.id + "/iframe.html" + "#" + path;
iframe.innerText = txt;
iframe.style.width = "100%";
iframe.style.backgroundImage = '/imgs/random-16.png'
