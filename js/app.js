var utility;
var gameEngine = new GameEngine();
var validateInputFields= new ValidateInputFields();

document.addEventListener("DOMContentLoaded", function () {
  utility = new Utility();

  let playGameButton = document.getElementById("playGameButton");// Main Screen Play game button
	playGameButton.addEventListener("click", function () {
		if (validateInputFields.isValid.gameLevel &&validateInputFields.isValid.username) {
		  utility.parameters.popupScreen.style.display = "none";
		  utility.parameters.gameCountDown.style.display="block";
		  utility.resetSelectedLevelFields();
		  utility.gameBoardCreation("game-board",utility.parameters.level,750,750,10,10,utility.parameters.cardImagesArray);
		  gameEngine.gameLoad();
		} else {
		  console.log("failed",validateInputFields.isValid.gameLevel,validateInputFields.isValid.username);
		}
	});

  let playAgainButton = document.querySelectorAll("#playAgain");
  playAgainButton.forEach(function (buttonPlay) {
    buttonPlay.addEventListener("click", function (event) {
      console.log(event.target.name);
      if (event.target.name == "mainScreen_playAgain") {
		    utility.parameters.gameCountDown.style.display="block";
			utility.resetSelectedLevelFields();
      } else if (event.target.name == "gameEndScreen_playAgain") {
			utility.closePopUp();
		    utility.parameters.gameCountDown.style.display="block";
			utility.resetSelectedLevelFields();
      }
    });
  });

  let resetConfigurations = document.getElementById("resetGame"); //Setting button
  resetConfigurations.addEventListener("click", function (event) {
    utility.openGameConfigurationPopup();
  });

  let backButtonGameEnd = document.getElementById("BackToGameConfig");//back button
  backButtonGameEnd.addEventListener("click", function (event) {
    utility.openGameConfigurationPopup();
  });

  let backToHomeButton = document.getElementById("BackToHomeButton");//back to home button
  backToHomeButton.addEventListener("click", function (event) {
    window.location.href = "home.html";
  });

  /*--------------------------------------------------------------------------------------------*/

  /*----------------Taking Inputs------------*/

  let gameLevels = document.getElementById("gameLevels");
  gameLevels.addEventListener("change", function () {
    validateInputFields.validateGameLevels(gameLevels);
  });

  let usernameInput = document.getElementById("username");
  usernameInput.addEventListener("input", function (event) {
    validateInputFields.validateUsername(usernameInput);
  });

  /*-----------------------------------------*/

});

  /*--------------------------------------------------------------------------------------------*/
  function Utility() {
    this.parameters = {
      score: 0,
      move: 0,
      mistake: 0,
      totalMistakes: 0,
      username: "",
      timer: 0,
      level: 0,
      cardImagesArray: ["angular", "aurelia", "backbone", "react","ember","vue","js","java","spring"],
      gameCards : [],
      timerInterval: null,
	  gameLevelConfiguration: {
        2: { level: 4, totalMistakes: 5, timer: 30, label: "Easy", color: "green" },
        4: { level: 4, totalMistakes: 4, timer: 60, label: "Medium", color: "yellow" },
        6: { level: 6, totalMistakes: 6, timer: 90, label: "Hard", color: "red" }
	  },

      timerElement: document.getElementById("timer"),
      totalMistakesElement: document.getElementById("totalMistakes"),
      usernameElement: document.querySelector(".username-info"),
      mistakeElement: document.getElementById("mistake"),
      totalMistakesElement: document.getElementById("totalMistakes"),
      gameScoreElement: document.getElementById("gameScore"),
      moveElement: document.getElementById("move"),

      gameEndHeaderText :document.querySelector(".gameEnd-header-text"),
      gameEndReason :document.querySelector(".gameEnd-reason"),
      gameEndScore :document.querySelector("#gameEndScore"),
      gameEndPopup: document.querySelector(".gameEndPopup-information"),
      gameConfigPopup: document.querySelector(".game-popup-panel"),
      popupScreen: document.getElementById("popup-screen"),
      gameCountDown: document.getElementById("game-start-countdown"),
      
      countDown:document.getElementById('countDownStart'),//countdown element
      count:5,//count down timer 

      levelHeadText :document.getElementById("level-head"),
      mistakeLimit :document.getElementById("mistakeLimit"),
      timeLimit: document.getElementById("timeLimit"),
    };
   
    const closePopUp = () => {	this.parameters.popupScreen.style.display = "none";  };

	const shuffleArray = (array) => {
	  for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	  }
	  return array;
	};

    const openGameEndPopup = (result, message,score) => {
      this.parameters.popupScreen.style.display = "block";
      this.parameters.gameConfigPopup.style.display = "none";
      this.parameters.gameEndPopup.style.display = "block";
      if (result == "lose") {
        this.parameters.gameEndHeaderText.innerHTML = "Game Over";
        this.parameters.gameEndHeaderText.style.color = "red";
        this.parameters.gameEndReason.innerHTML = message;
        this.parameters.gameEndScore.innerHTML=score;
		 clearInterval(this.parameters.timerInterval);
      } else if (result == "win") {
        this.parameters.gameEndHeaderText.innerHTML = "Game Won";
        this.parameters.gameEndHeaderText.style.color = "green";
        this.parameters.gameEndReason.innerHTML = message;
        this.parameters.gameEndScore.innerHTML=score;
		 clearInterval(this.parameters.timerInterval);
      } else if (result == "time") {
        this.parameters.gameEndHeaderText.innerHTML = "Game Over";
        this.parameters.gameEndHeaderText.style.color = "red";
        this.parameters.gameEndReason.innerHTML = message;
        this.parameters.gameEndScore.innerHTML=score;
		 clearInterval(this.parameters.timerInterval);
      }
    };
    const openGameConfigurationPopup = () => {
      this.parameters.popupScreen.style.display = "block";
      this.parameters.gameEndPopup.style.display = "none";
      this.parameters.gameConfigPopup.style.display = "block";
    };

    const resetSelectedLevelFields = () => {
	  //console.log("pushed", utility.parameters.gameCards);
      this.parameters.totalMistakesElement.innerHTML =this.parameters.totalMistakes;
      this.parameters.timerElement.innerHTML = this.parameters.timer;
      this.parameters.mistakeElement.innerHTML = 0;
      this.parameters.gameScoreElement.innerHTML = 0;
      this.parameters.moveElement.innerHTML = 0;
	  this.parameters.usernameElement.innerHTML = this.parameters.username;
      this.parameters.move=0;
      this.parameters.score=0;
      this.parameters.mistake=0;
      this.gameBoardCreation("game-board",this.parameters.level,750,750,10,10,this.parameters.cardImagesArray);
      for(let card of utility.parameters.gameCards){
        card.disabled=false;
      }
	  //console.log("pushed", utility.parameters.gameCards);
	  gameEngine.gameLoad();
    };
	const createArrayOfImages=(cardImagesArray,boardSize)=>{
		let totalLength=(boardSize*boardSize);
		let newArray=[];
		let size=Math.floor((boardSize-1)/4)+8;
		for(let i=0;i<totalLength/size;i++){
			for(let j=0;j<size;j++){
				newArray.push(cardImagesArray[j]);
			}
		}
		return newArray;
	}

    const gameBoardCreation = (boardName,boardSize,boardWidth,boardHeight,marginLeft, marginTop,cardImagesArray) => {
      
	  cardImagesArray=this.createArrayOfImages(cardImagesArray,boardSize);
	  let gameBoard = document.getElementById(`${boardName}`);
      gameBoard.innerHTML = "";
      let cardImageWidth =(boardWidth - (marginLeft * boardSize + marginLeft)) / boardSize;
      let cardImageHeight =(boardHeight - (marginTop * boardSize + marginTop)) / boardSize;
	  utility.parameters.gameCards = [];
	  for(let k=0;k<7;k++){
		cardImagesArray=shuffleArray(cardImagesArray);
	  }
      for (let i = 0; i < boardSize; i++) {		
			for (let j = 0; j < boardSize; j++) {
			  let createImageCard = document.createElement("div");
			  createImageCard.classList.add("cardImageDesign");
			  let widthWithPadding = cardImageWidth - marginLeft * 2;
			  let heightWithPadding = cardImageHeight - marginTop * 2;	
			  createImageCard.style.width = widthWithPadding + "px";
			  createImageCard.style.height = heightWithPadding + "px";
			  createImageCard.style.padding = `${marginTop}px  ${marginLeft}px`;
			  createImageCard.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
			  if(boardName == "game-board"){
				 createImageCard.innerHTML = "<img class='thumbnailImage hide' src='images/logoOp.png'></div>";
				 createImageCard.innerHTML += `<img class="${cardImagesArray[(i*boardSize)+j]}" src=images/${cardImagesArray[(i*boardSize)+j]}.svg />`;
				 utility.parameters.gameCards.push(createImageCard);
			  }else{
			  createImageCard.innerHTML = "<img class='thumbnailImage  ' src='images/logoOp.png'></div>";
			  createImageCard.innerHTML += `<img class="${cardImagesArray[(i*boardSize)+j]} hide " src=images/${cardImagesArray[(i*boardSize)+j]}.svg />`;
			  }
			  gameBoard.appendChild(createImageCard);
			  console.log("pushed", utility.parameters.gameCards);
			  let cardImages = createImageCard.querySelectorAll("img");
			  cardImages.forEach(function (value) {
				value.style.height = heightWithPadding + "px";
				value.style.width = widthWithPadding + "px";
			  });
			}
			let newLineBreak = document.createElement("div");
			newLineBreak.style.clear = "both";
			gameBoard.appendChild(newLineBreak);		
       }  
      };
    this.openGameEndPopup = openGameEndPopup;
    this.closePopUp = closePopUp;
    this.resetSelectedLevelFields = resetSelectedLevelFields;
    this.openGameConfigurationPopup = openGameConfigurationPopup;
    this.gameBoardCreation = gameBoardCreation;
