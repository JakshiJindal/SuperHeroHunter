let characterContainer = document.querySelector('#character-container');
let comicContainer = document.querySelector('#comic-container');

const apiKey="9494a8648414d0e23ef6033416465e93";
const hash="2465ca654bb7f2745a35204948d4194f";
const url = `https://gateway.marvel.com:443/v1/public`;
const header=`ts=1&apikey=${apiKey}&hash=${hash}`;

let redirect = (type)=>{
    window.location.href = `./${type[0]}.html?id=${type[1]}`;
}

//display favourite characters
const displayCharacter = (character)=>{
    //fetch character details
    fetch(`${url}/characters/${character}?${header}`)
    .then((response) => {
        return response.json();
      }).then((data)=>{
          let character = data?.data?.results[0];

        let characterCard = `
            <div class = "character-card" id = "character-${character.id}">
                <img src="${character.thumbnail.path}.${character.thumbnail.extension}">
                <p class = "card-name">${character.name}</p>
                <div id = "favChar-${character.id}" class="favourite-btn">
                    <i class="fa-solid fa-heart"></i>
                </div>
            </div>`
        characterContainer.innerHTML+=characterCard;
    });
}

//fetch favourite characters and comics from local storage
let charArray = JSON.parse(localStorage.getItem('favChar'));

if(charArray == null || charArray.length == 0){
   document.getElementById('char-empty').innerHTML += `
            <br>
            <br>
            <h5>Nothing here, Add to favourite to display here</h5>
            <br>
            <br>`;
}
else{
    document.getElementById('char-empty').innerHTML += "";
}

charArray.map(character=>displayCharacter(character));