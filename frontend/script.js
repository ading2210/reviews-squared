const url = atob(location.hash.substring(1));
const queries = [
    "Don't include any irrelevant information. Create a paragraph summary of the following reviews, taking all of them into account. Talk about the pros and cons of the product. Do not talk about the customer service, talk about the product itself. Limit it to 3-4 sentences",
    "Don't include any irrelevant information. Based the provided reviews, write at least 5 complete sentences about that customers liked about the product. Each sentence must be about 10-20 words and separated by a '|' character. Do not talk about the customer service, talk about the product itself. Each sentence must be separated by a '|' character.",
    "Don't include any irrelevant information. Based the provided reviews, write at least 5 complete sentences about things that customers disliked about the product. Each sentence must be about 10-20 words and separated by a '|' character. Do not talk about the customer service, talk about the product itself. Each sentence must be separated by a '|' character."
];
const summary_element = document.getElementById("summary-text");
const satisfied_element = document.getElementById("sat-content");
const dissatisfied_element = document.getElementById("dissat-content");
const loading_text = document.getElementById("loading-text");
const progress_bar = document.getElementById("progressbar");

const API_URL = "https://reviews.ading.dev";

async function fetch_reviews(url, page = 1, stars = 5) {
    const req = {
        url: url,
        page: page,
        stars: stars
    };
    let r = await fetch(API_URL + "/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req)
    });
    return await r.json();
}

function populate_list(element, text_list) {
    for (let item of text_list) {
        item = item.trim();
        element.innerHTML += `<li class="list-group-item text-left" style="padding: 6px">${item}</li>`;
    }
}

async function update() {
    loading_text.innerText = "Downloading review data...";
    const reviews_seperate = await Promise.all([
        fetch_reviews(url, 1, 5),
        fetch_reviews(url, 2, 5),
        fetch_reviews(url, 3, 5),
        fetch_reviews(url, 1, 4),
        fetch_reviews(url, 1, 3),
        fetch_reviews(url, 1, 2),
        fetch_reviews(url, 1, 1),
    ]);
    const reviews = reviews_seperate.flat(1);

    loading_text.innerText = "Generating analysis using AI...";
    progress_bar.style.width = "40%";
    let start_time = performance.now() / 1000;
    let progress_interval = setInterval(() => {
        let now = performance.now() / 1000;
        let x = now - start_time;
        let y = 1 - Math.pow(1.15, -x);
        let percent = y * 60 + 40;
        progress_bar.style.width = `${percent}%`
    }, 50);

    const req1 = {
        query: queries,
        documents: reviews
    }
    const r = await fetch(API_URL + "/api/generate", {
        method: "POST",
        body: JSON.stringify(req1),
        headers: {
            "content-type": "application/json"
        }
    });

    const [summary, satisfied, dissatisfied] = await r.json();
    
    const satisfiedList = satisfied.split('|');
    const dissatisfiedList = dissatisfied.split('|');

    summary_element.innerText = summary;
    populate_list(satisfied_element, satisfiedList);
    populate_list(dissatisfied_element, dissatisfiedList);
    clearInterval(progress_interval);
    progress_bar.style.width = "100%";
    loading_text.remove();
}
update();
