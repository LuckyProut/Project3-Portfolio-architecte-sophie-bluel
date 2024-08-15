const loginApi = "http://localhost:5678/api/users/login";

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formLogin").addEventListener("submit", submitLoginForm);
    // on doit écouter l'input "submit" et pas la class "submitInput"?
});

async function submitLoginForm(event) {
    event.preventDefault();
    let user = {
      email: "sophie.bluel@test.tld",
      password: "S0phie",
    };
  
    try {
      let response = await fetch(loginApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let result = await response.json();
      console.log(result);
    //   console.log("E-mail:", user.email)
    //   console.log("MDP", user.password)
    } catch (error) {
        console.error(error.message);
    }
  }