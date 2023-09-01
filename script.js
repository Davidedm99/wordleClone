const screenTiles = document.querySelector('.tile-container');
const screenKeys = document.querySelector('.key-container');
const messageDisplay = document.querySelector('.message-container');

const word = 'SUPER'


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
let isGameOver = false

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

const handleClick = (key) => {
    //console.log('click', key)
    if(key === 'back'){
        //console.log('back')
        deleteLetter()
        return
    }
    if(key === 'enter'){
        checkRow()
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
    const guess = guesses[currentRow].join('')
    tileColor()

    if(currentTile > 4){
        if(word == guess){
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

//this function fills up the banner in case the player guessed the right word
const winningBanner = () => {
    
    messageDisplay.removeAttribute('hidden')

    let winningMessage = document.getElementById('result-message')
    winningMessage.innerHTML+= "Congratulations!"

    let winningImage = document.getElementById('img').src="/assets/Trophy_Flat_Icon.png"
    let winningImage2 = document.getElementById('img2').src="/assets/Trophy_Flat_Icon.png"

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

    let winningImage = document.getElementById('img').src="/assets/redX.png"
    let winningImage2 = document.getElementById('img2').src="/assets/redX.png"

    let winningMessage2 = document.getElementById('result-message2')
    winningMessage2.innerHTML+= "You Lost!"

    const resultDiv = document.getElementById('result')
    resultDiv.innerHTML += "You took too many guesses to find the word, that was: " + word
} 

//color the key inside the keyboard
const keyColor = (key, color) => {
    const letter = document.getElementById(key)
    letter.classList.add(color)
}

//change all the tiles of a row with che childNodes attribute
const tileColor = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    rowTiles.forEach((tile, index) => {
        const dataLetter = tile.getAttribute('data')

        setTimeout(() => {
            tile.classList.add('flip')
            if(dataLetter == word[index]){
                tile.classList.add('green-overlay')
                keyColor(dataLetter, 'green-overlay')
            }else if(word.includes(dataLetter)){
                tile.classList.add('yellow-overlay')
                keyColor(dataLetter, 'yellow-overlay')
            }else{
                tile.classList.add('grey-overlay')
                keyColor(dataLetter, 'grey-overlay')
            }
        }, 500 * index)
    })
}

