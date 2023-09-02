const screenTiles = document.querySelector('.tile-container');
const screenKeys = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');
var word;

const wordUrl = 'https://random-word-api.herokuapp.com/word?length=5';
const vocabularyUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/'
const options = {
	method: 'GET',
};

//api request for a random 5 letter word
const getWord = () => {
    fetch(wordUrl, options)           
    .then(response => response.json())
    .then(data => word = (data[0]));
}

const guesses = [
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','',''],
    ['','','','','']
] 

let currentRow = 0
let currentTile = 0

//creation of the rows for the guesses
guesses.forEach((guessRow , guessRowIndex) => {
    rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    //creation of the single tile inside the row
    guessRow.forEach((guess, guessIndex) =>{
        const tile = document.createElement('div')
        tile.setAttribute('id', 'guessRow-'+guessRowIndex + '-tile-' + guessIndex)
        tile.classList.add('tile')
        rowElement.append(tile)
    })

    screenTiles.append(rowElement)
})

const keys = [
    'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'back','Z', 'X', 'C', 'V', 'B', 'N', 'M', 'enter'
]

keys.forEach(key => {
    //for each element of the array we create a html element as a button
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click',() => handleClick(key))

    screenKeys.append(buttonElement)
})

const checkWord = () => {
    const guess = guesses[currentRow].join('').toLowerCase()
    console.log(vocabularyUrl + guess)
      
    var http = new XMLHttpRequest();
    http.open('HEAD', vocabularyUrl + guess, false);
    http.send();
    if (http.status != 404)
        checkRow()
    else
        nonExistentWord()
}

const handleClick = (key) => {
    //console.log('click', key)
    if(key === 'back'){
        //console.log('back')
        deleteLetter()
        return
    }
    if(key === 'enter'){
        checkWord()
        return
    }
    addLetter(key)
}

//based on the current position of the cursor updates the tile with the clicked letter
const addLetter = (letter) => {
    if(currentTile < 5 && currentRow < 6){
        const tileLetter = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tileLetter.textContent = letter
        tileLetter.setAttribute('data', letter)

        //replaces the array of guesses with the letter to later compare
        guesses[currentRow][currentTile] = letter   
        currentTile++
    }
}

//same as above but replace with empty
const deleteLetter = () => {
    if(currentTile > 0){
        currentTile--
        const tileLetter = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tileLetter.textContent = ''
        guesses[currentRow][currentTile] = ''
        tileLetter.setAttribute('data', '')
    }
    //console.log(guesses)
}

const checkRow = () => {
    const guess = guesses[currentRow].join('').toLowerCase()
    tileColor()

    if(currentTile > 4){
        if(word == guess.toLowerCase()){
            setTimeout(winningBanner, 3000)
            return
        }
        else{
            if(currentRow >= 5){
                setTimeout(losingBanner, 3000)
                return
            }
            currentRow++
            currentTile = 0
        }
    }
}

const nonExistentWord = () => {
    //animation 
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    rowTiles.forEach((tile, index) => {
        const dataLetter = tile.getAttribute('data')
        const letter = dataLetter.toLowerCase()

        setTimeout(() => {tile.classList.add('shake')}, 150 * index)
        tile.classList.remove('shake')
        setTimeout(() => {deleteLetter()}, 300 * index)
    })
    alert("please, enter a valid word")
}

//this function fills up the banner in case the player guessed the right word
const winningBanner = () => {
    
    messageDisplay.removeAttribute('hidden')

    let winningMessage = document.getElementById('result-message')
    winningMessage.innerHTML+= "Congratulations!"

    let winningImage = document.getElementById('img').src="assets/Trophy_Flat_Icon.png"
    let winningImage2 = document.getElementById('img2').src="assets/Trophy_Flat_Icon.png"

    let winningMessage2 = document.getElementById('result-message2')
    winningMessage2.innerHTML+= "You Won!"

    const resultDiv = document.getElementById('result')
    resultDiv.innerHTML += "You guessed in " + (currentRow + 1) + " attempt(s)!"
}

//fils up the banner to show what a loser the player is
const losingBanner = () => {

    messageDisplay.removeAttribute('hidden')

    let winningMessage = document.getElementById('result-message')
    winningMessage.innerHTML+= "Oh no!"

    let winningImage = document.getElementById('img').src="assets/redX.png"
    let winningImage2 = document.getElementById('img2').src="assets/redX.png"

    let winningMessage2 = document.getElementById('result-message2')
    winningMessage2.innerHTML+= "You Lost!"

    const resultDiv = document.getElementById('result')
    resultDiv.innerHTML += "You took too many guesses, the word was: " + word
} 

//color the key inside the keyboard
//the problem lays in handling the recolor of letters that should not happen
const keyColor = (key, color) => {
    const letter = document.getElementById(key)
    if(letter.classList.contains('green-overlay'))
        return
    else if(letter.classList.contains('yellow-overlay') && color == 'green-overlay'){
            letter.classList.remove('yellow-overlay')
            letter.classList.add('green-overlay')
    }else{
        letter.classList.add(color)
    }
}

//change all the tiles of a row with che childNodes attribute
//problem lays in the fetch that gives a lowercase while i use a lowercase
const tileColor = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    rowTiles.forEach((tile, index) => {
        const dataLetter = tile.getAttribute('data')
        const letter = dataLetter.toLowerCase()

        setTimeout(() => {
            tile.classList.add('flip')
            if(letter == word[index]){
                tile.classList.add('green-overlay')
                keyColor(dataLetter, 'green-overlay')
            }else if(word.includes(letter)){
                tile.classList.add('yellow-overlay')
                keyColor(dataLetter, 'yellow-overlay')
            }else{
                tile.classList.add('grey-overlay')
                keyColor(dataLetter, 'grey-overlay')
            }
        }, 500 * index)
    })
}

window.addEventListener("load", getWord);