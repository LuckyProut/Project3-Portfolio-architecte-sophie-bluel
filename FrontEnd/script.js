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
            // on défini un filtrer en fonction de la catégorie de l'id des oeuvres
            // puis si filter est défini on vient afficher les éléments de la categoryId
            const filtered = json.filter((data) => data.categoryId === filter);
            for (let i = 0; i < filtered.length; i++) {
                setGallery(filtered[i]);
                setModalGallery(filtered[i]);
            }
        } else {
            // si aucun filtre appliqué (fonction getworks défini sur 0 plus bas) alors on affiche tout
            for (let i = 0; i < json.length; i++) {
                setGallery(json[i]);
                setModalGallery(json[i]);
            }
        }
        const trashCan = document.querySelectorAll(".overlayTrash");
        console.log("trash")
        trashCan.forEach((e) => e.addEventListener("click", (event) => deleteWorks(event)));
    } catch (error) {
        console.error(error.message);
    }
}
getWorks();


//charger les oeuvres au lancement de la page

document.addEventListener("DOMContentLoaded", () => {
    getWorks(); 
});


// Création de la gallerie

function setGallery(data) {
    const figure = document.createElement("figure");
    figure.id = `${data.id}`; // ajout de l'id en fonction de l'id de l'élément
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").append(figure);   
}

// Création de la gallerie dans la modale

function setModalGallery(data) {
    const figure = document.createElement("figure");
    figure.id = `${data.id}`; // ajout de l'id en fonction de l'id de l'élément
    figure.innerHTML = `<div class="imageContainer"> 
    <img src="${data.imageUrl}" alt="${data.title}">
    <i class="fa-solid fa-trash-can overlayTrash " id="${data.id}"></i>
    </div>`;
    document.querySelector(".modalGalleryContent").append(figure); 
}


// Récupération des catégories 


async function getCategories(){
    const url = "http://localhost:5678/api/categories"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
        const json = await response.json();
        // boucle `for`qui parcourt le json pour définir des catégories
        // on appelle la fonction Filter pour chaque catégorie
        for (let i = 0; i < json.length; i++) {
            Filter(json[i]);
        }
    } catch (error) {
        console.error(error.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getCategories(); 
});

//Mise en place des filtres via les ID

let boutonActif = null

function Filter(data) {
    const div = document.createElement("div");
    div.className = `button${data.id}`;
    div.innerHTML = `${data.name}`;
    div.addEventListener("click",function() {
        if (boutonActif && boutonActif !== this) {
            boutonActif.style.color = '#1D6154';
            boutonActif.style.backgroundColor = 'transparent' 
        }
        this.style.color = 'white';
        this.style.backgroundColor = '#1D6154';
        boutonActif = this;
        getWorks(data.id);
       
    });
    document.querySelector(".divFilters").append(div);
}

document.addEventListener("DOMContentLoaded", function() {
    const button0 = document.querySelector(".button0");

    button0.style.color = 'white';
    button0.style.backgroundColor = '#1D6154';
    boutonActif = button0;
    
    button0.addEventListener("click",function() {
        if (boutonActif && boutonActif !== this) {
            boutonActif.style.color = '#1D6154';
            boutonActif.style.backgroundColor = 'transparent' 
        }
        this.style.color = 'white';
        this.style.backgroundColor = '#1D6154';
        boutonActif = this;
        getWorks(0);
    });
});


// Stockage du Token

const token = sessionStorage.getItem('tokenLogin');
document.addEventListener("DOMContentLoaded", function() {
    if (token) {
        document.querySelector(".divFilters").style.display = "none";
        document.querySelector(".login").style.display = "none";
    } else {
        document.querySelector(".editMode").style.display = "none";
        document.querySelector(".modify").style.display = "none";
        document.querySelector(".logout").style.display = "none";
    }
});


// Déconnection -> clear du Token + reload page

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', function() {
        sessionStorage.clear();
        location.reload();
    });
});


//   Modal

// au clique sur "modifier", ouvre la 1ere modale
document.addEventListener('DOMContentLoaded', function() {
    
    const openModal = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        target.style.display = null
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal', true)
        modal = target
        modal.addEventListener('click', closeModal)
        modal.querySelector('.modalExit').addEventListener('click', closeModal)
        modal.querySelector('.stopPropagation').addEventListener('click', stopPropagation)
    };

    // au clique sur la croix, ferme la modale
    const closeModal = function (e) {
        if (modal === null) return 
        e.preventDefault()
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true')
        modal.removeAttribute('aria-modal')
        modal.removeEventListener('click', closeModal)
        modal.querySelector('.modalExit').removeEventListener('click', closeModal)
        modal.querySelector('.stopPropagation').removeEventListener('click', stopPropagation)
        modal = null
    };

    const stopPropagation = function (e) {
        e.stopPropagation()
    };

    const secondModal = document.querySelector('.addWorks');  //récupère le bouton "ajouter une photo"

    secondModal.addEventListener('click', function() {  //au click sur "ajouter une photo"
        document.getElementById("galleryContent").style.display = "none"; //cache le contenu de la première modale
        document.getElementById("addWorksContent").style.display = "block"; //affiche le contenu de la deuxieme modale
    });

    const modalBack = document.querySelector('.modalBack');
    modalBack.addEventListener('click', function() {  //au click sur "ajouter une photo"
        document.getElementById("galleryContent").style.display = "block"; //affiche le contenu de la première modale
        document.getElementById("addWorksContent").style.display = "none"; //cache le contenu de la deuxieme modale
    });

    document.querySelectorAll('.modify').forEach(a => {
        a.addEventListener('click', openModal);
    });
 
});


// Affichage catégories dans la modale

document.addEventListener('DOMContentLoaded', () => {
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categories = await response.json();
            console.log(categories);
            
            const selectElement = document.getElementById('categoriesList');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    }

    fetchCategories();
});


// Suppression des travaux dans l'API

async function deleteWorks(event) {
    event.stopPropagation();
    const id = event.srcElement.id;
    const deleteAPI = "http://localhost:5678/api/works/"
    const token = sessionStorage.getItem('tokenLogin');
    let response = await fetch(deleteAPI + id, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    if (response.status == 401 || response.status == 500) {
        alert = "Il y a eu une erreur";
      } else {
        setGallery.reload();
        setModalGallery.reload();
      }
    }