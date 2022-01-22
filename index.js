const selectPlayMode = document.querySelectorAll(".gamemode-dropdown button")
const currentGameMode = document.querySelector("#current-gamemode")
const optionsMenu = document.querySelector(".options")

function handleGameModeSwitch() {
    for(let i = 0; i < selectPlayMode.length; i++) {
        selectPlayMode[i].addEventListener("click", function() {
            currentGameMode.innerText = selectPlayMode[i].innerText
            if(currentGameMode.innerText === "Verseny") {
                optionsMenu.style.display = "none"
                enabledOptionsList.style.display = "none"
                enabledOptions.innerHTML = ""
                enOptions = []
            } else {
                optionsMenu.style.display = "block"
                enabledOptionsList.style.display = "block"
            }
        })
    }
}
handleGameModeSwitch()

const players = document.querySelector(".players ul")
const playerNumber = document.querySelector("#player-number")


function handlePlayerNumber() {
    let numOfCurrentPlayers = players.children.length
    if(playerNumber.value < numOfCurrentPlayers) {
        players.removeChild(players.lastChild)
    } else {
        for(let i = numOfCurrentPlayers; i < playerNumber.value; i++) {
            let li = document.createElement("li")
            let input = document.createElement("input")
            input.setAttribute("type", "text")
            input.setAttribute("value", "Játékos" + (i+1))
            li.appendChild(input)
            players.appendChild(li)
        }
    }
}
playerNumber.addEventListener("input", handlePlayerNumber)


const options = document.querySelectorAll(".options-dropdown button")
const enabledOptionsList = document.querySelector(".enabled-options")
const enabledOptions = document.querySelector(".enabled-options ul")

let enOptions = []
let practiceModeOptions = []

function handleOptionsChange() {
    for(let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", function() {
            if(enOptions.includes(options[i].innerText)) {
                let index = enOptions.indexOf(options[i].innerText)
                enabledOptions.removeChild(enabledOptions.children[index])
                enOptions.splice(index, 1)
                
            } else {
                enOptions.push(options[i].innerText)
                let li = document.createElement("li")
                li.innerText = options[i].innerText
                enabledOptions.appendChild(li)
            }
        })
    }
}
handleOptionsChange()

const difficulty = document.querySelectorAll(".difficulty-dropdown button")
const currDificulty = document.querySelector("#current-difficulty")
let expert = true

function handleDifficultyChange() {
    for(let i = 0; i < difficulty.length; i++) {
        difficulty[i].addEventListener("click", function(){
            currDificulty.innerText = difficulty[i].innerText
            if(currDificulty.innerText === "Haladó") {
                expert = true
            } else {
                expert = false
            }
        })
    }
}
handleDifficultyChange()

const start = document.querySelector("#start-button")
const mainPanel = document.querySelector(".main-panel")
const gameplayPanel = document.querySelector(".gameplay-panel")
const currentPlayers = document.querySelector(".players-table")
const help1 = document.querySelector("#help1")
const help2 = document.querySelector("#help2")
const threeMoreCards = document.querySelector("#more-card")

let timeLimitForMP = false
let timeLimitForSP = false
let singleplayer = false
let multiplayer = false
let actualPlayer

function handleStartButton() {
    mainPanel.style.display = "none"
    gameplayPanel.style.display = "block"
    result.innerHTML = ""
    tableContainer.style.display = "block"

    for(let i = 0; i < playerNumber.value; i++) {
        let tr = document.createElement("tr")
        let tdName = document.createElement("td")
        let tdPoint = document.createElement("td")
        if(players.children[i].firstChild.value === "") {
            tdName.innerText = "Névtelen játékos"
        } else {
            tdName.innerText = players.children[i].firstChild.value
        }
        tdPoint.innerText = 0
        tr.appendChild(tdName)
        tr.appendChild(tdPoint)
        currentPlayers.appendChild(tr)
    }
    if(parseInt(playerNumber.value) === 1) { 
        singleplayer = true
        currentPlayers.children[1].style.border = "3px solid gold"
        highlightedPlayer = currentPlayers.children[1]
        timeLimitForMP = false
        timeLimitForSP = true
    } else {
        multiplayer = true
        timeLimitForMP = true
        timeLimitForSP = false
    }
    if(!enOptions.includes("Van-e SET a leosztásban gomb engedélyezése")) {
        help1.style.backgroundColor = "red" 
    } else {
        practiceModeOptions.push("help1")
    }
    if(!enOptions.includes("SET megmutatása gomb engedélyezése")) {
        help2.style.backgroundColor = "red"
    } else {
        practiceModeOptions.push("help2")
    }
    if(!enOptions.includes("A plusz 3 lapos kiegészítés külön gombon menjen engedélyezése")) {
        threeMoreCards.style.backgroundColor = "red" 
    } else {
        practiceModeOptions.push("threeMoreCards")
    }
    document.querySelector("body").style.backgroundColor = "antiquewhite"
    gameStart() 
}

