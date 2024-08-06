

fetch('http://localhost:5678/api/works/')
.then(response => response.json())
.then((data) => 
    displayWorks(data)
)
.catch(error => alert("Erreur : " + error));

function displayWorks(works) {
    let divGallery = document.getElementsByClassName("gallery")[0];
    works.forEach(element => {
        let workFigure = document.createElement("figure");
        let workImg = document.createElement("img");
        let workTitle = document.createElement("figcaption");
        workImg.src = element.imageUrl;
        workImg.alt = element.title;
        workTitle = element.title;
        divGallery.appendChild(workFigure);
        workFigure.append(workImg, workTitle);
    });
};
