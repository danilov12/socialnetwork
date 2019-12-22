var nizOsoba = [];
var xmlhttp = new XMLHttpRequest();
var lista = document.getElementById('osobe');
var godine = document.getElementById('godine');
var pol = document.getElementById('pol');
var ulDirFriends = document.getElementById('directfriends');
var divFriendsOfFriends = document.getElementById('freindsoffriends');
var divSuggestedFriends = document.getElementById('suggestedfriends');
var listaSuggested = document.getElementById("listasuggested");
window.onload = function () {
    this.xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            nizOsoba = JSON.parse(xmlhttp.responseText);
            for (let osoba of nizOsoba) {
                dodajUListu(lista, osoba);
            }
        }
    }
}

xmlhttp.open("GET", "../data.json", true);
xmlhttp.send();

function dodajUListu(lista, osoba) {
    var option = document.createElement('option');
    option.text = osoba.firstName + " " + osoba.surname;
    option.id = osoba.id;
    option.value = osoba.id;

    lista.add(option);
}

function getOsobaPoId(index) {
    if (index == 0)
        return null;

    for (let osoba of nizOsoba) {
        if (osoba.id == index) {
            return osoba;
        }
    }
}

function prikaziDirectFriends(osoba, lista) {
    if (lista.childNodes.length) {
        lista.innerHTML = '';
    }

    if (osoba == null) {
        lista.innerHTML = '';
    } else {

        for (let friend of osoba.friends) {
            var li = document.createElement('li');
            var osoba = getOsobaPoId(friend);
            li.appendChild(document.createTextNode(osoba.firstName + " " + osoba.surname));
            lista.appendChild(li);
        }
    }
}

function prikaziPrijateljePrijatelja(osoba) {
    if (divFriendsOfFriends.childNodes.length) {
        divFriendsOfFriends.innerHTML = '';
    }
    if (osoba == null) {
        divFriendsOfFriends.innerHTML = '';
    } else {
        for (let friend of osoba.friends) {
            var osoba = getOsobaPoId(friend);
            var row = document.createElement('div');
            row.classList.add('row');
            var div = document.createElement('div');
            div.classList.add('col-2');
            row.appendChild(div);
            div.innerHTML += `<h3>${osoba.firstName} friends:</h3>`;
            var lista = document.createElement('ul');
            div.appendChild(lista);
            divFriendsOfFriends.appendChild(div);
            prikaziDirectFriends(osoba, lista);
        }
    }
}

function pronadjiSuggestedFriends(osoba) {
    let nizOsobaZaIspis = [];
    if (osoba == null) {
        listaSuggested.innerHTML = '';
    } else {
        if (osoba.friends.length < 2) {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode('No suggested friends.'));
            listaSuggested.appendChild(li);
        } else {
            for (let osobaUNizu of nizOsoba) {
                if (osobaUNizu.id == osoba.id) {
                    continue;
                } else if (osobaUNizu.friends.length < 2) {
                    continue;
                } else if (jesuLiPrijatelji(osoba, osobaUNizu)) {
                    continue;
                } else {
                    if (isUSuggestedFriends(osoba, osobaUNizu)) {
                        nizOsobaZaIspis.push(osobaUNizu);
                    }
                }
            }
        }

        if (listaSuggested.childNodes.length) {
            listaSuggested.innerHTML = '';
        }

        if (nizOsobaZaIspis.length == 0) {
            var li = document.createElement('li');
            li.appendChild(document.createTextNode('No suggested friends.'));
            listaSuggested.appendChild(li);
        } else {

            for (let osoba of nizOsobaZaIspis) {
                var li = document.createElement('li');
                li.appendChild(document.createTextNode(osoba.firstName + " " + osoba.surname));
                listaSuggested.appendChild(li);
            }
        }
    }
}

function jesuLiPrijatelji(osoba1, osoba2) {
    for (let osoba of osoba1.friends) {
        if (osoba.id == osoba2.id) {
            return true;
        }
    }
    return false;
}

function isUSuggestedFriends(osoba1, osoba2) {
    var brojac = 0;
    for (let id1 of osoba1.friends) {
        for (let id2 of osoba2.friends) {
            if (id1 == id2) {
                brojac++;
            }
        }
    }

    return brojac >= 2;
}

lista.onchange = function () {
    var index = parseInt(lista.selectedIndex);
    var osoba = getOsobaPoId(index);
    var slika = document.getElementById('slika');
    if (osoba == null) {
        godine.value = pol.value = "";
        slika.src = "#";
        prikaziDirectFriends(osoba, ulDirFriends);
        prikaziPrijateljePrijatelja(osoba);
        pronadjiSuggestedFriends(osoba);
    } else {
        godine.value = osoba.age;
        pol.value = osoba.gender;
        if(osoba.gender == 'male'){
            slika.src = "../pictures/man.png";
        }else{
            slika.src = "../pictures/woman.jpg";
        }
        prikaziDirectFriends(osoba, ulDirFriends);
        prikaziPrijateljePrijatelja(osoba);
        pronadjiSuggestedFriends(osoba);
    }
}
