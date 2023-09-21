

window.addEventListener("load", axios.get('/api/album/list')
  .then(function (response) {   
    const mainNode = document.getElementById("album");
    let photos = response.data;

    photos.forEach((photo) => {
      newHTML = `
          <div class="w3-third">
            <a href="./photo/${ photo._id }">
              <img 
                src="/public/images/${ photo.thumbnail }" 
                style="width:100%" 
                alt="${ photo.description }"
              >
            </a>
          </div>
          `;
      mainNode.insertAdjacentHTML("beforeend", newHTML);
    })
  })
  .catch(function (error) {
    console.error(error);
  })
);