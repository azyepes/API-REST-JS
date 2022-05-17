// Usando Axios
const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1'
})
api.defaults.headers.common['X-API-KEY'] = '525d4c55-4b14-46fb-86c3-de1bc8ef71be'

// URLs de la API
const BASE_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload';

// Secciones de HTML para random y favorites dogs
const randomDogs = document.getElementById('randomDogs')
const favoritesDogs = document.getElementById('favoritesDogs')
const reloadButton = document.getElementById('reload')
const uploadButton = document.getElementById('uploadButton')

// Manejo de errores
const spanError = document.getElementById('error')

async function myRandomDogs() {

    if (randomDogs.childElementCount !== 0) {
        cleaner(randomDogs)
    } else {
        const { data, status } = await api.get(`/images/search?limit=4`)

        if (status !== 200) {
            spanError.textContent = `Error ${status} ${data.message}`;
        } else {
            // ForEach para crear algunos elementos por cada imagen
            data.forEach(element => {
            // Crear imagen
            let img = document.createElement('img');
            img.src = element.url;

            // crear botón para agregar a favoritos
            let addToFavorite = document.createElement('button');
            addToFavorite.textContent = 'Add to Favorites';
            addToFavorite.setAttribute("id", "addToFavoriteButton");

            // Crear contenedor para cada imagen y boton
            let article = document.createElement('article');

            // Agregar imagen y boton al contenedor
            article.append(img, addToFavorite);

            // Agregar todo a la sección de feed
            randomDogs.appendChild(article);   
            });        
        }
        let favBtn = Array.from(document.querySelectorAll('#addToFavoriteButton'))

        for (let i = 0; i < favBtn.length; i++) {
        let addId = data[i].id
        favBtn[i].addEventListener('click', function () { saveFavorites(addId) }, false)
        }
    }
}

async function saveFavorites(id) {

    const { data, status } = await api.post('/favourites', {
        image_id: id,
    })

    if (status !== 200) {
        spanError.textContent = `Error ${status} ${data.message}`;
    } 
    myFavoritesDogs();
}

async function myFavoritesDogs() {
    
    if (favoritesDogs.childElementCount !== 0) {
        cleaner(favoritesDogs)
    } else {

        const { data, status } = await api.get('/favourites')
    
        if (status !== 200) {
        spanError.textContent = `Error ${status} ${data.message}`;
        } 
        else {
            // ForEach para crear algunos elementos por cada imagen
            data.forEach(element => {

            // Crear imagen
            let img = document.createElement('img');
            img.src = element.image.url;

            // crear botón para agregar a favoritos
            let removeFromFavorite = document.createElement('button');
            removeFromFavorite.textContent = 'Remove from Favorites';
            removeFromFavorite.setAttribute('id', 'removeFromFavoriteButton')

            // Crear contenedor para cada imagen y boton
            let article = document.createElement('article');

            // Agregar imagen y boton al contenedor
            article.append(img, removeFromFavorite);  

            // Agregar todo a la sección de favoritos
            favoritesDogs.appendChild(article)
            
            });
        }

        let removeBtn = Array.from(document.querySelectorAll('#removeFromFavoriteButton'))

        for (let i = 0; i < removeBtn.length; i++) {
        let removeId = data[i].id
        removeBtn[i].addEventListener('click', function () { removeFavorites(removeId) }, false) 
        }
    }
}

async function removeFavorites(id) {
    
    const { data, status } = await api.delete(`/favourites/${id}`)
    
    if (status !== 200) {
        spanError.textContent = `Error ${status} ${data.message}`;
    } 

    myFavoritesDogs();
}

async function cleaner(section) {
    
    for (let i = 0; i < section.childElementCount; i++) {
        section.removeChild(section.children[i])        
    }

    switch (section) {
        case favoritesDogs:
            myFavoritesDogs()
            break;
        
        case randomDogs:
            myRandomDogs()
            break;
    
        default:
            break;
    }
}

async function uploadDog() {
    
    const uploadForm = document.getElementById('uploadForm')
    const formData = new FormData(uploadForm)
    
    const response = await fetch(BASE_URL_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data',
            'X-API-KEY': '525d4c55-4b14-46fb-86c3-de1bc8ef71be',
        },
        body: formData,
    })

    const data = await response.json()


    if (response.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${response.status} ${data.message}`
    }
    else {
        saveFavorites(data.id) //para agregar el michi cargado a favoritos.
    }
}


uploadButton.addEventListener('click', uploadDog)
reloadButton.addEventListener('click', myRandomDogs)
myRandomDogs();
myFavoritesDogs();