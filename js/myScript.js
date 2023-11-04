// import MD5 from "crypto-js/md5"; 

const characterContainer = document.getElementById('characterContainer');
const searchBar=document.getElementById("searchBar");
  const list = document.createDocumentFragment();

  // https://gateway.marvel.com:443/v1/public/characters?ts=<time-stamp>&apikey=<public-key>&hash=<md5(ts+privateKey+publicKey)>
// const hash=MD5("12728d8e1975ddcd6486e087042c89560743f6f779494a8648414d0e23ef6033416465e93").toString();
const apiKey="9494a8648414d0e23ef6033416465e93";
const hash="2465ca654bb7f2745a35204948d4194f";
const url = `https://gateway.marvel.com:443/v1/public`;
const header=`ts=1&apikey=${apiKey}&hash=${hash}`;
  
// redirect to character info page
const redirect=(navigateTo,id)=>{
  console.log(navigateTo,id);
  window.location.href=`./html/${navigateTo}.html?id=${id}`;
}

//check if a character or comic is present in favourite list
const isFavourite=(type,id)=>{
  let idArr = JSON.parse(localStorage.getItem(type))||[];
  let favBtn = document.querySelector(`#${type}-${id}`);
  try {
      let idx = idArr?.indexOf(id.toString());
      if(idx==-1){
          favBtn.innerHTML = '<i class="fa-regular fa-heart" title = "Add Favourite"></i>';
          favBtn.style.display = 'none';
      }else{
          favBtn.innerHTML = '<i class="fa-solid fa-heart" title = "Remove Favourite"></i>';
          favBtn.style.display = 'block';
      }
  } catch (error) {
      console.log(error)
  }
}

// display heroes
const displayHeroes=(heroes)=>{
  characterContainer.innerHTML="";
  heroes.map(function(character) {
    let characterCard = `
    <div class = "character-card" id="${character.id}" >
        <img src="${character.thumbnail.path}.${character.thumbnail.extension}">
        <p class = "card-name">${character.name}</p>
        <div id="favChar-${character.id}" class="favourite-btn">
            <i class="fa fa-heart-o"></i>
        </div>
    </div>`
    characterContainer.innerHTML+=characterCard;
    isFavourite("favChar",character.id);
  });
}

// fetch all heroes details  
  fetch(`${url}/characters?${header}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let heroes = data?.data?.results;
        if(heroes){
    displayHeroes(heroes);
    }
    })
    .catch(function(error) {
      console.log(error);
    });

// fetch searched value from searchBar
searchBar.addEventListener('keyup',()=>{
  value = searchBar.value;
  console.log('value',value)
  if(value.length>0){
      let marvelSearchURL = `${url}/characters?nameStartsWith=${value}&${header}`;
      fetch(marvelSearchURL).then((response) => {
      return response.json();
    }).then((data)=>{
        let heroes = data?.data?.results;
        if(heroes){
    displayHeroes(heroes);
    }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});
//Toggle favourite
const toggleFav = (type,id)=>{
  let idArr = [];
  let favBtn = document.getElementById(`${type}-${id}`);
  //if character is not added as favourite add else remove
  idArr = JSON.parse(localStorage.getItem(type))||[];
  let idx = idArr?.indexOf(id);
  if(idx==-1){
      idArr.push(id);
      favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      favBtn.style.display = 'block';
  }
  else{
      idArr.splice(idx,1);
      favBtn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      favBtn.style.display = 'none';
  }
  //store data to localstorage
  let idString = JSON.stringify(idArr)
  localStorage.setItem(type,idString);
  //if request comes from favourite page remove card from DOM
  if((window.location.href).split('/').splice(-1)=='favorite.html'){
      if(type=='favComic'){
          document.getElementById(`comic-${id}`).remove();
      }
      document.getElementById(`character-${id}`).remove();
  } 
}

document.addEventListener("click",(event)=>{
  console.log(event.target.parentElement.className);    

  if(event.target.parentElement.className=="character-card"){
    let type = event.target.parentElement.id;
    redirect('character',type);
  }
  else if(event.target.parentElement.className=="favourite-btn"){
    let type =event.target.parentElement.id.split('-');
    toggleFav(type[0],type[1]);
  }
})