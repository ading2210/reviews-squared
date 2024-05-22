function summary(req) {
    document.getElementById("summary").innerHTML = `<p class="font-sans">${req}</p>`;
}
function satisfied(req) {
    items = req.split('|');
    res = `
        <p class="font-sans">Satisfied Customers Said:</p>\n
        <ul>
    `;
    for (i of items) {
        res += `<li>${i}</li>`;
    }
    res += `</ul>`;
    
    document.getElementById("satisfied").innerHTML = res;
}
function dissatisfied(req) {
    items = req.split('|');
    res = `
        <p class="font-sans">Dissatisfied Customers Said:</p>\n
        <ul>
    `;
    for (i of items) {
        res += `<li>${i}</li>`;
    }
    res += `</ul>`;
    
    document.getElementById("dissatisfied").innerHTML = res;
}
