let url = atob(location.hash.substring(1));
async function test() {
    let r = await fetch('http://localhost:5000/api/reviews', {
        method: "POST", 
        body: JSON.stringify({ url }),
        headers: {
            "content-type": "application/json"
        }
    });
    console.log(await r.json());
}
test();