start.addEventListener("click", handleStartButton)


const backToMenu = document.querySelector("#back-to-menu")


function handleBackToMenu() {
    //clearing all elements when returning to the MainPanel
    mainPanel.style.display = "block"
    gameplayPanel.style.display = "none"
    playerNumber.value = 1
    currentGameMode.innerText = "Verseny"
    enabledOptions.innerHTML = ""
    players.innerHTML = ""

    let li = document.createElement("li")
    let input = document.createElement("input")
    input.setAttribute("type", "text")
    input.setAttribute("value", "Játékos1")
    li.appendChild(input)
    players.appendChild(li)

    currentPlayers.innerHTML = ""
    let tr = document.createElement("tr")
    let th1 = document.createElement("th")
    let th2 = document.createElement("th")
    th1.innerText = "Név"
    th2.innerText = "Pontszám"
    tr.appendChild(th1)
    tr.appendChild(th2)
    currentPlayers.appendChild(tr)

    optionsMenu.style.display = "none"
    enOptions = []
    practiceModeOptions = []
    help1.style.backgroundColor = "whitesmoke"
    help2.style.backgroundColor = "whitesmoke"
    threeMoreCards.style.backgroundColor = "whitesmoke"

    singleplayer = false
    expert = true
    multiplayer = false
    timeLimitForMP = false
    timeLimitForSP = false
    answer.innerText = ""
    tbody.style.height = "600px"
    tableContainer.style.height = "600px"
    setFound.style.display = "none"
    enabledOptionsList.style.display = "none"
    currDificulty.innerText = "Haladó"
    document.querySelector("body").style.backgroundColor = "white"

    while(tbody.children.length !== 4) {
        tbody.removeChild(tbody.lastChild)
    }
}

backToMenu.addEventListener("click", handleBackToMenu)



let deck = []
let onTable = []
let selected = []
let cardsLeft = 81
let startTime
let endTime

function gameStart() {
    if(expert) {
        cardsLeft = 81
    } else {
        cardsLeft = 27
    }
    startTime = new Date()
    handleInGameMenu()
    makeDeck()
    shuffleDeck()
    dealCards()
}

function makeDeck() {
    // Fill the deck with cards
    // Using index as an extra parameter 
    // for keeping track of which card is the representation of the given data
    let index = 0
    onTable = []
    selected = []
    deck.splice(0);
    if(expert) {
        ['red','green', 'purple'].forEach(function(color){
            ['open', 'striped', 'solid'].forEach(function(fill){
                ['diamond', 'oval', 'squiggle'].forEach(function(shape){
                    [1, 2, 3].forEach(function(number){
                        deck.push({
                            index: index,
                            number: number,
                            shape: shape,
                            color: color,
                            fill: fill
                        })
                        index++
                    })
                })
            })
        })
    } else {
        ['red','green', 'purple'].forEach(function(color){
            ['diamond', 'oval', 'squiggle'].forEach(function(shape){
                [1, 2, 3].forEach(function(number){
                    deck.push({
                        index: index,
                        number: number,
                        color: color,
                        shape: shape
                    })
                    index++
                })
            })
        })
    }
}
function shuffleDeck() {
    for(let i = 0; i < deck.length; i++) {
        let swapIndex = i + Math.floor(Math.random() * (deck.length - i))
        let tmp = deck[i]
        deck[i] = deck[swapIndex]
        deck[swapIndex] = tmp
    }
    if(expert) {
        deck.forEach(card => console.log(card.number, card.shape, card.color, card.fill))
    } else {
        deck.forEach(card => console.log(card.number, card.shape, card.color))
    }
}

