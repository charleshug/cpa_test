//setup logic variables
let timer;
let timeCounter = 30;
let userScore = 0;
let currentQuestion = 0;
let questionIndexValue = 0;


//references to display variables
const displayTime = document.querySelector('#displayTime');
const displayScore = document.querySelector('#displayScore');
const questionArea = document.querySelector('.question-area');
const questionButtons = document.querySelectorAll(".question-button");
const flagButtons = document.querySelector('.flag-buttons');
let questions; //must be defined after the board is built
let flagDivs; //must be defined after the board is built
const hintButton = document.querySelector('#hint-button'); 
const exitButton = document.querySelector('#exit-button');
const previousArrowButton = document.querySelector('#previous');
const nextArrowButton = document.querySelector('#next');


//randomize questions & answer choices
questionBank = randomizeArray(questionBank);
questionBank.forEach(function(question){
    question.choices = randomizeArray(question.choices);
});

startQuiz();

function randomizeArray(array){
    array.forEach(function(item, index){
        let j = index + Math.floor(Math.random() * (array.length - index));
        let temp = array[j];
        array[j] = array[index];
        array[index] = temp;
    });
    return array;
}

function randomize2(array){
    //randomize choices
    let outputArray = array.forEach(function(question, index){
    });
    //randomize questions
    return outputArray;
}

function buildGameBoard(){
    //build the board from questions dataset
    questionBank.forEach(function(itemQuestion,indexQuestion){

        //create div    
        let divQuestion = document.createElement('div');
        divQuestion.classList.add('question');
        if(indexQuestion == 0){
            divQuestion.classList.add('active');
        }

        //create question number
        const questionNumber = document.createElement('div');
        questionNumber.classList.add('question-number');
        questionNumber.innerHTML = '<h2>Question ' + (indexQuestion + 1) + '</h2>';

        //create question text
        let h4QuestionText = document.createElement('div');
        h4QuestionText.classList.add('question-text');
        //let questionTextNode = document.createTextNode(itemQuestion.question);
        //h4QuestionText.appendChild(questionTextNode);
        h4QuestionText.innerHTML = '<p>' + itemQuestion.question + '</p>';
        
        //create answer choices
        let divRadioBtnAnswers = document.createElement('div');
        divRadioBtnAnswers.classList.add('radio-btn-answers');

        itemQuestion.choices.forEach(function(choiceItem, indexItem){
            let divChoice = document.createElement('div');
            let labelRadio = document.createElement('label');
            let inputRadio = document.createElement('input');
            inputRadio.setAttribute('type','radio');
            inputRadio.setAttribute('name','answer_group'+indexQuestion);
            inputRadio.setAttribute('value',choiceItem.value);
            let radioText = document.createTextNode(choiceItem.choice);
            
            labelRadio.appendChild(inputRadio);
            labelRadio.appendChild(radioText);
            divChoice.appendChild(labelRadio);
            divRadioBtnAnswers.appendChild(divChoice);
        });

        //create hint div
        let divHint = document.createElement('div');
        divHint.classList.add('hint'); 
        let hintTitle = document.createElement('h3');
        hintTitle.innerText = 'Hint';
        let hintText = document.createElement('p');
        hintText.classList.add('hidden');
        hintText.innerText = itemQuestion.hint;
        divHint.appendChild(hintTitle);
        divHint.appendChild(hintText);
        divHint.addEventListener('click', function(){hintText.classList.toggle('hidden')});

        divQuestion.appendChild(questionNumber);
        divQuestion.appendChild(h4QuestionText);
        divQuestion.appendChild(divRadioBtnAnswers);
        divQuestion.appendChild(divHint);
        questionArea.appendChild(divQuestion);

        //build the bottom row of buttons
        let d = document.createElement('div');
        let flagValue = indexQuestion + 1;

        //let flagLabel = document.createElement('label');
        //flagLabel.htmlFor = 'flag_' + flagValue;

        let flagButton = document.createElement('button');
        flagButton.classList.add('question-button');
        flagButton.setAttribute('value',flagValue);
        flagButton.innerHTML = flagValue;

        //add event listener
        flagButton.addEventListener("click",function(){changeQuestion(flagValue)});
        
        //flagLabel.appendChild(flagButton);
        //d.appendChild(flagLabel);
        d.appendChild(flagButton);

        let flagCheckbox = document.createElement('input');
        flagCheckbox.setAttribute('type','checkbox');
        flagCheckbox.setAttribute('name','flag_' + flagValue);
        flagCheckbox.setAttribute('id','flag_' + flagValue);

        d.appendChild(flagCheckbox);
        flagButtons.appendChild(d);
    });
    
    //set button listeners
    //hintButton.addEventListener('click', displayHint); //Hint section is now a clickable button
    exitButton.addEventListener('click', callExit);
    previousArrowButton.addEventListener("click", function () { changeQuestion(previousArrowButton.value) });
    nextArrowButton.addEventListener("click", function () { changeQuestion(nextArrowButton.value) });

    /*
    //keyboard event listener
    //TODO left/right arrow immediately following mouse click of radio button will change the radio button checked.
    
    document.addEventListener('keydown', function(event){
        switch(event.code){
            case "ArrowLeft":
                changeQuestion(event.code);
                break;
            case "ArrowRight":
                changeQuestion(event.code);
                break;
        }
    });
    */
    flagDivs = document.querySelectorAll(".flag-buttons > div"); 
    questions = document.querySelectorAll(".question");
    updateActiveQuestionDiv();
    updateDisplayScore();
}