this.createArrayOfImages=createArrayOfImages;
  }
 /*----------------------InputFields-------------------------*/
  function ValidateInputFields() {
    this.isValid = {
      gameLevel: false,
      username: false,
    };
    const showError = (inputElement, errorMessage) => {
      let inputGroup = inputElement.parentElement;
      let setError = inputGroup.querySelector(".error-message");
      setError.innerHTML = errorMessage;
      setTimeout(function () { setError.style.display = "none"; }, 3000);
    };

    const validateGameLevels = (inputElement) => {
      if (inputElement.selectedIndex > 0 && inputElement.selectedIndex < 4) {
        this.isValid.gameLevel = true;
        gameEngine.configureGame(gameLevels);
      } else {
        this.isValid.gameLevel = false;
        this.showError(inputElement, "Please Select Game Level");
      }
    };

    const validateUsername = (inputElement) => {
      let elementValue = inputElement.value;
      let newInputValue = elementValue.replace(/[^a-zA-Z0-9@_]/g, "");
      if (!newInputValue.match(/^[a-zA-Z]/)) {
        newInputValue = "";
        this.showError(inputElement, "Username should start with an alphabet.");
        this.isValid.username = false;
      } else if (newInputValue.length > 6) {
        newInputValue = newInputValue.slice(0, -1);
        this.showError(inputElement,"Username should not exceed ,more than 6");
      } else {
        this.isValid.username = true;
        utility.parameters.username = inputElement.value;
        console.log("check username", utility.parameters.username);
      }
      inputElement.value = newInputValue;
    };

    this.validateUsername = validateUsername;
    this.validateGameLevels = validateGameLevels;
    this.showError = showError;
  }
 /*---------------------------------------------------*/

  function GameEngine() {
    this.cardFlipped = {
      firstCard: null,
      secondCard: null,
    };
	
	const timerFunction = (timeValue) => {
        utility.parameters.timerInterval = setInterval(function () {
            timeValue--;
            if (timeValue < 0) {
                //console.log("timeout");
                utility.openGameEndPopup("time", "Time limit exceeded",utility.parameters.score);
                clearInterval(utility.parameters.timerInterval);
            } else {
                utility.parameters.timerElement.innerHTML = timeValue;
            }
        }, 1000);
        return utility.parameters.timerInterval;
    }
    const gameLoad = () => {
      let self = this;
	  clearInterval(utility.parameters.timerInterval);

	  setTimeout(function(){
		  clearInterval(utility.parameters.timerInterval);
		  utility.parameters.timerInterval = gameEngine.timerFunction(utility.parameters.timer);
		  },5000);
      for (let card of utility.parameters.gameCards) {
        card.disabled = false;
        card.addEventListener("click", function flip() {
        if (!card.disabled) {
            if (self.cardFlipped.firstCard == null && self.cardFlipped.secondCard == null) {
              card.children[0].classList.add("hide");
              self.cardFlipped.firstCard = card;
              card.children[1].classList.remove("hide");
              utility.parameters.move++;
              utility.parameters.moveElement.innerHTML = utility.parameters.move;
              card.disabled = true;
              console.log("firstcard");
            } else if (self.cardFlipped.firstCard !== null && self.cardFlipped.secondCard == null) {
              card.children[0].classList.add("hide");
              self.cardFlipped.secondCard = card;
              card.children[1].classList.remove("hide");
              utility.parameters.move++;
              utility.parameters.moveElement.innerHTML =utility.parameters.move;
              card.disabled = true;
              //console.log("first card classnaem",self.cardFlipped.firstCard.children[1].className);
              //console.log("second card classnaem",self.cardFlipped.secondCard.children[1].className);
              if (self.cardFlipped.firstCard.children[1].src !==self.cardFlipped.secondCard.children[1].src) {
                utility.parameters.mistake++;
                utility.parameters.mistakeElement.innerHTML =utility.parameters.mistake;
                setTimeout(function () {
                  self.cardFlipped.firstCard.children[1].classList.add("hide");
                  self.cardFlipped.secondCard.children[1].classList.add("hide");
                  self.cardFlipped.firstCard.children[0].classList.remove("hide");
                  self.cardFlipped.secondCard.children[0].classList.remove("hide");
                  self.cardFlipped.firstCard.disabled = false;
                  self.cardFlipped.secondCard.disabled = false;
                  self.cardFlipped.firstCard = null;
                  self.cardFlipped.secondCard = null;
                  if (utility.parameters.score > 5) {
                    utility.parameters.score -= 5;
                  }
                }, 1000);
              } else {
                self.cardFlipped.firstCard.disabled = true;
                self.cardFlipped.secondCard.disabled = true;
                self.cardFlipped.firstCard = null;
                self.cardFlipped.secondCard = null;
                utility.parameters.score += 5;
                utility.parameters.gameScoreElement.innerHTML =utility.parameters.score;
                if (self.checkWin()) {
                  utility.openGameEndPopup("win", "Congradulations You completed the game!..",utility.parameters.score);
                }
              }
              if (utility.parameters.mistake === utility.parameters.totalMistakes) {
                console.log("loser");
                utility.openGameEndPopup("lose","Number of attempts limit exceeded",utility.parameters.score);
                utility.parameters.mistakeElement.innerHTML = 0;
                utility.parameters.mistake = 0;
                utility.parameters.score = 0;
                utility.parameters.gameScoreElement.innerHTML = 0;
              }
            }
          }
        });
      } //for loop end


    let countDown=utility.parameters.countDown;
    let count=utility.parameters.count;
    countDown.innerHTML=count;
    let countInterval=setInterval(function(){
              count--;
            countDown.innerHTML=count;
            console.log(count,countDown.value);
            if(count==0){
              clearInterval(countInterval);
            }
            },1000);
   
                    
    setTimeout(function(){
			for (let card of utility.parameters.gameCards) {
				  card.children[0].classList.remove('hide');
				  card.children[1].classList.add('hide');
			}
			utility.parameters.gameCountDown.style.display="none"
			},5000);
    }; //gameLoad function end

    const checkWin = () => {
      for (let card of utility.parameters.gameCards) {
        if (!card.children[0].classList.contains("hide")) {
          return false;
        }
      }
      return true;
    };

    const configureGame = (gameLevel) => {

	  const configLevel=utility.parameters.gameLevelConfiguration[gameLevel.value];
      if (configLevel) {
        utility.parameters.level =configLevel.level;
        utility.parameters.totalMistakes =configLevel.totalMistakes;
        utility.parameters.timer =configLevel.timer;
        utility.parameters.timeLimit.innerHTML = utility.parameters.timer;
        utility.parameters.mistakeLimit.innerHTML = utility.parameters.totalMistakes;
        utility.parameters.levelHeadText.innerHTML = configLevel.label;
        utility.parameters.levelHeadText.style.color = configLevel.color;
        utility.gameBoardCreation("gameDisplay-game-board",configLevel.level,380,380,5,5,utility.parameters.cardImagesArray);
      } 
	  
    };
    this.checkWin = checkWin;
    this.gameLoad = gameLoad;
    this.timerFunction = timerFunction;
    this.configureGame = configureGame;
  } //GameEngine End






