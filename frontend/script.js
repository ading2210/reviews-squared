const url = atob(location.hash.substring(1));
const summary_query = "Create a paragraph summary of the following reviews. Talk about the good and the bad.";
const satisfied_query = "Make a short list of things that customers liked about the product. Each element should be about 3-5 words and separated by a comma and space (, )"
const dissatisfied_query = "Make a short list of things that customers disliked about the product. Each element should be about 3-5 words and separated by a comma and space (, )"
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

    const summary_req = {
        query: summary_query,
        documents: r1
    };
    const satisfied_req = {
        query: satisfied_query,
        documents: r1
    };
    const dissatisfied_req = {
        query: dissatisfied_query,
        documents: r1
    }

    const summary = await fetch('http://localhost:5000/api/generate', {
        method: "POST",
        body: JSON.stringify(summary_req),
        headers: {
            "content-type": "application/json"
        }
    });
    let satisfied = await fetch('http://localhost:5000/api/generate', {
        method: "POST",
        body: JSON.stringify(satisfied_req),
        headers: {
            "content-type": "application/json"
        }
    });
    let dissatisfied = await fetch('http://localhost:5000/api/generate', {
        method: "POST",
        body: JSON.stringify(dissatisfied_req),
        headers: {
            "content-type": "application/json"
        }
    });
    
    console.log(summary);
    console.log(satisfied);
    console.log(dissatisfied);

    satisfied = satisfied.text().split(', ');
    dissatisfied = dissatisfied.text().split(', ');

    summary_element.innerText = summary.text();
    for (item of satisfied) {
        satisfied_element.innerHTML += `<li class="list-group-item>${item}</li>`;
    }
    for (item of dissatisfied) {
        dissatisfied_element.innerHTML += `<li class="list-group-item>${item}</li>`;
    }

    document.getElementById("loading-text").innerText = "";
}
update();