function startQuiz(){
    buildGameBoard();
    //questions = document.querySelectorAll(".question");
    renderTime();
    timer = setInterval(renderTime, 1000);
}

function renderTime(){
    if(timeCounter > 0 ){
        displayTime.innerHTML = 'Time: ' + timeCounter--;
    } else
    {
        timeCounter = 0;
        displayTime.innerHTML = 'Done';
        clearInterval(timer);
        gradeForm();
    }
}

function changeQuestion(callValue){
//    var x = event.target.value;
    switch(callValue){
        case "previous":
            currentQuestion <= 0 ? currentQuestion = (questions.length - 1) : currentQuestion--;
            break;
        case "next":
            currentQuestion >= (questions.length - 1) ? currentQuestion = 0 : currentQuestion++;
            break;
        case "ArrowLeft":
            currentQuestion <= 0 ? currentQuestion = (questions.length - 1) : currentQuestion--;
            break;
        case "ArrowRight":
            currentQuestion >= (questions.length - 1) ? currentQuestion = 0 : currentQuestion++;
            break;
        default:
            //navigate directly to a specific question
            currentQuestion = (callValue - 1);
    }
    updateActiveQuestionDiv();
}

function updateActiveQuestionDiv(){
    questions.forEach(function(question){
        question.classList.remove("active");
    });
    questions[currentQuestion].classList.add("active");
}

function callExit(){
    //sets timer = 0, allows renderTime() to call gradeForm()
    if(reminderFlagsChecked()){
        if (!confirm("You have reminders set, continue?")) { return; }
    }
    //set timer = 0 or else, time continues after exit button clicked
    timeCounter = 0;
}

function reminderFlagsChecked(){
    let flags = Array.from(document.querySelectorAll(".flag-buttons input[type='checkbox']"));
    return flags.some((flag) => flag.checked);

}

/* 
//Now an anonymous function in the Hint div itself
function displayHint(){
    //get current question div > hint
    let currentDiv = document.querySelector('.question.active');
    let hintDiv = currentDiv.querySelector('.hint');
    hintDiv.innerHTML = "<h3>Hint:</h3><p>" + questionBank[currentQuestion].hint + "</p>";
} */

function gradeForm(){
    var userResult = [];
    disableCheckboxes();

    questions.forEach( function(question, questionIndex) {

        //add explanation text
        let d = document.createElement('div');
        d.classList.add('explanation');
        //let questionText = question.querySelector('h4').innerText;
        let questionText = question.querySelector('div.question-text').innerText
        let explanationText = getQuestionExplanationText(questionText);
        d.innerHTML = "<h3>Explanation</h3><p>" + explanationText + "</p>";
        question.appendChild(d);

        //iterate through the radio buttons
        let choices = question.querySelectorAll('input');
        choices.forEach(function (choice) { choice.disabled = true; });
        
        let chosenAnswer = null;
        let chosenAnswerIndex = null;
        let correctAnswer;
        let guessResult;

        let bottomFlags = document.querySelectorAll('.flag-buttons div');

        choices.forEach(function (choice,choiceIndex){
            if(choice.checked){
                chosenAnswer = choice;
                chosenAnswerIndex = choiceIndex;
            }
            if(choice.value == "true"){
                correctAnswer = choice;
            }
        });
        
        if(chosenAnswer==null){
            //no answer chosen
            correctAnswer.closest('label').classList.add('missed-answer');
            bottomFlags[questionIndex].classList.add('wrong-answer');
        }else if(chosenAnswer == correctAnswer){
            //correct answer chosen
            userScore++;
            chosenAnswer.closest('label').classList.add('correct-answer');
        }else{
            //wrong answer chosen
            chosenAnswer.closest('label').classList.add('wrong-answer');
            correctAnswer.closest('label').classList.add('missed-answer');
            bottomFlags[questionIndex].classList.add('wrong-answer');
        }

        guessResult = (chosenAnswer == correctAnswer);
        userResult.push({ question: questionIndex, guess: chosenAnswerIndex, guessResult: guessResult });

    });
    console.log(userResult);
    updateDisplayScore();
}

function getQuestionExplanationText(inputText){
    tempExplanation = 'No explanation found';
    questionBank.forEach( function(questionItem, index){
        if(questionItem.question.includes(inputText)){
            tempExplanation = questionItem.explanation;
        }
    });
    return tempExplanation;
}

function updateDisplayScore(){
    displayScore.innerHTML = "Score: " + userScore + " / " + questionBank.length;
}

function disableCheckboxes(){
    flagButtons.querySelectorAll('input').forEach(function (checkbox) {
        checkbox.disabled = true;
    });
}