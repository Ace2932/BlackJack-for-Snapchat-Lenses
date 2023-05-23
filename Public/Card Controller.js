
//@input Asset.ObjectPrefab cardPrefab
//@input Asset.Texture[] textures
//@input Asset.Texture cardBack




var texMap = {}; //creates
var deck = []
var drawn = []
var playerHand = 0
var dealerHand = 0

var secondCard = false;
var blankCard;
var cardBacking = script.cardBack

var cardZ = 0;

var m_xHit = -4
var m_xDealerHit = -4;
var m_xPlayerHit = -4;
var m_yPlayerHit = -7;
var m_yDealerHit = 2;
var m_pRank = 0;

var xPlayerHit;
var xDealerHit;
var yDealerHit;
var yPlayerHit;







//return the name for a texture file
var nameForObj = function(obj) {
    var nameArr = obj.name.split("/")
    var name = nameArr[nameArr.length - 1].split('.')[0]
    return name
}

//map all the textures to their names 
for (var i=0;i<script.textures.length; i++) {
    var tex = script.textures[i]
    var name = nameForObj(tex);
    texMap[name] = tex
}



//create the deck
var suits = "spades,hearts,diamonds,clubs".split(',')
var ranks = "2,3,4,5,6,7,8,9,10,J,Q,K,A".split(',')
for (var i=0; i<4; i++) {
    for (var j=0; j<13; j++) {
        deck.push(suits[i] + "_" + ranks[j])
    }
}

//basic shuffle function
function shuffle (arr) {
    var j, x, index;
    for (index = arr.length - 1; index > 0; index--) {
        j = Math.floor(Math.random() * (index + 1));
        x = arr[index];
        arr[index] = arr[j];
        arr[j] = x;
    }
    return arr;
}

//shuffle the deck one time.
deck = shuffle(deck)


//draw a card from the deck and reshuffle the deck if all cards have been drawn
var playerDrawCard = function( spawnPosition ) {
    if (deck.length === 0) {
        //reshuffle
        deck = shuffle(drawn)
        drawn = []
    }    
    var hasAce = false;
    var card = deck.pop();
    drawn.push(card);
    var n = card.indexOf("_");
    var rank = card.substring(n+1);
    if (rank == 'A'){
        hasAce = true;
        value = 11;
    } else if (isNaN(parseInt(rank))){ value = 10;} 
    
    else {
       value = parseInt(rank);
    }
    playerHand += value;
    
    if (playerHand > 21){
        if (hasAce){
            playerHand -= 10;
        } else {
        bust();
    } 
        
    }
    
    print(rank)
   
  
    //instantiate the prefab and place it under this script
    var cardObj = script.cardPrefab.instantiate(script.getSceneObject())
    var mesh = cardObj.getComponents("Component.RenderMeshVisual")[2];
    //clone the material of the last mesh so we can change the face of the card without affecting any other spawned cards    
    var mat = mesh.mainMaterial.clone();

    mat.mainPass.baseTex = texMap[card];
    mesh.mainMaterial = mat;
    cardObj.getTransform().setWorldPosition(spawnPosition)
    return cardObj;
}

var dealerDrawCard = function( spawnPosition ) {
    if (deck.length === 0) {
        //reshuffle
        deck = shuffle(drawn)
        drawn = []
    }    
    
    var hasAce = false;
    var card = deck.pop();
    var n = card.indexOf("_")
    var rank = card.substring(n+1)
    if (rank == 'A'){
        hasAce = true;
        value = 11;
    } else if (isNaN(parseInt(rank))){ value = 10;} 
    
    else {
       value = parseInt(rank);
    }
    dealerHand += value;
    
    if (dealerHand > 21){
        if (hasAce){
            dealerHand -= 10;
        } else {
        bust();
    } 
        
    }
    

   
    if ( secondCard ){
    var cardObj = script.cardPrefab.instantiate(script.cardBack)
    var mesh = cardObj.getComponents("Component.RenderMeshVisual")[2];
    //clone the material of the last mesh so we can change the face of the card without affecting any other spawned cards    
    var mat = mesh.mainMaterial.clone();

    mat.mainPass.baseTex = texMap[card];
    mesh.mainMaterial = mat;
    cardObj.getTransform().setWorldPosition(spawnPosition)
    return cardObj;
    } else {
  
    //instantiate the prefab and place it under this script
    var cardObj = script.cardPrefab.instantiate(script.getSceneObject())
    var mesh = cardObj.getComponents("Component.RenderMeshVisual")[2];
    //clone the material of the last mesh so we can change the face of the card without affecting any other spawned cards    
    var mat = mesh.mainMaterial.clone();

    mat.mainPass.baseTex = texMap[card];
    mesh.mainMaterial = mat;
    cardObj.getTransform().setWorldPosition(spawnPosition)
    return cardObj;
    }
   
    secondCard ? secondCard = false: secondCard = true;

    
}

var dealBlank = function( spawnPosition ) {
    var cardObj = script.cardPrefab.instantiate(script.getSceneObject())
    var mesh = cardObj.getComponents("Component.RenderMeshVisual")[2];
    //clone the material of the last mesh so we can change the face of the card without affecting any other spawned cards    
    var mat = mesh.mainMaterial.clone();

    mat.mainPass.baseTex = cardBacking;
    mesh.mainMaterial = mat;
    cardObj.getTransform().setWorldPosition(spawnPosition)
    return cardObj;
}



function setChips(value){
    chips = value;
}


 function bust(){
   
}


function check(){
    disposeCard(blank)
}


function winHand(){
    chips = chips + (2*intSlider)
    
}



//destroy a card when no longer in use to free up memory
var disposeCard = function(card) {
    card.destroy()
}

global.startGame = function(){
    
startHand()
}



function startHand(){
xPlayerHit = m_xHit;
xDealerHit = m_xDealerHit;
yDealerHit = m_yDealerHit;
yPlayerHit = m_yPlayerHit;
playerDrawCard(new vec3(0,-9, cardZ))
dealerDrawCard(new vec3(-3, 15, cardZ))
blankCard = dealBlank(new vec3(-3, 15, cardZ))
playerDrawCard(new vec3(-3, -8, (cardZ-1)))
dealerDrawCard(new vec3(0, 14, cardZ+1))

}


global.playerHitMe = function(){
    xPlayerHit = xPlayerHit - 3;
    yPlayerHit = yPlayerHit - 1;
    playerDrawCard(new vec3(xPlayerHit, yPlayerHit, cardZ))
    
    
}

global.playerCheck = function(){
print("check check")
    disposeCard(blankCard);
    
}


function dealerHitMe(){
    dealerDrawCard(new vec3(xDealerHit, yDealerHit, cardZ))
    xDealerHit = xDealerHit + 3;
    yPlayerHit = yPlayerHit + 1;
}

//print("player hand: " + playerHand)
//print("dealer hand: " + dealerHand)
