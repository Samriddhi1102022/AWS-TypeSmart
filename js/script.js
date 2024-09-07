const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".wrapper .input-field"),
    tryAgainBtn = document.querySelector(".content button"),
    timeTag = document.querySelector(".time span b"),
    mistakeTag = document.querySelector(".mistake span"),
    wpmTag = document.querySelector(".wpm span"),
    cpmTag = document.querySelector(".cpm span"),
    contactBtn = document.getElementById('contacts-contactBtn'),
    popup = document.getElementById('contacts-popup'),
    closeBtn = document.querySelector('.contacts_close');

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0,
    isPopupOpen = false,
    lineHeight = 21,
    initialLines = 3,
    currentLine = 0,
    scrollFactor = 1.51;

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span class="char">${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll(".char")[0].classList.add("active");
    document.addEventListener("keydown", (e) => {
        if (!isPopupOpen) inpField.focus();
    });
    typingText.addEventListener("click", () => {
        if (!isPopupOpen) inpField.focus();
    });
}

function initTyping() {
    if (isPopupOpen) return; // Prevent typing test when popup is open

    let characters = typingText.querySelectorAll(".char");
    let typedChar = inpField.value.split("")[charIndex];
    if (charIndex < characters.length && timeLeft > 0) { // Allow typing till the end of characters
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) { // Backspace
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        inpField.value = "";
    }

    const activeChar = typingText.querySelector(".char.active");
    const activeCharTop = activeChar.getBoundingClientRect().top;
    const previousChar = activeChar.previousElementSibling;

    if (window.matchMedia("(max-width: 795px)").matches) {
        lineHeight = 19;
        scrollFactor = 1.48
    }    

    if (window.matchMedia("(max-width: 518px)").matches) {
        lineHeight = 18;
        scrollFactor = 1.47
    }   

    if (previousChar) {
        const previousCharTop = previousChar.getBoundingClientRect().top;
        if (activeCharTop > previousCharTop + lineHeight) {
            currentLine++;
            if (currentLine > initialLines) {
                typingText.style.marginTop = -(lineHeight * (currentLine - initialLines))*(scrollFactor) + "px";
            }
        }
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
    typingText.style.marginTop = "0px";
    currentLine = 0;
}

// Function to open the popup
function openPopup() {
    popup.style.display = 'flex';
    isPopupOpen = true;
    document.getElementById('name').focus(); // Focus on the name input field
}

// Function to close the popup
function closePopup() {
    popup.style.display = 'none';
    isPopupOpen = false;
}

// Event listener for the contact button
contactBtn.addEventListener('click', openPopup);

// Event listener for the close button
closeBtn.addEventListener('click', closePopup);

// Close the popup if user clicks outside the popup
window.addEventListener('click', function(event) {
    if (event.target === popup) {
        closePopup();
    }
});

loadParagraph();
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