const tableField = document.querySelector("#cards-on-table")

function dealCards() {
    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 3; j++) {
            let rndCard = deck.pop()
            let cardImage
            if(expert) {
                cardImage = '<img src="cards_for_81/'.concat(rndCard.index.toString(), '.png">');
            } else {
                cardImage = '<img src="cards_for_27/'.concat(rndCard.index.toString(), '.png">');
            }
            tableField.rows[i].cells[j].style.visibility = "visible"
            tableField.rows[i].cells[j].innerHTML = cardImage
            onTable.push(rndCard)
        }
    }
    handleCardsLeftInDeck(12)
    if(findSets().length === 0 && !practiceModeOptions.includes("threeMoreCards")) {
        while(findSets().length === 0) {
            threeMoreCard()
        }
    }
}
  
let selectedCardImages = []

function selectCard(card, index) {
    if(!bannedPlayers.includes(highlightedPlayer) && highlightedPlayer !== undefined) {
        let select = selected.indexOf(index)
        if(select >= 0) {
            selected.splice(select, 1)
            card.firstChild.classList.toggle("highlight")
        } else if(select < 0 && selected.length < 3) {
            selected.push(index)
            card.firstChild.classList.add("highlight")
            card.firstChild.classList.remove("revealed-set")
            selectedCardImages.push(card.firstChild)
            if(selected.length === 3) {
                let selectedCards = [onTable[selected[0]], onTable[selected[1]],onTable[selected[2]]]
                let SET = isSet(selectedCards)
                if(SET) {
                    handleIfSetFound()
                } else {
                    handleIfSetNotFound()
                }
            }
        }
    }
}

const setFound = document.querySelector("#set-found")

function isSet(cards) {
    let SET = true
    let data
    if(expert) {
        data = {
            number: [],
            shape: [],
            color: [],
            fill: []
        }
    } else {
        data = {
            number: [],
            color: [],
            shape: []
        }
    }
    for(let i = 0; i < 3; i++) {
        data.number.push(cards[i].number)
        data.color.push(cards[i].color)
        data.shape.push(cards[i].shape)
        if(expert) {
            data.fill.push(cards[i].fill)
        }
    }
    for(let properties in data) {
        if(!checkProperties(data[properties])) {
            SET = false
        }
    }
    return SET
}

function checkProperties(properties) {
    let allSame = true
    let allDifferent = true
    if(properties[0] === properties[1]) {
        allDifferent = false
    } else {
        allSame = false
    }
    if(properties[1] === properties[2]) {
        allDifferent = false
    } else {
        allSame = false
    }
    if(properties[0] === properties[2]) {
        allDifferent = false
    } else {
        allSame = false
    }
    return allSame || allDifferent
}

let previousPlayer
let highlightedPlayer
let bannedPlayers = []

function highlightPlayer(e) {
    if(!bannedPlayers.includes(e.delegatedTarget) && multiplayer) {
        e.delegatedTarget.classList.add("highlight")
        highlightedPlayer = e.delegatedTarget
        let timeLeft = 10
        let timer = setInterval(function(){
            if(timeLeft <= 0 && selected.length !== 3) {
                clearInterval(timer)
                handleIfSetNotFound()
            } else if(selected.length === 3) {
                clearInterval(timer)
            } else if(previousPlayer !== undefined && e.delegatedTarget !== previousPlayer) {
                clearInterval(timer)
            }
            timeLeft -= 1
        }, 1000)
        if(previousPlayer !== undefined && e.delegatedTarget !== previousPlayer) {
            previousPlayer.classList.remove("highlight")
        }
        previousPlayer = e.delegatedTarget
    }
}
delegate(currentPlayers, "click", "tr", highlightPlayer)

function plusOnePoint(player) {
    player.lastChild.innerText = parseInt(player.lastChild.innerText) + 1
}

function minusOnePoint(player) {
    player.lastChild.innerText = parseInt(player.lastChild.innerText) - 1
}

