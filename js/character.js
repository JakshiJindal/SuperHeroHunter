//get character id from url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const apiKey="9494a8648414d0e23ef6033416465e93";
const hash="2465ca654bb7f2745a35204948d4194f";
const url = `https://gateway.marvel.com:443/v1/public`;
const header=`ts=1&apikey=${apiKey}&hash=${hash}`;

const characterDescription = document.getElementById('character-description');
const characterComics = document.querySelector('#character-comics');
const characterEvents = document.querySelector('#character-events');
const characterSeries = document.querySelector('#character-series');
const characterStories = document.querySelector('#character-stories');

//display character fetched from api
const displayCharacter = (character)=>{
    // title.innerHTML = character.name;
    let description = `
                    <div class="character-desc-card mb-5">
                        <img src="${character?.thumbnail?.path}.${character?.thumbnail?.extension}">
                        <div>                    
                            <h3> ${character.name} </h3>
                            <p>${character.description}</p>
                        </div>
                       
                    </div>`;
    characterDescription.innerHTML = description;
    // checkFav(character.id);
//     <div class="char-desc-fav">
//     <button class="char-fav-btn" onclick="toggle(${character.id})"> Add Favourite</button>
// </div>
} 

//display comics fetched from api
const displaySubItems = (items,subItem,type)=>{
    console.log('itemsss',items);
    
    items.map(function(item) {
    let characterItem = `
            <div class = "character-card">
                <p class = "card-name">${item.name}</p>
            </div>`
            subItem.innerHTML+=characterItem;
    });
    // isFavourite('favComic',comic.id);
}

// fetch all character details  
fetch(`${url}/characters/${id}?${header}`)
.then((response) => {
  return response.json();
})
.then((data) => {
  let character = data?.data?.results;
    if(character&&character.length>0){
        displayCharacter(character[0]);
        if(character[0].comics.items.length>0){
          characterComics.innerHTML+=`<div>Comics</div>`;
        displaySubItems(character[0].comics.items,characterComics,"Comics");
        }

        if(character[0].events.items.length>0){
          characterComics.innerHTML+=`<div>Events</div>`;
        displaySubItems(character[0].events.items,characterEvents,"Events");
        }

        if(character[0].series.items.length>0){
          characterComics.innerHTML+=`<div>Series</div>`;
        displaySubItems(character[0].series.items,characterSeries,"Series");
        }

        if(character[0].stories.items.length>0){
          characterComics.innerHTML+=`<div>Stories</div>`;
        displaySubItems(character[0].stories.items,characterStories,"Stories");
        }

}
})
.catch(function(error) {
  console.log(error);
});

