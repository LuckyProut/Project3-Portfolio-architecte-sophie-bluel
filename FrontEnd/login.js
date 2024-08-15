const loginApi = "http://localhost:5678/api/users/login";

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formLogin").addEventListener("submit", submitLoginForm);
    // on doit écouter l'input "submit" et pas la class "submitInput"?
});

async function submitLoginForm(event) {
    event.preventDefault();
    let userAdmin = {
        email: document.getElementById("emailLogin"),
        password: document.getElementById("passwordLogin"),
    };
  
    try {
      let response = await fetch(loginApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userAdmin.email.value,
            password: userAdmin.password.value,
        })
      });
      if (response.ok) {
        const data = await response.json();
        // stockage du token dans le session storage
        window.sessionStorage.setItem("tokenLogin", data.token);
        // renvoie à la page d'accueil si connexion = ok
        window.location.href = "index.html";
      } else {
        // créer une alerte ou insérer une div?
        alert("E-mail ou mot de passe incorrecte")
      }
        // ----du mal à comprendre pourquoi j'ai une erreur 405 si je retire cette partie
    } catch (error) {
        console.error(error.message);
    }
        // ------ je suis pas sûr : demander si c'est obligatoire
        //  oui c'est obligatoire fait parti d'un bloc `try......catch`
  }