function handleIfSetFound() {
    let timer = setInterval(function() {
    setFound.innerText = "SET!"
    setFound.style.color = "green"
    setFound.style.display = "block"
    plusOnePoint(highlightedPlayer)
    bannedPlayers.forEach(e => e.classList.remove("banned"))
    bannedPlayers = []
    selectedCardImages =  []
    if(multiplayer) {
        highlightedPlayer.classList.remove("highlight")
        highlightedPlayer = undefined
    }
    replaceThreeCards(selected)
    console.log(findSets().length)
    if(!practiceModeOptions.includes("threeMoreCards")) {
        console.log("nics benne")
    }
    console.log(cardsLeft)
    if(findSets().length === 0 && !practiceModeOptions.includes("threeMoreCards") && cardsLeft > 0) {
        console.log("yeeeeeeeeet")
        while(findSets().length === 0) {
            console.log("bruh")
            threeMoreCard()
        }
    }
    selected = []
    gameOver()
    clearInterval(timer)
    }, 1000)
}

function handleIfSetNotFound() {
    let timer = setInterval(function(){
    setFound.innerText = "Nem SET!"
    setFound.style.color = "red"
    setFound.style.display = "block"
    minusOnePoint(highlightedPlayer)
    for(let i = 0; i < selected.length; i++) {
        selectedCardImages[i].classList.remove("highlight")
    }
    if(!bannedPlayers.includes(highlightedPlayer) && multiplayer) {
            bannedPlayers.push(highlightedPlayer)
            highlightedPlayer.classList.toggle("banned")
    }
    selected = []
    selectedCardImages =  []
    if(bannedPlayers.length === parseInt(playerNumber.value)) {
        bannedPlayers.forEach(e => e.classList.remove("banned"))
        bannedPlayers.forEach(e => e.classList.remove("highlight"))
        bannedPlayers = []
        highlightedPlayer = undefined
    }
    clearInterval(timer)
    }, 1000)
}

function replaceThreeCards(selected) {
    let length = 0
    for(let i = 0; i < onTable.length; i++) {
        if(onTable[i] !== -1) length++
    }
    if(cardsLeft > 0 && length > 12) { // if there are cards left in the
        for(let i = 0; i < 3; i++) {          //deck but there are more than 12 cards on the table
            let cell = document.getElementById("cell".concat(selected[i].toString()))
            onTable.splice(selected[i], 1, -1)
            cell.innerHTML = ""
        }
    } else if(cardsLeft > 0) {   // if there are cards left in the deck 
        handleCardsLeftInDeck(3) //but there is only 12 cards on table at most
        for(let i = 0; i < 3; i++) {
            let newCard = deck.pop()
            let cardImage
            if(expert) {
                cardImage = '<img src="cards_for_81/'.concat(newCard.index.toString(), '.png">');
            } else {
                cardImage = '<img src="cards_for_27/'.concat(newCard.index.toString(), '.png">');
            }
            let cell = document.getElementById("cell".concat(selected[i].toString()))
            onTable.splice(selected[i], 1, newCard)
            cell.innerHTML = cardImage
        }
    } else { // if there isn't any card left in the deck
        for(let i = 0; i < 3; i++) {
            let cell = document.getElementById("cell".concat(selected[i].toString()))
            onTable.splice(selected[i], 1, -1)
            cell.innerHTML = ""
        }
    }
}

const remainingCards = document.querySelector("#cards-left")
function handleCardsLeftInDeck(num) {
    cardsLeft -= num
    remainingCards.innerText = cardsLeft
}

function findSets() {
    let setsFound = []
    for(let i = 0; i < onTable.length; i++) {
        for(let j = 1; j < onTable.length; j++) {
            for(let z = 2; z < onTable.length; z++) {
                if(onTable[i] !== -1 && onTable[j] !== -1 && onTable[z] !== -1) {
                    if(onTable[i] !== onTable[j] && isSet([onTable[i], onTable[j], onTable[z]])) {
                        setsFound.push([onTable[i], onTable[j], onTable[z]])
                    }
                }
            }
        }
    }
    return setsFound
}

const answer = document.querySelector("#answer")

function handleIsThereASetButton() {
     if(practiceModeOptions.includes("help1")) {
        help1.addEventListener( "click", function(){
            if(findSets().length > 0) {
                answer.innerText = "Van SET a pályán!"
            } else {
                answer.innerText = "Nincs SET a pályán!"
            }
        })
    } 
}

