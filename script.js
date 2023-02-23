const textToTypeContainer = document.querySelector('#textToTypeContainer')

let textInput = document.querySelector('#textInput')
let referenceTextArray = []
let wordIsValid = false
let wordIndexCount = -1
let numberOfValidWords = 0
let scrollPixels = 0
let totalLengthOfWords = 0
let upcomingWordLength = 0
const validWordColour = "green"
const invalidWordColour = "red"
const upcomingWordColour = "#cc7a00"
let totalAttemptedWords = 0
let wordsPerMinute = 0


fetch('https://flipsum-ipsum.net/api/icw/v1/generate?ipsum=recipe-ipsum-text-generator&start_with_fixed=0&paragraphs=4').then((response) => {
    return response.json()
}).then((data) => {
    data.forEach((textOutput) => {
        //the line below replaces any accented character by the matching non-accented character
        //e.g. "é" becomes "e"
        textOutput = textOutput.normalize("NFD").replace(/\p{Diacritic}/gu, "")
        referenceTextArray = referenceTextArray.concat(textOutput.split(' '))
    })

    let count = 0
    let stringForHtml = '<p class="textParagraph">'
    referenceTextArray.forEach((word) => {
        stringForHtml = stringForHtml + '<span id="word-' + count + '"> ' + word + ' </span>'
        count++
    })
    stringForHtml += '</p>'
    textToTypeContainer.innerHTML += stringForHtml
    let upcomingWord = document.getElementById("word-0")
    upcomingWord.style.color = upcomingWordColour
    upcomingWordLength = upcomingWord.clientWidth
    totalLengthOfWords += upcomingWordLength
})



textInput.addEventListener('keyup', event => {
    let textValue = textInput.value
    let textValueWithoutSpace = textValue.slice(0, textValue.length - 1)

    if (event.code === 'Space') {

        wordIndexCount++
        wordIsValid = (textValueWithoutSpace === referenceTextArray[wordIndexCount])
        let wordJustFinished = document.getElementById("word-" + wordIndexCount)

        if (wordIsValid) {
            numberOfValidWords++
            wordJustFinished.style.color = validWordColour
        } else {
            wordJustFinished.style.color = invalidWordColour
        }
        textInput.value = ''

        let upcomingWordIndex = wordIndexCount + 1
        let upcomingWord = document.getElementById("word-" + upcomingWordIndex)

        upcomingWordLength = upcomingWord.clientWidth
        totalLengthOfWords += upcomingWordLength

        let textParagraphLength = document.querySelector(".textParagraph").clientWidth
        if (totalLengthOfWords >= textParagraphLength) {
            let lineHeight = upcomingWord.clientHeight
            totalLengthOfWords = 0
            totalLengthOfWords += upcomingWordLength
            textToTypeContainer.scroll({
                top: scrollPixels += lineHeight,
                behavior: 'smooth'
            })

        }

        upcomingWord.style.color = upcomingWordColour


        const wordsPerMinuteResult = document.querySelector('#wordsPerMinuteResult')
        const accuracyResult = document.querySelector('#accuracyResult')

    }
})

textInput.addEventListener('input', (event) => {

    let currentWordForLetterCheck = document.getElementById("word-" + (wordIndexCount + 1)).textContent
    let currentWordForLetterCheckNoSpaces = currentWordForLetterCheck.substring(1, currentWordForLetterCheck.length - 1)
    let lettersArray = currentWordForLetterCheckNoSpaces.split('')
    let wordForLetterStyling = document.getElementById("word-" + (wordIndexCount + 1))
    let typedLetter = textInput.value.slice(-1)
    let letterIndexCount = (textInput.value.length - 1)
    let currentLetter = lettersArray[letterIndexCount]


    if (typedLetter === currentLetter) {
        wordForLetterStyling.style.color = validWordColour
        letterIndexCount++
        console.log("correct")
    } else {
        wordForLetterStyling.style.color = invalidWordColour
        letterIndexCount++
        console.log('incorrect!')
    }
    console.log(letterIndexCount)

    if (textInput.value === '') {
        wordForLetterStyling.style.color = upcomingWordColour
    }

})

const timer = document.querySelector("#timerSpan")
const resultsPopup = document.querySelector("#resultsPopup")
let countdown = 59
const once = {
    once: true
}

textInput.addEventListener('keyup', () => {
    const countdownForDisplay = setInterval(() => {
        timer.innerHTML = countdown
        countdown--
    }, 1000)
    const countdownForInput = setTimeout(() => {

        document.querySelector("#resultsPopup").style.display = 'block'
        let scrollPixels = 0
        document.getElementById("textToTypeContainer").scroll({
            top: scrollPixels,
            behavior: 'smooth'
        })

        let totalAttemptedWords = wordIndexCount + 1
        let wordsPerMinute = numberOfValidWords
        let accuracy = Math.round((wordsPerMinute / totalAttemptedWords) * 100) + '%'
        wordsPerMinuteResult.innerHTML = wordsPerMinute
        accuracyResult.innerHTML = accuracy

        textInput.disabled = true
        timer.innerHTML = 0
        clearInterval(countdownForDisplay)

    }, 60000)
}, once)




