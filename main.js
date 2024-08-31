let indexes;
let sources;
let timeOutRunning;

function getRandomIndexes() {
    indexes = [];
    
    while (indexes.length < 16) {
        let random = Math.floor((Math.random() * 8) + 1);
        if (indexes.indexOf(random) != indexes.lastIndexOf(random)) {
            continue;
        }
        else {
            indexes.push(random);
        }
    }
};

getRandomIndexes();

function randomizeImages() {
    sources = [];

    for (let index of indexes) {
        sources.push(`./src/img/${index}.jpg`);
    }
};

randomizeImages();

function updateScore(playerIndex, score) {
    let players = document.querySelectorAll('.score');
    players[playerIndex].textContent = score;
}

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card')
    let winner = document.querySelector('.winner')

    let scoreContainer = document.querySelector('.score-container');
    let buttonWrapper = document.querySelector('.button-wrapper');
    let tryAgainBtn = document.querySelector('.try-again-btn');

    let openedCards = [];
    let activeCards = [];
    let turn = 1;

    let firstPlayerScore = 0;
    let secondPlayerScore = 0;

    function setCardImages() {
        let images = document.querySelectorAll('.card__img');
        images.forEach(i => i.src = '')

        for (let i = 0; i < images.length; i++) {
            images[i].src = `${sources[i]}`;
        }
    }

    setCardImages();

    function gameIsOver() {
        if (openedCards.length == 16) {
            return true;
        }
        return false;
    }

    function resetGame() {
        getRandomIndexes();
        randomizeImages();
        setCardImages();

        openedCards.forEach(c => c.style.display = 'none')

        openedCards = [];
        activeCards = [];
        turn = 1;

        firstPlayerScore = 0;
        secondPlayerScore= 0;

        updateScore(0, firstPlayerScore)
        updateScore(1, secondPlayerScore)

        winner.textContent = ''

        console.log(openedCards)
        console.log(activeCards)
    }

    function getWinner() {
        if (firstPlayerScore > secondPlayerScore) {
            winner.textContent = 'ПЕРВЫЙ ИГРОК ПОБЕДИЛ!'
        }
        else if(firstPlayerScore < secondPlayerScore) {
            winner.textContent = 'ВТОРОЙ ИГРОК ПОБЕДИЛ!'
        }
        else {
            winner.textContent = 'НИЧЬЯ!'
        }
    }

    function nextTurn() {
        if (turn == 1) {
            turn = 2;
        }
        else {
            turn = 1;
        }
    }

    function replaceScore() {
        scoreContainer.style.display = 'none';
        buttonWrapper.style.display = 'flex';
        buttonWrapper.style.justifyContent = 'center';
        tryAgainBtn.addEventListener('click', () => {
            returnScore();
            resetGame();
        })
    }

    function returnScore() {
        buttonWrapper.style.display = 'none';
        scoreContainer.style.display = 'flex';
    }

    function isOpenedCard(card) {
        imageColelction = card.getElementsByTagName('img')
        return imageColelction.length == 1 ? false : true
    }
    
    cards.forEach(card => {

        card.addEventListener('click', (e) => {
            if (timeOutRunning) {
                return;
            }

            let image = card.children[0];
            
            if (activeCards.length < 2 && activeCards[0] != e.target && !isOpenedCard(e.target)) {
                activeCards.push(image);
                image.style.display = 'block';
            }

            if (activeCards.length == 2) {
                if (activeCards[0].src == activeCards[1].src && !isOpenedCard(e.target)) {
                    for (let activeCard of activeCards) {
                        openedCards.push(activeCard);
                        activeCards = [];
                    }
                    if (turn == 1) {
                        firstPlayerScore++;
                        updateScore(turn-1, firstPlayerScore);
                    }
                    else {
                        secondPlayerScore++;
                        updateScore(turn-1, secondPlayerScore);
                    }
                    
                } 
                else {
                    timeOutRunning = true;
                    
                    setTimeout(function (){
                        activeCards.forEach(c => c.style.display = 'none')
                        activeCards = [];
                        timeOutRunning = false;
                    }, 500)

                    nextTurn()
                }
            }

            if(gameIsOver()) {
                getWinner()
                replaceScore()
            }
        })
    }) 
});