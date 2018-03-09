function getData(url, callbackFunc) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callbackFunc(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function successAjax(xhttp) {
    let movieDatas = JSON.parse(xhttp.responseText);
    let movies = movieDatas.movies;
    console.log(movies);

    filterData(movies);
    document.getElementById('statisztika').addEventListener("click", function () {
        stats(movies);
    });


    document.getElementById('search').addEventListener("click", function () {
        search(movies);
    });
    document.getElementById('news').addEventListener("click", function () {
        news(movies);
    });


}
getData('/json/movies.json', successAjax);

function filterData(datas) {
    var eredmeny = datas.sort((a, b) => (a.title < b.title) ? -1 : 1);
    generate(eredmeny);
}
/* itt a kategórianevek beállításást kell megcsinálni
function editSearch(datas) {
    datas.categories.forEach(element => {

    });
}
*/

function generate(datas) {
    let content = document.querySelector('.content');
    content.innerHTML = "";
    for (let i in datas) {
        let div = document.createElement('div');
        div.setAttribute("class", "movie");
        let title = removeStuff(datas[i].title);
        let img = document.createElement('img');
        img.src = `/img/covers/${title}.jpg`;
        img.alt = datas[i].title;
        div.appendChild(img);
        let span = document.createElement('span');
        let categories = genere(datas[i].categories);
        let actors = cast(datas[i].cast);
        span.innerText = `Cím: ${datas[i].title}
        Hossz: ${datas[i].timeInMinutes} perc
        Premier: ${datas[i].premierYear}
        Kategória: ${categories}
        Rendező: ${datas[i].directors}`;
        div.appendChild(span);
        let mainCast = document.createElement('div');
        mainCast.className = 'cast';
        let szereplo = document.createElement('div');
        szereplo.innerHTML = 'Szereplők: <br>';
        for (let j in datas[i].cast) {
            let leiras = document.createElement('span');
            leiras.innerHTML = `
            ${datas[i].cast[j].name} (${datas[i].cast[j].characterName}) <br>
            ${datas[i].cast[j].birthYear}, ${datas[i].cast[j].birthCountry} ${datas[i].cast[j].birthCity}`;
            let filmStar = removeStuff(datas[i].cast[j].name);
            let avatar = document.createElement('img');
            avatar.src = `/img/actors/${filmStar}.jpg`
            avatar.className = 'avatar';
            szereplo.appendChild(avatar);
            szereplo.appendChild(leiras);
        }

        mainCast.appendChild(szereplo);


        div.appendChild(mainCast);


        content.appendChild(div);
    }

}

function removeStuff(str) {
    const replace = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ö: 'o',
        ő: 'o',
        ú: 'u',
        ü: 'u',
        ű: 'u'
    }
    str = str.toLocaleLowerCase();
    str = str.replace(/[\?!:;–&,'\.\+\*]/g, '');
    //vagy
    //str = str.replace(/[^a-z0-9 -]/g, '');
    str = str.replace(/[áéíóöőúüű]/g, c => replace[c]);
    str = str.replace(/ +/g, '-');
    return str;
};

function cast(obj) {
    let arr = [];
    for (let i in obj) {
        let char = `${obj[i].name} (${obj[i].characterName})
        ${obj[i].birthYear}, ${obj[i].birthCountry} ${obj[i].birthCity}`;
        arr.push(char);
    }
    return genere(arr);
};

function genere(arr) {
    let eredmeny = arr.toString();
    return eredmeny;
};

function stats(data) {
    let stat = document.createElement('span');
    let lenght = sumLength(data);
    let avg = avgLength(data);
    let castApear = actorsAppear(data);
    let categoriesCount = movieCategoriesCount(data);
    stat.innerText = `Az összes film hossza órában: ${lenght}
    A filmek hossza átlagban ${avg} óra
    `
    let cstpr = document.createElement('span');
    let cc = document.createElement('span');
    cc.innerHTML = "<br>" + "Alább pedig lássuk, mely műfaj hány művel képviselteti magát:"
    cstpr.innerHTML = 'Itt lálható továbbá a gyönyörű kimutatás arról, hogy mely filmcsillag hány filmben szerepel:'
    castApear.forEach(wrt);

    function wrt(key, value) {
        cstpr.innerHTML = cstpr.innerHTML + "<br>" + value + ": " + key;
    }
    categoriesCount.forEach(wrt2);

    function wrt2(key, value) {
        cc.innerHTML = cc.innerHTML + "<br>" + value + ": " + key;
    }
    document.querySelector('.stats').appendChild(stat);
    document.querySelector('.stats').appendChild(cstpr);
    document.querySelector('.stats').appendChild(cc);

}

function sumLength(data) {
    let length = 0;
    for (let i in data) {
        length += parseInt(data[i].timeInMinutes);
    }
    length = (length / 60).toFixed(2);
    return length;
}

function avgLength(data) {
    let length = 0;
    for (let i in data) {
        length += parseInt(data[i].timeInMinutes);
    }
    let avg = parseFloat(length / data.length);
    avg = (avg / 60).toFixed(2);
    return avg;
}

function actorsAppear(data) {
    const actors = new Map();
    for (let i in data) {
        for (let j in data[i].cast) {
            if (actors.has(data[i].cast[j].name)) {
                let nvalue = actors.get(data[i].cast[j].name) + 1;
                actors.set(data[i].cast[j].name, nvalue);
            } else {
                actors.set(data[i].cast[j].name, 1);
            }
        }
    }
    return actors;
}

function movieCategoriesCount(data) {
    const cats = new Map();
    for (let i in data) {
        for (let j in data[i].categories) {
            if (cats.has(data[i].categories[j])) {
                let nvalue = cats.get(data[i].categories[j]) + 1;
                cats.set(data[i].categories[j], nvalue);
            } else {
                cats.set(data[i].categories[j], 1);
            }
        }
    }
    return cats;
}

function news(data) {
    eredmeny = [];
    for (let i in data) {
        if (data[i].premierYear > 1990) {
            eredmeny.push(data[i])
        }
    }
    filterData(eredmeny);
}

function search(data) {
    let select = document.querySelector('#prop');
    let prop = select.options[select.selectedIndex].value;
    let eredmeny = [];
    let value = document.querySelector('#find').value;
    switch (prop) {
        case 'title':
            for (let i in data) {
                if (data[i].title == value) {
                    eredmeny.push(data[i])
                }
            }
            break;
        case 'actor':
            for (let i in data) {
                for (let j in data[i].cast) {
                    if (data[i].cast[j].name == value) {
                        eredmeny.push(data[i])
                    }
                }
            }
            break;
        case 'director':
            for (let i in data) {
                for (let j in data[i].directors) {
                    if (data[i].directors[j] == value) {
                        eredmeny.push(data[i])
                    }
                }
            }
            break;

    }

    filterData(eredmeny);
}