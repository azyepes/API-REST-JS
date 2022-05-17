// URLs de la API
const BASE_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search';
const BASE_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites';
const API_KEY = '525d4c55-4b14-46fb-86c3-de1bc8ef71be'
const limit = 4
const LIMIT_API = `limit=${limit}`
let addToFavorite

// Secciones de HTML para random y favorites dogs
const randomDogs = document.getElementById('randomDogs')
const favoritesDogs = document.getElementById('favoritesDogs')

// Manejo de errores
const spanError = document.getElementById('error')

async function myRandomDogs() {

    if (randomDogs.childElementCount !== 0) {
        cleaner(randomDogs)
    } else {
        const response = await fetch(`${BASE_URL_RANDOM}?${LIMIT_API}`);
        const randomData = await response.json();

        if (!response.status === 200) {
            spanError.textContent = `Error ${response.status} ${data.message}`;
        } else {
            // ForEach para crear algunos elementos por cada imagen
            randomData.forEach(element => {
            // Crear imagen
            let img = document.createElement('img');
            img.src = element.url;

            // crear botón para agregar a favoritos
            addToFavorite = document.createElement('button');
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
        let addId = randomData[i].id
        favBtn[i].addEventListener('click', function () { saveFavorites(addId) }, false)
        }
    }
    
}

async function saveFavorites(id) {

    const response = await fetch(`${BASE_URL_FAVORITES}?${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
        body: JSON.stringify({
            image_id: id
        }),

    });

    const data = await response.json()

    if (response.status !== 200) {
        spanError.textContent = `Error ${response.status} ${data.message}`;
    } 
    myFavoritesDogs();
}

async function myFavoritesDogs() {
    
    if (favoritesDogs.childElementCount !== 0) {
        cleaner(favoritesDogs)
    } else {
        const response = await fetch(`${BASE_URL_FAVORITES}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
            }
        });
        const favoriteData = await response.json();
    
        if (response.status !== 200) {
        spanError.textContent = `Error ${response.status}`;
        } 
        else {
            // ForEach para crear algunos elementos por cada imagen
            favoriteData.forEach(element => {

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
        let removeId = favoriteData[i].id
        removeBtn[i].addEventListener('click', function () { removeFavorites(removeId) }, false) 
        }
    }
}

async function removeFavorites(id) {
    
    const response = await fetch(`${BASE_URL_FAVORITES}/${id}?${API_KEY}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': API_KEY,
        },
    })

    const data = await response.json()

    if (response.status !== 200) {
        spanError.textContent = `Error ${response.status} ${data.message}`;
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


const reloadButton = document.getElementById('reload')
reloadButton.addEventListener('click', myRandomDogs)
myRandomDogs();
myFavoritesDogs();