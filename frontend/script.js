const url = atob(location.hash.substring(1));
const query = [
    "Create a paragraph summary of the following reviews. Talk about the good and the bad.",
    "Make a short list of things that customers liked about the product. Each element should be about 3-5 words and separated by a comma and space (, )",
    "Make a short list of things that customers disliked about the product. Each element should be about 3-5 words and separated by a comma and space (, )"
];
const summary_element = document.getElementById("summary-text");
const satisfied_element = document.getElementById("sat-content");
const dissatisfied_element = document.getElementById("dissat-content");

async function update() {
    const reviews = [];

    const [
      five_star1,
      five_star2,
      one_star1,
      one_star2
    ] = await Promise.all([
      fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, page: 1, stars: 5 })
      }).then(res => res.json()),
  
      fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, page: 2, stars: 5 })
      }).then(res => res.json()),
  
      fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, page: 1, stars: 1 })
      }).then(res => res.json()),
  
      fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, page: 2, stars: 1 })
      }).then(res => res.json())
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
    let reviews = await r1.json();

    const req = {
        query: [summary_query, satisfied_query, dissatisfied_query],
        documents: reviews
    };

    

    const satisfiedList = satisfied.split(', ');
    const dissatisfiedList = dissatisfied.split(', ');

    summary_element.innerText = summary;
    satisfied_element.innerHTML = satisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');
    dissatisfied_element.innerHTML = dissatisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');

    document.getElementById("loading-text").innerText = "";
}
update();
