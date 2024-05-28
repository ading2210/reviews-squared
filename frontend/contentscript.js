const host_name = location.hostname;
const path = btoa(location.href);
const ref_ids = {
  "www.amazon.com": ["cr-product-insights-cards","customer-reviews_feature_div"],
  "www.bestbuy.com": ["", "user-generated-content-ratings-and-reviews"],
  "www.target.com": ["", "above-the-fold-information"]
};

const iframe = document.createElement("iframe");
iframe.src = "chrome-extension://" + chrome.runtime.id + "/index.html" + "#" + path;
iframe.style.width = "100%";
iframe.id = "reviews-squared";

let target = document.getElementById(ref_ids[host_name][0])
if (target) {
  target.replaceWith(iframe);
} else {
  target = document.getElementById(ref_ids[host_name][1]);
  target.parentNode.insertBefore(iframe, target);
}

const url = location.href;



// iframe.contentWindow.document.getElementById("summary-text") = "Saketh has no balls";

// await fetch('0.0.0.0/api/reviews', {
//   method: "POST",
//   body: JSON.stringify({ url })
// })
// .then(response => response.json())
// .then(data => async () => {
//     await fetch('0.0.0.0/api/generate', {
//     method: "POST",
//     body: data
// })
// .then(res => {
//     summary_element.innerText = res;
// })
// });
