const url = atob(location.hash.substring(1));
const queries = [
    "Create a paragraph summary of the following reviews. Talk about the good and the bad.",
    "Make a short list of things that customers liked about the product. Each element should be about 3-5 words and separated by a comma and space (, )",
    "Make a short list of things that customers disliked about the product. Each element should be about 3-5 words and separated by a comma and space (, )"
];
const summary_element = document.getElementById("summary-text");
const satisfied_element = document.getElementById("sat-content");
const dissatisfied_element = document.getElementById("dissat-content");

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

async function update() {
    const reviews_seperate = await Promise.all([
        fetch_reviews(url, 1, 5),
        fetch_reviews(url, 2, 5),
        fetch_reviews(url, 1, 4),
        fetch_reviews(url, 1, 3),
        fetch_reviews(url, 1, 2),
        fetch_reviews(url, 1, 1),
        fetch_reviews(url, 2, 1),
    ]);
    const reviews = reviews_seperate.flat(1);

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
    
    const satisfiedList = satisfied.split(', ');
    const dissatisfiedList = dissatisfied.split(', ');

    summary_element.innerText = summary;
    satisfied_element.innerHTML = satisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');
    dissatisfied_element.innerHTML = dissatisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');

    document.getElementById("loading-text").innerText = "";
}
update();
