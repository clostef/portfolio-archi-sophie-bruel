// création du login******************************************************

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  console.log(form);

  const btnSubmit = document.getElementById("submit");
  console.log(btnSubmit);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const baliseEmail = document.getElementById("email");
    let inputEmail = baliseEmail.value;
    const balisePassword = document.getElementById("password");
    let inputPassword = balisePassword.value;
    console.log(inputPassword);
    console.log(1, inputEmail);
    console.log(2, inputPassword);
    console.log(baliseEmail.value);

    let user = {
      email: inputEmail,
      password: inputPassword,
    };

    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    let result = await response.json();
    console.log("response login", result);

    if (result.error) {
      alert("Erreur dans l’identifiant ou le mot de passe");
    } else {
      localStorage.setItem("user", JSON.stringify(result));
      window.location.href = "index.html";
    }
  });
});
