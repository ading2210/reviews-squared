const url = atob(location.hash.substring(1));
const summary_query = "Create a paragraph summary of the following reviews. Talk about the good and the bad.";
const satisfied_query = "Make a short list of things that customers liked about the product. Each element should be about 3-5 words and separated by a comma and space (, )";
const dissatisfied_query = "Make a short list of things that customers disliked about the product. Each element should be about 3-5 words and separated by a comma and space (, )";
const summary_element = document.getElementById("summary-text");
const satisfied_element = document.getElementById("sat-content");
const dissatisfied_element = document.getElementById("dissat-content");

async function update() {
    const r1 = await fetch('http://localhost:5000/api/reviews', {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
            "content-type": "application/json"
        }
    });
    let reviews = await r1.json();

    const req = {
        query: [summary_query, satisfied_query, dissatisfied_query],
        documents: reviews
    };

    /* anwar pls implement the new generate api 

    const [summary, satisfied, dissatisfied] = await Promise.all([
        fetch('http://localhost:5000/api/generate', {
            method: "POST",
            body: JSON.stringify(req),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.text()),
        fetch('http://localhost:5000/api/generate', {
            method: "POST",
            body: JSON.stringify(satisfied_req),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.text()),
        fetch('http://localhost:5000/api/generate', {
            method: "POST",
            body: JSON.stringify(dissatisfied_req),
            headers: {
                "content-type": "application/json"
            }
        }).then(response => response.text())
    ]);
    */

    const satisfiedList = satisfied.split(', ');
    const dissatisfiedList = dissatisfied.split(', ');

    summary_element.innerText = summary;
    satisfied_element.innerHTML = satisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');
    dissatisfied_element.innerHTML = dissatisfiedList.map(item => `<li class="list-group-item">${item}</li>`).join('');

    document.getElementById("loading-text").innerText = "";
}
update();
