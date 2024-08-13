// fetch('http://localhost:5678/api/works/')
// .then(response => response.json())
// .then((data) => 
//     displayWorks(data)
// )
// .catch(error => alert("Erreur : " + error));

// function displayWorks(works) {
//     let divGallery = document.getElementsByClassName("gallery")[0];
//     works.forEach(element => {
//         let workFigure = document.createElement("figure");
//         let workImg = document.createElement("img");
//         let workTitle = document.createElement("figcaption");
//         workImg.src = element.imageUrl;
//         workImg.alt = element.title;
//         workTitle = element.title;
//         divGallery.appendChild(workFigure);
//         workFigure.append(workImg, workTitle);
//     });
// };

// récupération des travaux

async function getWorks(filter) {
    document.querySelector(".gallery").innerHTML = "";
    const url = "http://localhost:5678/api/works/"
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        if(filter) {
            const filtered = json.filter((data) => data.categoryId === filter);
            for (let i = 0; i < filtered.length; i++) {
                Gallery(filtered[i]);
            }
        } else {
            for (let i = 0; i < json.length; i++) {
                Gallery(json[i]);
            }
        }
    } catch (error) {
        console.error(error.message);
    }
}
getWorks();


// création de la gallerie

function Gallery(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").append(figure);
}


// récupération des catégories 

async function getCategories(){
    const url = "http://localhost:5678/api/categories"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
        const json = await response.json();
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }
    } catch (error) {
        console.error(error.message);
    }
}
getCategories()


//mise en place des filtres

function setFilter(data) {
    const div = document.createElement("div");
    div.className = `button${data.id}`
    div.addEventListener("click", () => getWorks(data.id));
    div.innerHTML = `${data.name}`;
    document.querySelector(".divFilters").append(div);
}

document.addEventListener("DOMContentLoaded", function() {
    const button0 = document.querySelector(".button0");
    button0.addEventListener("click", () => getWorks());
});