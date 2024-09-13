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
        window.sessionStorage.setItem("tokenLogin", data.token);
        window.location.href = "index.html";
      } else {
        alert("E-mail ou mot de passe incorrecte")
      }
    } catch (error) {
        console.error(error.message);
    }
  }