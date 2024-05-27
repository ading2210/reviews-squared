const host_name = location.hostname;
const path = btoa(location.href);
const ref_ids = {
  "www.amazon.com": "customer-reviews_feature_div",
};

const iframe = document.createElement("iframe");
iframe.src = "chrome-extension://" + chrome.runtime.id + "/index.html" + "#" + path;
iframe.style.width = "100%";
iframe.style.backgroundImage = '/imgs/random-16.png';

const targetId = ref_ids[host_name];
const target = document.getElementById(targetId);

target.parentNode.insertBefore(iframe, target);
