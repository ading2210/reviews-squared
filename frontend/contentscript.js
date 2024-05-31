const ref_ids = {
  "www.amazon.com": ["#cr-product-insights-cards","#customer-reviews_feature_div"],
  "www.bestbuy.com": [null, "div[id^='user-generated-content-ratings-and-reviews']"],
  "www.target.com": ["div:has(> div > h4[data-test='review-summary-title'])", "#reviewImages"],
  "www.walmart.com": [null, "div[class='mb4 overflow-auto'] "]
};
let interval = null;

const iframe = document.createElement("iframe");
iframe.style.width = "max(100%, 800px)";
iframe.style.height = "600px";
iframe.style.border = "none";
iframe.id = "reviews-squared";

function inject_frame() {
  const host_name = location.hostname;
  const path = btoa(location.href);
  iframe.src = "chrome-extension://" + chrome.runtime.id + "/index.html" + "#" + path;
  
  if (!ref_ids[host_name]) {
    return;
  }

  let replace_target = document.querySelector(ref_ids[host_name][0]);
  let insert_target = document.querySelector(ref_ids[host_name][1]);

  if (replace_target) {
    replace_target.replaceWith(iframe);
  }
  else if (insert_target) {
    insert_target.parentNode.insertBefore(iframe, insert_target);
  }

  if (replace_target || insert_target) {
    clearInterval(interval);
  }
}

function main() {
  interval = setInterval(inject_frame, 2000);
  inject_frame();
}

main();