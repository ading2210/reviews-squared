const url = atob(location.hash.substring(1));
const api_url = "http://localhost:5000/api/reviews"
const query = [
    "Create a paragraph summary of the following reviews. Talk about the good and the bad.",
    "Make a short list of things that customers liked about the product. Each element should be about 3-5 words and separated by a comma and space (, )",
    "Make a short list of things that customers disliked about the product. Each element should be about 3-5 words and separated by a comma and space (, )"
];
const summary_element = document.getElementById("summary-text");
const satisfied_element = document.getElementById("sat-content");
const dissatisfied_element = document.getElementById("dissat-content");

async function fetchReviews(page, star) {
    return await fetch(api_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, page: page, stars: star })
      }).then(res => res.json());
}

async function update() {
    const reviews = [];

    const [five_star1, five_star2, one_star1, one_star2] = await Promise.all([
      fetchReviews(1, 5),
      fetchReviews(2, 5),
      fetchReviews(1, 1),
      fetchReviews(2, 1)
    ]);
  
    reviews.push(...five_star1, ...five_star2, ...one_star1, ...one_star2);

    const req1 = {
        query: query,
        documents: reviews
    }
    const [summary, satisfied, dissatisfied] = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        body: JSON.stringify(req1),
        headers: {
            "content-type": "application/json"
        }
    });

    const satisfiedList = satisfied.split(', ');
    const dissatisfiedList = dissatisfied.split(', ');

    summary_element.innerText = summary;
    satisfied_element.innerHTML = satisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');
    dissatisfied_element.innerHTML = dissatisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');

    document.getElementById("loading-text").innerText = "";
}
update();
