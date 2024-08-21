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

function setGallery(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">
    <figcaption>${data.title}</figcaption>`;
    document.querySelector(".gallery").append(figure);   
}

function setModalGallery(data) {
    const figure = document.createElement("figure");
    figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">`;
    document.querySelector(".modalGalleryContent").append(figure); 
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
        // boucle `for`qui parcourt le json pour définir des catégories
        // on appelle la fonction Filter pour chaque catégorie
        for (let i = 0; i < json.length; i++) {
            Filter(json[i]);
        }
    } catch (error) {
        console.error(error.message);
    }
}
getCategories()


//mise en place des filtres

function Filter(data) {
    const div = document.createElement("div");
    // donner une classe à chaque bouton
    div.className = `button${data.id}`;
    // `click`qui va appeler la fonction getWorks avec le data.id des filtres et trouver les oeuvres qui ont le même categoryId
    div.addEventListener("click", () => getWorks(data.id));
    div.innerHTML = `${data.name}`;
    document.querySelector(".divFilters").append(div);
}

// `click` qui vient réinitialiser la gallerie avec getWorks(0)
document.addEventListener("DOMContentLoaded", function() {
    const button0 = document.querySelector(".button0");
    button0.addEventListener("click", () => getWorks(0));
});


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

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.logout');
    logoutButton.addEventListener('click', function() {
        sessionStorage.clear();
        location.reload();
    });
  });


//   Modal

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
    }

    const stopPropagation = function (e) {
        e.stopPropagation()
    }

    document.querySelectorAll('.modify').forEach(a => {
        a.addEventListener('click', openModal);
    });
    
});


