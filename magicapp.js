
window.onload=function(){
const url='https://api.magicthegathering.io/v1/cards?name='
//changeable endpoints (?name=)
const scryurlmID='https://api.scryfall.com/cards/multiverse/'
  const input = document.getElementById('cardSearch');
  const cardTable=document.getElementById('cardTable');
  const table=document.getElementById('cardInfo');
  const gatherer='http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=';
  let langCell='';
  let artArr=[];
  let cardArr=[];
  let searchName=[];
  let amountContainer;
  let setContainer;
  let amount;
  let midArr=[];
  let scryArr=[];
  let noMID=[]

function newTableRow(){
  image=document.createElement('img');
  amountContainer=document.createElement('div')
  setContainer=document.createElement('div');
  const row=table.insertRow(1);
  cardContent=row.insertCell(0);
  cardName=document.createElement('div');
  cardName.setAttribute('id', 'cardname')
  cardContent.appendChild(cardName)
  amountCell=row.insertCell(1);
  amountCell.appendChild(amountContainer)
  amountContainer.style.overflow='auto';
  amountContainer.style.maxHeight='170px';
  amountContainer.style.minWidth='200px';
  amountContainer.setAttribute('class', 'amountContainer');
  set=row.insertCell(2);
  set.appendChild(setContainer);
  set.style.minWidth='420px';
  setContainer.style.maxHeight='170px';
  setContainer.style.overflow='auto';
  setContainer.setAttribute('id', 'sets')
  const language=row.insertCell(3)
  language.setAttribute('id', 'language')
  const langContainer=document.createElement('div');
  language.appendChild(langContainer);
  langContainer.setAttribute('class', 'langContainer');
  remove=row.insertCell(4)
}

function removeButt(){
  const removeButton=document.createElement('button');
  removeButton.innerHTML='<i class="fa fa-trash-o" aria-hidden="true"></i>';
  remove.appendChild(removeButton)
  removeButton.onclick=function(){
    $(this).closest('tr').empty();
  }
}

function pricing(priceButt){//add pricing variables here, usdtotal, eurostotal, tixtotal multiplied by scryfall get for each
  priceButt.addEventListener('input', function(){
    //change rowID to if !Number, id.slice(5, id.length)
    const rowID=this.closest('div').id;
    let usd, euros, tix;
    if(this.value<0){
      this.value=0;
    }
    scryArr.forEach(p=>{
      if(p.multiverseid==rowID){
       usd=Number(p.usd)
       euros=Number(p.euros)
       tix=Number(p.tix)
      }
    })
    const usdtotal = usd*this.value;
    const eurostotal=euros*this.value;
    const tixtotal=tix*this.value;
    this.closest('div').querySelector('#usd').innerHTML='&#36;' + usdtotal.toFixed(2);
      this.closest('div').querySelector('#euros').innerHTML='&#8364;' + eurostotal.toFixed(2);
      this.closest('div').querySelector('#tix').innerHTML='Tix '+ tixtotal.toFixed(2);
  
    })

}

function amountInput(setTag){//add variable here so amountInfo has id of set
  const amountInfo=document.createElement('div');
  amountInfo.setAttribute('id', setTag);
  const usd =document.createElement('div');
  const euros=document.createElement('div');
  const tix=document.createElement('div');
  tix.setAttribute('id', 'tix');
  usd.setAttribute('id', 'usd');
  euros.setAttribute('id', 'euros');
  amount=document.createElement('input');
  amount.setAttribute('class', 'amount');
  amount.setAttribute('type', 'number')
  amountContainer.appendChild(amountInfo);
  amountInfo.appendChild(usd);
  amountInfo.appendChild(euros);
  amountInfo.appendChild(tix);
  amountInfo.appendChild(amount);
  usd.innerHTML='&#36;'; 
  euros.innerHTML='&#8364;'; 
  tix.innerHTML='Tix ';
  usd.style.color='blue';
  euros.style.color='purple';
  tix.style.color='orange';
  pricing(amount);
}
document.getElementById('cardSearch').addEventListener('keypress', (e) => {
  if(e.which==13){//instead of keycode because of jquery?
   makeRequest(input.value);
  }
}, false)

document.getElementById('getCard').addEventListener('click', function(){
  makeRequest(input.value)
}, false)

//set value to input.value on call
function makeRequest(value){
  fetch(url+value,{method: 'GET'})
  .then(res => res.json())
  .then(data => {
    find(data);
  });
}
function scryfall(mID){
fetch(scryurlmID+mID, {method: 'GET'})
.then(res => res.json())
.then(data =>{
  getPrices(data)
})
}

function getPrices(scrydata){//find out how to not add multiples, if !== undefined and forEach((multiverseid))??
  const scryObj={};
  scryObj.multiverseid=scrydata.multiverse_ids[0];
  scryObj.usd=scrydata.usd;
  scryObj.euros=scrydata.eur;
  scryObj.tix=scrydata.tix;

  if(!scryArr.length){
    scryArr.push(scryObj)
  } else if(!scryArr.map(e=>e.multiverseid).includes(scryObj.multiverseid)){
    scryArr.push(scryObj)
  } 

}

function find(data){//create new object normalizing only data necessary from api call
  //creates new object with each duplicate named result into it's own array
  const cards = data.cards.reduce((result, item) => {
    if(typeof result[item.name] === 'undefined'){
      result[item.name]= [];
    }
    result[item.name].push(item);
    return result;
  }, {});
  //console.log(cards, data.cards)
for (val in cards){
  if(cards.hasOwnProperty(val)){
    newTableRow();
    stuff(cards[val]);
      document.querySelectorAll('#cardname').forEach((title)=>{
      if(cardArr.indexOf(title.textContent) == -1){
      cardArr.push(title.textContent)
    }
    })
    //console.log(cardArr)
    //use this loop to also find lack of multiverse id 
    cards[val].forEach((e)=>{
      
      e.multiverseid ? amountInput(e.multiverseid) : amountInput(e.setName)
      //amountInput(e.multiverseid)
  if(e.names !== undefined){
      for(var i=0;i<cardArr.length;i++){//can change to forEach?
        if(e.names.includes(cardArr[i])){
          let nameOpp=e.names.filter( el=> el !==cardArr[i])
          if(!searchName.includes(nameOpp)){
          searchName.push(nameOpp.toString());
          }
        }
      }
    }
    //scryfall(e.multiverseid)
})
//cards[val].forEach((id)=>{console.log(id.multiverseid)})
  }
  removeButt()
}
//console.log(searchName)
searchName=searchName.filter((e,i,a)=> a.indexOf(e)===i)
searchName.forEach((search)=> flipArtRequest(search))

midArr.length=0;
document.querySelectorAll('.amountContainer').forEach((ac)=>{
ac.childNodes.forEach((did)=>{
  //console.log(Number(did.id))
  if(!midArr.includes(did.id)&&Number(did.id)){
    midArr.push(did.id);
  } else if(noMID.map(e=>e[0])!=did.closest('tr').querySelector('#cardname').textContent){
    noMID.push([did.closest('tr').querySelector('#cardname').textContent,did.id])
  }
  //!midArr.includes(did.id) && Number(did.id) ? midArr.push(did.id) : noMID.push(did.id)
})
})
//noMID.map(e=> console.log(e[0]))
//console.log('noID', noMID)    
  //console.log('mid',midArr)
//do this for noMID array
midArr.forEach((mid)=>{
  setTimeout(scryfall(mid),100)
})
//console.log(midArr)

document.querySelectorAll('img').forEach((img)=>{
  let nameText=img.closest('td').querySelector('#cardname').textContent
img.addEventListener('mouseover', function(){
  doubleFaced(artArr, nameText, this)
})

img.addEventListener('mouseout', function(){
  this.src='http:gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+this.id+'&type=card';
})
})
}

function doubleFaced(arr, divs, pic){//artArr, nameText, this or img? 
  let savedImage, savedSet, savedLang;
  arr.forEach((n)=> {
    if(n.names.includes(divs)&&n.name!==divs){
        //savedImage=n.imageUrl;
        pic.closest('tr').querySelector('#sets').querySelectorAll('input').forEach((i)=>{
          if(i.checked==true){
            savedSet=i.nextElementSibling.textContent;
          }
        })
        pic.closest('tr').querySelector('.langContainer').querySelectorAll('input').forEach((l)=>{
          if(l.checked==true){
            savedLang=l.nextElementSibling.textContent;
          } 
        })
        if(n.setName==savedSet || savedLang=='English'){//change english and button click for it
          savedImage=n.imageUrl;
        }
        /*else{
          savedImage=n.imageUrl;
        }*/

        n.foreignNames !== undefined ? n.foreignNames.forEach((elang) =>{if(elang.language==savedLang){savedImage=elang.imageUrl}}) : savedImage=n.imageUrl;

         /*if(n.foreignNames !==undefined){
          n.foreignNames.forEach((elang)=>{
            if(elang.language==savedLang){
            savedImage=elang.imageUrl;
            }
          })
        } 
        else {
          savedImage=n.imageUrl;
        }*/
     
      pic.src=savedImage;
      
    }
})
}

function stuff(card){
  cardName.innerHTML=card[0].name;
  for(var i=0;i<card.length;i++){//[0], [0+i]
    card[i].imageUrl==undefined ? image.src=card[i++].imageUrl : image.src=card[i].imageUrl;
  }
      cardContent.appendChild(image);
      card.forEach((el) => makeButts(el))
      image.addEventListener('click', function(){
        window.open('http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid='+this.id,'_blank')
      })
}

function flipArtRequest(value){
  fetch(url+value,{method: 'GET'})
  .then(res => res.json())
  .then(data => {
    flipArt(data);
  });
}

function flipArt(data){
  const art=data.cards.reduce((result, item) => {
    if(typeof result[item.name] === 'undefined'){
      result[item.name]= [];
    }
    result[item.name].push(item);
    return result;
  }, {});
  
  for(val in art){
    artArr.push(art[val]);
  }
  artArr=[].concat(...artArr)
  console.log(art,artArr)
}

function languageButt(foreign){//this???
  const br=document.createElement('br');//
  const langLabel=document.createElement('label');//
  const langButton=document.createElement('input');//
  langButton.setAttribute('type', 'radio');//
  langButton.setAttribute('id', foreign.language)
  langCell.appendChild(langButton);//
  langCell.appendChild(langLabel);//
  langCell.appendChild(br);//
  langLabel.textContent=foreign.language;
  langButton.addEventListener('click', function(){
    let langButts=this.closest('td').querySelectorAll('input');
    langButts.forEach((langButt) => {
      if(langButt !== this){
        langButt.checked=false;
      }
    })
    buttClicks(this, foreign);
  })
}

function englishButt(english){
  const br=document.createElement('br');//
  const engLabel=document.createElement('label');//
  const engButton=document.createElement('input');//
  engButton.setAttribute('type', 'radio');//
  langCell.appendChild(engButton);//
  langCell.appendChild(engLabel);//
  langCell.appendChild(br);//
  engLabel.textContent='English';
  engButton.addEventListener('click', function(){
    let allButts=this.closest('td').querySelectorAll('input');
    allButts.forEach((allButt) => {
      if(allButt !== this){
        allButt.checked=false;
      }
    })
buttClicks(this, english);
  })
}

function makeButts(doodle){
  //amountInput();
  let br=document.createElement('br');
  let setLabel=document.createElement('label');
  setLabel.textContent=doodle.setName;
  let setButton=document.createElement('input');
  setButton.setAttribute('type', 'radio');
  setContainer.appendChild(setButton);
  setContainer.appendChild(setLabel);
  setContainer.appendChild(br);
  image.setAttribute('id', doodle.multiverseid);
  setButton.addEventListener('click', function(){
    langCell=this.closest('tr').querySelector('.langContainer');
    if(langCell.innerHTML !==''){
      langCell.innerHTML='';
    }
    if(doodle.foreignNames !==undefined){
      englishButt(doodle);
      doodle.foreignNames.forEach((fname) => languageButt(fname));
     }
    let butts=this.closest('td').querySelectorAll('input');
    butts.forEach((butt) =>{
      if(butt !== this){
        butt.checked =false;
      }
    })
    buttClicks(this, doodle)
  })
}

function buttClicks(button, buttonData){
  button.closest('tr').querySelector('#cardname').textContent=buttonData.name;
  button.closest('tr').querySelector('img').src='http:gatherer.wizards.com/Handlers/Image.ashx?multiverseid='+buttonData.multiverseid+'&type=card';
  button.closest('tr').querySelector('img').setAttribute('id', buttonData.multiverseid);
 
}

}


  /*
  const foo=
  [{name: 'wahetver', set:'whatever'},
  {name: 'whatever}, set:'whatver}  
] 
[name] => [array of meta data]
reduce cards into new object array?
normalize information from request into new object?
cards.reduce((result, item) => {
      if (typeof result[item.name] === 'undefined') {
        result[item.name] = [];
      }

      result[item.name].push(item);

      return result;
    }, {})//set to new object {}
*/