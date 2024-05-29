const url = atob(location.hash.substring(1));
const summary_query = "Create a paragraph summary of the following reviews. Talk about the good and the bad.";

async function update() {
    const r1 = await fetch('http://localhost:5000/api/reviews', {
        method: "POST",
        body: JSON.stringify({ url }),
        headers: {
            "content-type": "application/json"
        }
    });
    d1 = await r1.json();
    const req = {
        summary_query,
        d1
    };
    console.log(req);
    const r2 = await fetch('http://localhost:5000/api/generate', {
        method: "POST",
        body: JSON.stringify({ req }),
        headers: {
            "content-type": "application/json"
        }
    });

    console.log(r2);

    // document.getElementById("summary-text").innerText = r2;
}

update();
