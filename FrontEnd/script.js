// fetch api work gallery

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


// filters

async function getCategories(){
    const url = "http://localhost:5678/api/categories"
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Response status: ${response.status}');
        }
        
        const json = await response.json();
        console.log(json);
        for (let i = 0; i < json.length; i++) {
            setFilter(json[i]);
        }
    } catch (error) {
        console.error(error.message);
    }
}
getCategories()

function setFilter(data) {
    const div = document.createElement("div");
        div.InnerHTML = `${data.name}`;
        document.querySelector(".divFilters").append(div);
}