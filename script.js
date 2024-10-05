let generatedCode = '';
let selectedCardType = '';
let verticalTextTemplate = `
    المعلمون هم قلب التعليم النابض<br>
    ..شكراً لمربي الأجيال<br>
    المعلم/ {name}<br>
    ..شكراً لمن أضاء قناديل العلم والمعرفة.<br>
    ..شكراً لرمز التضحية والعطاء<br>
    شكراً لمعلمينا ... لكم كل الامتنان والتقدير<br>
    مدير المدرسة/ {manager} 
`;


document.addEventListener("DOMContentLoaded", function () {
    generateNewCode();
});

function generateNewCode() {
    generatedCode = Math.floor(100 + Math.random() * 900).toString();
    document.getElementById("verificationInput").value = generatedCode;
    document.getElementById("generatedNumber").innerText = `${generatedCode}`;
}

function selectCard(type) {
    selectedCardType = type;
    document.querySelectorAll('.card-select').forEach(card => {
        card.classList.remove('card-selected');
    });
    document.getElementById(type + 'Card').classList.add('card-selected');
}
document.getElementById("nameInput").addEventListener("blur", validateInput);
document.getElementById("userInput").addEventListener("blur", validateInput);
document.getElementById("managerInput").addEventListener("blur", validateInput);

document.getElementById("nameInput").addEventListener("input", clearValidationMessage);
document.getElementById("userInput").addEventListener("input", clearValidationMessage);
document.getElementById("managerInput").addEventListener("input", clearValidationMessage);

function validateInput(event) {
    const inputId = event.target.id;
    let validationMessage = '';

    switch (inputId) {
        case "nameInput":
            if (!event.target.value) {
                validationMessage = "يرجى إدخال اسم المعلم";
            }
            document.getElementById("nameValidation").textContent = validationMessage;
            break;

        case "userInput":
            if (!event.target.value) {
                validationMessage = "يرجى إدخال رمز التحقق";
            }
            document.getElementById("userValidation").textContent = validationMessage;
            break;

        case "managerInput":
            if (!event.target.value) {
                validationMessage = "يرجى إدخال اسم المدير";
            }
            document.getElementById("managerValidation").textContent = validationMessage;
            break;
    }
}

function clearValidationMessage(event) {
    const inputId = event.target.id;
    const validationId = inputId === "nameInput" ? "nameValidation" 
                      : inputId === "userInput" ? "userValidation" 
                      : "managerValidation";

    if (event.target.value) {
        document.getElementById(validationId).textContent = "";
    }
}

function downloadCard() {
    const name = document.getElementById("nameInput").value;
    const manager = document.getElementById("managerInput").value;
    const userInput = document.getElementById("userInput").value;
    const generatedCodeInput = document.getElementById("verificationInput").value;

    document.getElementById("nameValidation").textContent = "";
    document.getElementById("managerValidation").textContent = "";
    document.getElementById("userValidation").textContent = "";

    let isValid = true;

    if (!name) {
        document.getElementById("nameValidation").textContent = "يرجى إدخال اسم المعلم";
        isValid = false;
    }

    if (!manager) {
        document.getElementById("managerValidation").textContent = "يرجى إدخال اسم المدير";
        isValid = false;
    }

    if (userInput !== generatedCodeInput) {
        document.getElementById("userValidation").textContent = "رمز التحقق غير صحيح";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const cardText = updateCardText(name, manager);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (selectedCardType === 'vertical') {
        canvas.width = 600; 
        canvas.height = 900; 
    } else {
        canvas.width = 900;
        canvas.height = 600; 
    }

    const backgroundImage = new Image();
    backgroundImage.src = 'images/teacher-day background.jpg'; 
    backgroundImage.onload = function() {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white"; 
        ctx.font = "bold 36px 'Calibri Light', sans-serif"; 
        ctx.textAlign = "center";

        const textLines = cardText.split("<br>");
        const lineHeight = 40;
        const totalHeight = textLines.length * lineHeight;
        let startY = (canvas.height / 2) - (totalHeight / 2);

        textLines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
        });

        const link = document.createElement('a');
        link.download = selectedCardType === 'vertical' ? 'vertical_teacher_card.png' : 'horizontal_teacher_card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };
}

function updateCardText(name, manager) {
    const personalizedText = verticalTextTemplate
        .replace('{name}', name)
        .replace('{manager}', manager);
    return personalizedText;
}

function resetForm(event) {
    event.preventDefault();
    generateNewCode();
    document.getElementById("nameInput").value = '';
    document.getElementById("userInput").value = '';
    selectedCardType = '';
    document.querySelectorAll('.card-select').forEach(card => {
        card.classList.remove('card-selected');
    });
}

function readAloud(event) {
    debugger;
    event.preventDefault(); 
    const number = generatedCode;
    const utterance = new SpeechSynthesisUtterance(`${number}`);
    window.speechSynthesis.speak(utterance);
}

