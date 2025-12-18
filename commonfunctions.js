let starterArray = [1,2,3,4,5,6,7,8,9,10];


function updateNumberGrid() {
    const grid = document.getElementById('numberGrid');
    let html = '<div class="grid-header"></div><div class="grid-header">Correct:</div><div class="grid-header">Incorrect:</div><div class="grid-header">Skipped:</div><div class="grid-header">Avg Time:</div>';
    
    for (let i = 1; i <= 10; i++) {
        html += `<div class="grid-label">${i}</div>`;
        html += `<div class="grid-cell">${numberStats[i].correct}</div>`;
        html += `<div class="grid-cell">${numberStats[i].incorrect}</div>`;
        html += `<div class="grid-cell">${numberStats[i].skipped}</div>`;
        let total = numberStats[i].correct + numberStats[i].incorrect + numberStats[i].skipped;
        if (total > 0) {
            html += `<div class="grid-cell">${(numberStats[i].totalTime / total).toFixed(1)}</div>`;
        } else {
            html += `<div class="grid-cell">0</div>`;
        }
    }
                
    grid.innerHTML = html;
}

function shuffleArray(inputArray) {
    array = [...inputArray];
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function generateProblemArray() 
{
    array1 = shuffleArray(starterArray);
    array2 = shuffleArray(starterArray);

    return [array1,array2];
}

function nextProblem() {
    /* seems problematic to use globals here. should clean this up somehow */

    if (problemActive && !answered)
    {
        let operator = document.getElementById('operator').textContent;
        let correctAnswer = 0;
        let feedbackElement = document.getElementById('feedback');
        let elapsedTime = (Date.now() - startTime) / 1000;
        let timeText = elapsedTime.toFixed(1) + 's';
        totalTime += elapsedTime;
        const avgTime = (totalTime / currentProblemIdx).toFixed(1);

        if (operator === "+") {
            correctAnswer = currentNum1 + currentNum2;
        }   
        else if (operator === "x") {
            correctAnswer = currentNum1 * currentNum2;
        }
        else {
            correctAnswer = currentNum1;
        }    
        numberStats[currentNum1].skipped++;
        numberStats[currentNum2].skipped++;
        numberStats[currentNum1].totalTime += elapsedTime;
        numberStats[currentNum2].totalTime += elapsedTime;

        skippedCount++;
        feedbackElement.innerHTML = `<div>Skipped! The answer was ${correctAnswer}</div><div class="time-display">${timeText}</div>`;
        feedbackElement.className = 'feedback incorrect';
        document.getElementById('skippedCount').textContent = skippedCount;
        updateNumberGrid();

        document.getElementById('newProblem').textContent = "New Problem";
        problemActive = false;
        return;
    }
    
    let disp1 = 0;
    let operator = document.getElementById('operator').textContent;

    if (currentProblemIdx >= currentProblemArray[0].length) {
        currentProblemArray = generateProblemArray();
        currentProblemIdx = 0;
    }

    currentNum1 = currentProblemArray[0][currentProblemIdx];
    currentNum2 = currentProblemArray[1][currentProblemIdx];
    currentProblemIdx++;


    if (operator === "+" || operator === "x") {
        disp1 = currentNum1;
    }
    else if (operator === "-") {
        disp1 = currentNum1 + currentNum2;
    }
    else {
        disp1 = currentNum1 * currentNum2;
    }

    document.getElementById('num1').textContent = disp1;
    document.getElementById('num2').textContent = currentNum2;
    document.getElementById('answerdisplay').textContent = "?";
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback';

    problemCount++;
    document.getElementById('problemCount').textContent = problemCount;
    
    document.getElementById('newProblem').textContent = "Skip";

    startTime = Date.now();
    answered = false;
    problemActive = true;
    currentAnswer = 0;
}

function checkAnswerCommon() {

    if (!problemActive || answered) return;

    let operator = document.getElementById('operator').textContent;
    let correctAnswer = 0;
    let feedbackElement = document.getElementById('feedback');
    let elapsedTime = (Date.now() - startTime) / 1000;
    let timeText = elapsedTime.toFixed(1) + 's';

    
    if (operator === "+") {
        correctAnswer = currentNum1 + currentNum2;
    }   
    else if (operator === "x") {
        correctAnswer = currentNum1 * currentNum2;
    }
    else {
        correctAnswer = currentNum1;
    }    

    totalTime += elapsedTime;
    const avgTime = (totalTime / currentProblemIdx).toFixed(1);
    
    if (currentAnswer === correctAnswer) {
        correctCount++;
        document.getElementById('correctCount').textContent = correctCount;
        
        feedbackElement.innerHTML = `<div>GREAT!</div><div class="time-display">${timeText}</div>`;
        feedbackElement.className = 'feedback correct';
        
        document.getElementById('avgTime').textContent = avgTime;

        numberStats[currentNum1].correct++;
        numberStats[currentNum2].correct++;
        numberStats[currentNum1].totalTime += elapsedTime;
        numberStats[currentNum2].totalTime += elapsedTime;

        answered = true;
    } else {
        incorrectCount++;
        document.getElementById('incorrectCount').textContent = incorrectCount;

        feedbackElement.innerHTML = `<div>Oof! The answer was ${correctAnswer}</div><div class="time-display">${timeText}</div>`;
        feedbackElement.className = 'feedback incorrect';
        
        numberStats[currentNum1].incorrect++;
        numberStats[currentNum2].incorrect++;
        numberStats[currentNum1].totalTime += elapsedTime;
        numberStats[currentNum2].totalTime += elapsedTime;

        
   }

   updateNumberGrid();
   answered = true;
   document.getElementById('newProblem').textContent = "New Problem";

}
