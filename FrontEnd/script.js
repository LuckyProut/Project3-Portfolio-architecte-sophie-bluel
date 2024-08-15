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
    // sans ça chaque appel à getworks va ajouter de nouvelles images à celle déjà présente et non réinitialiser
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
            // on défini un filtrer en fonction de la catégorie de l'id des oeuvres
            // puis si filter est défini on vient afficher les éléments de la categoryId
        } else {
            for (let i = 0; i < json.length; i++) {
                Gallery(json[i]);
            }
            // si aucun filtre appliqué (fonction getworks défini sur 0 plus bas) alors on affiche tout
        }
    } catch (error) {
        console.error(error.message);
    }
}
getWorks();

//charger les oeuvres au lancement de la page

document.addEventListener("DOMContentLoaded", () => {
    getWorks(); 
});

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
            Filter(json[i]);
        }
        // boucle `for`qui parcourt le json pour définir des catégories
        // on appelle la fonction Filter pour chaque catégorie
    } catch (error) {
        console.error(error.message);
    }
}
getCategories()


//mise en place des filtres

function Filter(data) {
    const div = document.createElement("div");
    div.className = `button${data.id}`
    // donner une classe à chaque bouton
    div.addEventListener("click", () => getWorks(data.id));
    // `click`qui va appeler la fonction getWorks avec le data.id des filtres et trouver les oeuvres qui ont le même categoryId
    div.innerHTML = `${data.name}`;
    document.querySelector(".divFilters").append(div);
}

document.addEventListener("DOMContentLoaded", function() {
    const button0 = document.querySelector(".button0");
    button0.addEventListener("click", () => getWorks(0));
});
// `click` qui vient réinitialiser la gallerie avec getWorks(0)