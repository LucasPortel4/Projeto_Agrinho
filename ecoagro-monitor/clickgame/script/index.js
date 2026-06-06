let ovo = document.querySelector('.ovovalor');
let parsedovo = parseFloat(ovo.innerHTML);

let cliqueValor = document.querySelector('.clicker-cost');
let parsedclickercost = parseFloat(cliqueValor.innerHTML);

 


// aumenta a quantidade de ovos por clique
function incrementovo() {
    parsedovo += 1;
    ovo.innerHTML = parsedovo;
}

function buyclique() {
    if (parsedovo >= parsedclickercost) {
        parsedovo -= parsedclickercost;
        ovo.innerHTML -= parsedovo;
    }
}