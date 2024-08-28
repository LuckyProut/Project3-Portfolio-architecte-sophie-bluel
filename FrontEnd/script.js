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
            if (filtered.length === 0) {
                showNoWorksMessage(); // Affiche le message s'il n'y a pas de travaux pour le filtre donné
            } else {
                hideNoWorksMessage(); // Cache le message s'il y a des travaux
                for (let i = 0; i < filtered.length; i++) {
                    setGallery(filtered[i]);
                }
            }
        } else {
            // si aucun filtre appliqué (fonction getworks défini sur 0 plus bas) alors on affiche tout
            if (json.length === 0) {
                showNoWorksMessage();
            } else {
                
                for (let i = 0; i < json.length; i++) {
                    setGallery(json[i]);
                    setModalGallery(json[i]);
                }
            }
        }
        
        const trashCan = document.querySelectorAll(".overlayTrash");
        console.log("trash")
        trashCan.forEach((e) => e.addEventListener("click", (event) => deleteWorks(event)));
    } catch (error) {
        console.error(error.message);
    }
}

// Fonction pour afficher un message lorsqu'aucun travail n'est trouvé
function showNoWorksMessage() {
    let message = document.querySelector(".noWorks");
    if (!message) {
        message = document.createElement("div");
        message.className = "noWorks";
        message.textContent = "Aucune photo dans cette catégorie...";
        document.querySelector(".gallery").append(message);
    }
}

// Fonction pour cacher le message lorsqu'il y a des travaux
function hideNoWorksMessage() {
    const message = document.querySelector(".noWorks");
    if (message) { 
        message.remove();
    }
}

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
        document.getElementById("galleryContent").style.display = "block";
        document.getElementById("addWorksContent").style.display = "none";
        previewImage.style.display = 'none';
        document.getElementById('noPreview').style.display = 'block';
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
    modalBack.addEventListener('click', function() {  //au click sur "retour"
        document.getElementById("galleryContent").style.display = "block"; //affiche le contenu de la première modale
        document.getElementById("addWorksContent").style.display = "none"; //cache le contenu de la deuxieme modale
        document.getElementById("previewImage").style.display = "none"; // Cache l'image
        document.getElementById("previewImage").src = ""; // Réinitialise la source de l'image
        document.getElementById("removePreview").style.display = "none"; // Cache l'icône de suppression
        document.getElementById("noPreview").style.display = "block"; // Réaffiche le formulaire initial
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
    // const listItem = event.target.closest('div');
    const deleteAPI = "http://localhost:5678/api/works/"
    const token = sessionStorage.getItem('tokenLogin');
    let response = await fetch(deleteAPI + id, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    
    if (response.status == 401 || response.status == 500) {
        alert("Il y a eu une erreur");
      } else {
        document.getElementById(`${id}`).remove();
        const escapedId = CSS.escape(id);
        document.querySelector(`figure#${escapedId}`).remove();
      }
      showNoWorksMessage();
    }

    // Ajout de travaux dans la modale
        // prévisualisation de l'image
        document.addEventListener("DOMContentLoaded", function() {
            document.getElementById('photo').addEventListener('change', function(event) {
                const previewImage = document.getElementById('previewImage');
                const removePreview = document.getElementById("removePreview");
                const file = event.target.files[0];
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    removePreview.style.display = "block";
                    document.getElementById('noPreview').style.display = 'none';
                };
                if (file) {
                    reader.readAsDataURL(file);
                } else {
                    previewImage.style.display = 'none';
                    previewImage.src = '';
                    removePreview.style.display = "none";
                }
            });
        });

        // retirer la photo pour en mettre une autre
        document.addEventListener('DOMContentLoaded', (event) => {    
    document.getElementById("removePreview").addEventListener("click", function () {
    document.getElementById("previewImage").style.display = "none"; // Cache l'image
    document.getElementById("previewImage").src = ""; // Réinitialise la source de l'image
    document.getElementById("removePreview").style.display = "none"; // Cache l'icône de suppression
    document.getElementById("noPreview").style.display = "block"; // Réaffiche le formulaire initial
  });
});
        
        // Envoie du form vers l'api
        document.addEventListener('DOMContentLoaded', (event) => {
            document.getElementById('validateButton')?.addEventListener('click', submitForm);

        function colourButton() {
            const textTitle = document.getElementById('textTitle').value.trim();
            const categoriesList = document.getElementById('categoriesList').value;
            const photo = document.getElementById('photo').files.length > 0;
    
                // Changer la couleur du bouton en fonction des champs
            const validateButton = document.getElementById('validateButton');
            if (textTitle && categoriesList && photo) {
                validateButton.classList.add('active');
            } else {
                validateButton.classList.remove('active');
            }
        }

        document.getElementById('textTitle').addEventListener('input', colourButton);
        document.getElementById('photo').addEventListener('change', colourButton);
    });
        
        function submitForm() {

            const photoInput = document.getElementById('photo');
            const titleInput = document.getElementById('textTitle');
            const categoryInput = document.getElementById('categoriesList');
        
            const formData = new FormData();
            formData.append('image', photoInput.files[0]);
            formData.append('title', titleInput.value);
            formData.append('category', categoryInput.value);
        
            const token = sessionStorage.getItem('tokenLogin');
        
            fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'accept': 'application/json',
                },
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur lors de l'envoi du formulaire: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Succès:', data);
                setGallery(data);
                setModalGallery(data);
                hideNoWorksMessage();
                photoInput.value = '';
                titleInput.value = ''; 
                previewImage.style.display = 'none';
                removePreview.style.display = 'none';
                document.getElementById('noPreview').style.display = 'block';
                validateButton.classList.remove('active')
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert("Formulaire incomplet/incorrect")
            });
        }