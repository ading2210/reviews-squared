const url = atob(location.hash.substring(1));
const summary_query = "Create a paragraph summary of the following reviews. Talk about the good and the bad.";
const satisfied_query = "Make a short list of things that customers liked about the product. Each element should be abotu 3-5 words and separated by a comma and space (, )"
const dissatisfied_query = "Make a short list of things that customers disliked about the product. Each element should be abotu 3-5 words and separated by a comma and space (, )"
const summary_element = document.getElementById("summary-text");
const satisfied_element = document.getElementsById("sat-content");
const dissatisfied_element = document.getElementById("dissat-content");

async function update() {
    const r1 = await fetch('http://localhost:5000/api/reviews', {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
            "content-type": "application/json"
        }
    });
    const reviews = await r1.json();

    const summary_req = {
        summary_query,
        reviews
    };
    const satisfied_req = {
        satisfied_query,
        reviews
    };
    const dissatisfied_req = {
        dissatisfied_query,
        reviews
    }

    const summary = await fetch('http://localhost:5000/api/generate', {
        method: "POST",
        body: JSON.stringify({ summary_req }),
        headers: {
            "content-type": "application/json"
        }
    });
    let satisfied = await fetch('http://localhost:5000/api/generate', {
        method: "POST",
        body: JSON.stringify({ satisfied_req }),
        headers: {
            "content-type": "application/json"
        }
    });
    let dissatisfied = await fetch('http://localhost:5000/api/generate', {
        method: "POST",
        body: JSON.stringify({ dissatisfied_req }),
        headers: {
            "content-type": "application/json"
        }
    });
    satisfied = satisfied.split(', ');
    dissatisfied = dissatisfied.split(', ');

    summary_element.innerText = summary;
    for (item of satisfied) {
        satisfied_element.innerHTML += `<li class="list-group-item>${item}</li>`;
    }
    for (item of dissatisfied) {
        dissatisfied_element.innerHTML += `<li class="list-group-item>${item}</li>`;
    }

    document.getElementById("loading-text").innerText = "";
}

update();