function handleShowASetButton() {
    if(practiceModeOptions.includes("help2")) {
        help2.addEventListener( "click", function(){
            let SETs = findSets()
            if(SETs.length > 0) {
                let SET = SETs[0]
                for(let i = 0; i < 3; i++) {
                    let index = onTable.indexOf(SET[i])
                    let cell = document.getElementById("cell".concat(index.toString()))
                    cell.firstChild.classList.add("revealed-set")
                }
            } else {
                answer.innerText = "Nincs több SET a pályán!"

            }
        })
    }
}

const tableContainer = document.querySelector(".playfield")
const tbody = document.querySelector("#cards-on-table tbody")

function handleThreeMoreCardButton() {
    if(practiceModeOptions.includes("threeMoreCards")) {
            console.log("handleThreeMoreCardButton")
            threeMoreCard()
    }
}
threeMoreCards.addEventListener("click", handleThreeMoreCardButton)

function threeMoreCard() {
    if(cardsLeft > 0) {
        let tr = document.createElement("tr")
        tr.setAttribute("id", "r".concat((onTable.length / 3).toString()))
        let id = onTable.length
        for(let i = 0; i < 3; i++) {
            let td = document.createElement("td")
            td.style.height = "150px"
            td.style.width = "200px"
            td.setAttribute("id", "cell".concat(id.toString()))
            td.setAttribute("onclick", "selectCard(this, ".concat(id.toString()).concat(")"))
            id++
        let rndCard = deck.pop()
        let cardImage
        if(expert) {
            cardImage = '<img src="cards_for_81/'.concat(rndCard.index.toString(), '.png">');
        } else {
            cardImage = '<img src="cards_for_27/'.concat(rndCard.index.toString(), '.png">');
        }
        td.innerHTML = cardImage
        tr.appendChild(td)
        onTable.push(rndCard)
        }
        let newHeight = (onTable.length / 3) * 150 + 30
        tbody.style.height = newHeight.toString().concat("px")
        tableContainer.style.height = newHeight.toString().concat("px")
        tbody.appendChild(tr)
        handleCardsLeftInDeck(3)
    }
}

function handleInGameMenu() {
    handleIsThereASetButton()
    handleShowASetButton()
}

const result = document.querySelector("#result")

function gameOver() {
    if(findSets().length === 0 && cardsLeft === 0) {
        alert("Elfogytak a lehetséges SET-ek a játék véget ért!")
        tableContainer.style.display = "none"
        result.style.display = "block"
        if(singleplayer && currentGameMode.innerText === "Verseny") {
            endTime = new Date()
            let timeElapsed = startTime - endTime
            timeElapsed /= 1000
            let seconds = Math.round(timeElapsed)
            result.innerHTML = -seconds + "mp alatt sikerült teljesíteni a pályát!"
        } else if(multiplayer) {
            let table = document.createElement("table")
            let scores =  handleScoreBoard()
            for(let i = 0; i < playerNumber.value; i++) {
                let tr = document.createElement("tr")
                let tdName = document.createElement("td")
                let tdPoint = document.createElement("td")
                tdName.innerText = scores[i].player
                tdPoint.innerText = scores[i].score + " pont" 
                tr.appendChild(tdName)
                tr.appendChild(tdPoint)
                table.appendChild(tr)
            }
            result.appendChild(table)
        }
    } 
}

function handleScoreBoard() {
    let scores = []
    for(let i = 1; i <= playerNumber.value; i++) {
        scores.push({
            player: currentPlayers.children[i].firstChild.innerText,
            score: currentPlayers.children[i].lastChild.innerText
        })
    }
    scores.sort(function(a, b){
        return a.score - b.score
    })
    scores.reverse()
    return scores
}


function delegate(parent, type, selector, fn) {
    function delegatedFunction(e) {
        if (e.target.matches(`${selector},${selector} *`)) {
            let target = e.target;
            while (!target.matches(selector)) target = target.parentNode;
            e.delegatedTarget = target;
            return fn(e);
        }
    }
    parent.addEventListener(type, delegatedFunction, false);
}