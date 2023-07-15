//ajout de la gallery****************************************************************

const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();
console.log(works);

const gallery = document.querySelector(".gallery");

works.forEach((element) => {
  const newDiv2 = document.createElement("figure");
  const addElementFig2 = `
  <img src="${element.imageUrl}" alt="${element.title}">
  <figcaption>${element.title}</figcaption>
  `;

  newDiv2.innerHTML = addElementFig2;
  gallery.appendChild(newDiv2);
});

const suppFigure = document.querySelectorAll(".gallery figure");

for (let i = 0; i < 11; i++) {
  suppFigure[i].remove();
}
console.log(suppFigure);

// création des boutons filtre***********************************************************

const responseFilter = await fetch("http://localhost:5678/api/categories");
const categories = await responseFilter.json();

console.log(categories);

const btnTous = document.createElement("button");
btnTous.classList.add("btn_projects");

btnTous.innerText = "Tous";

const divButtons = document.createElement("div");
divButtons.classList.add("all-btn");

divButtons.appendChild(btnTous);

const sectionPortfolio = document.querySelector("#portfolio");

function filterByCategory(id) {
  console.log(id);
  console.log("categorie");
  console.log(categories);
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const filteredWorks = works.filter((work) => {
    if (id === 0) {
      return true;
    }
    return work.categoryId === id;
  });
  console.log(filteredWorks);
  const suppFigure = document.querySelectorAll(".gallery figure");
  console.log(suppFigure, 2);
  for (let i = 0; i < suppFigure.length; i++) {
    suppFigure[i].remove();
  }
  const gallery = document.querySelector(".gallery");

  filteredWorks.forEach((element) => {
    const newDiv2 = document.createElement("figure");
    const addElementFig2 = `
  <img src="${element.imageUrl}" alt="${element.title}">
  <figcaption>${element.title}</figcaption>
  `;

    newDiv2.innerHTML = addElementFig2;
    gallery.appendChild(newDiv2);
  });
}

categories.forEach((element) => {
  const btn = document.createElement("button");
  btn.classList.add("btn_projects");
  btn.innerText = element.name;
  divButtons.appendChild(btn);
  btn.addEventListener("click", function () {
    filterByCategory(element.id);
  });
});

sectionPortfolio.insertBefore(divButtons, sectionPortfolio.children[1]);

btnTous.addEventListener("click", function () {
  filterByCategory(0);
});

//creation de la modal*********************************************

async function deleteWork(element) {
  console.log(element);
  const token = JSON.parse(localStorage.getItem("user")).token;
  console.log("token ->", token);

  const headers = {
    Authorization: "Bearer " + token,
  };

  await fetch("http://localhost:5678/api/works/" + element.id, {
    method: "DELETE",
    headers,
  });
}

document.getElementById("modalBtn").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  const galleryAdmin = document.querySelector(".gallerie-admin");

  const deletePhoto = (id) => {
    console.log(id);
  };
  galleryAdmin.innerHTML = "";
  works.forEach((element, i) => {
    const newDiv2 = document.createElement("figure");
    const addElementFig2 = `
      <img src="${element.imageUrl}" width="90px" alt="${element.title}">
      <figcaption>editer</figcaption>
      <button class="delete-photo"><i class="fa-regular fa-trash-can"></i></button>
    `;

    newDiv2.innerHTML = addElementFig2;
    galleryAdmin.appendChild(newDiv2);

    document
      .querySelectorAll(".delete-photo")
      [i].addEventListener("click", function (event) {
        deleteWork(element);
      });
  });

  document
    .querySelector("#deleteAllWorks")
    .addEventListener("click", function () {
      works.forEach((element) => {
        deleteWork(element);
      });
    });

  document.getElementById("addWork").addEventListener("click", function () {
    document.getElementById("galerie-p").style.display = "none";
    document.getElementById("form-add-work").style.display = "block";
    document.getElementById("precedent").style.display = "block";
    document.getElementById("addWork").style.display = "none";
    document.getElementById("deleteAllWorks").style.display = "none";
    document.getElementById("line").style.display = "none";
    document.getElementById("fileInput").style.display = "none";

    let options = "";
    categories.forEach((element) => {
      console.log(element);
      options +=
        "<option value='" + element.id + "'>" + element.name + "</option>";
    });

    document.getElementById("list-categories").innerHTML = options;

    const fileInput = document.getElementById("fileInput");

    const fileButton = document.createElement("button");
    fileButton.classList.add("btn-add-gal");
    fileButton.innerText = "+ Ajouter photo";
    fileButton.addEventListener("click", () => {
      fileInput.click();
    });

    fileInput.parentNode.insertBefore(fileButton, fileInput);

    fileInput.addEventListener("change", handleFileSelect);

    document
      .getElementById("uploadForm")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];

        if (document.getElementById("title-photo").value === "") {
          alert("Le titre est vide");
        } else {
          if (file && isFileTypeValid(file) && isFileSizeValid(file)) {
            const formData = new FormData();
            formData.append("image", file);
            formData.append(
              "title",
              document.getElementById("title-photo").value
            );
            formData.append(
              "category",
              document.getElementById("list-categories").value
            );

            const token = JSON.parse(localStorage.getItem("user")).token;

            const headers = {
              Authorization: "Bearer " + token,
            };

            try {
              const response = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers,
                body: formData,
              });

              if (response.ok) {
                console.log("Fichier téléchargé avec succès");
              } else {
                console.log("Erreur lors du téléchargement du fichier");
              }
            } catch (error) {
              console.log(
                "Une erreur est survenue lors de la requête de téléchargement"
              );
              console.error(error);
            }
          } else {
            alert("le fichier n'est pas valide");
          }
        }
      });

    document.getElementById("precedent").addEventListener("click", function () {
      document.getElementById("galerie-p").style.display = "block";
      document.getElementById("form-add-work").style.display = "none";
      document.getElementById("precedent").style.display = "none";
      document.getElementById("addWork").style.display = "block";
      document.getElementById("deleteAllWorks").style.display = "block";
      document.getElementById("line").style.display = "block";
      document.querySelector(".btn-add-gal").style.display = "none";
    });
  });
});

document
  .getElementsByClassName("close")[0]
  .addEventListener("click", function () {
    document.getElementById("galerie-p").style.display = "block";
    document.getElementById("form-add-work").style.display = "none";
    document.getElementById("precedent").style.display = "none";
    document.getElementById("modal").style.display = "none";
    document.getElementById("addWork").style.display = "block";
    document.getElementById("deleteAllWorks").style.display = "block";
    document.getElementById("line").style.display = "block";
    document.querySelector(".btn-add-gal").style.display = "none";
  });

function isFileTypeValid(file) {
  const fileType = file.type;
  return fileType === "image/jpeg" || fileType === "image/png";
}

function isFileSizeValid(file) {
  const maxSizeInBytes = 4 * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imageUrl = event.target.result;
    const imgElement = document.createElement("img");
    imgElement.src = imageUrl;
    imgElement.style.height = "200px";

    const fileImg = document.getElementById("file-img");
    fileImg.style.display = "none";

    const previewDiv = document.getElementById("imagePreview");
    previewDiv.style.visibility = "visible";
    previewDiv.innerHTML = "";
    previewDiv.appendChild(imgElement);
  };

  reader.readAsDataURL(file);
}
