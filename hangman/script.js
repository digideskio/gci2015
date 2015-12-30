$(document).ready(function () {  
  var letters = {
    alphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
        't', 'u', 'v', 'w', 'x', 'y', 'z'],
    populate: populate,
    turnUsed: turnUsed,
    reset: resetLetters
  }
  
  function populate () {
    var lettersForGuessing = $('.lettersForGuessing');
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    for(var i = 0; i < this.alphabet.length; i++) {
      if(vowels.indexOf(this.alphabet[i]) != -1) {
        lettersForGuessing.append("<span id='"+this.alphabet[i]+"' class='letter used'>"+this.alphabet[i].toUpperCase()+"</span>");
      } else {
        lettersForGuessing.append("<span id='"+this.alphabet[i]+"' class='letter'>"+this.alphabet[i].toUpperCase()+"</span>");
      }
    }
    
  }
  
  function turnUsed (letter) {
    var index = this.alphabet.indexOf(letter);
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    $(".letter:eq("+index+")").addClass('used');
  }
  
  function resetLetters () {
    var letters = $('.letter');
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    for(var i = 0; i < this.alphabet.length; i++) {
      if(vowels.indexOf(this.alphabet[i]) != -1) {
        letters.removeClass('used');
      }
    }
  }
  
  
  var word = {
    word: "",
    wordArray: [],
    guessesLeft: 5,
    get: getWord,
    generate: generateWord,
    fill: fillWord,
    guess: guessWord,
    reset: resetWord
  };
  
  var availableWords = {
    "animals": ["bear", "lion", "kangaroo", "tiger", "frog"],
    "chores": ["taking out the trash", "washing the dishes", "vacuuming", "tending the garden", "dusting"],
    "countries": ["india", "china", "taiwan", "france", "germany"],
    "sports": ["hockey", "basketball", "football", "baseball", "tennis"],
    "companies": ["microsoft", "google", "apple", "intel", "lenovo"]
  };
  function getWord (category, number) {
    return availableWords[category][number];
  }
  
  function generateWord (category) {
    i = Math.ceil(Math.random()*availableWords[category].length-1);
    generatedWord = this.get(category, i);
    var wordArray = [];
    for(var i = 0; i < generatedWord.length; i++) {
        wordArray.push(generatedWord.charAt(i));
    }
    this.word = generatedWord;
    this.wordArray = wordArray;
    this.fill(); //we can tell it to fill since generate and fill usually take place @ same time
  }

  function fillWord () {
    wordArray = this.wordArray;
    var wordDiv = $('.word');
    var vowels = ['a', 'e', 'i', 'o', 'u'];
    for(var i = 0; i < wordArray.length; i++) {
      if(vowels.indexOf(wordArray[i]) != -1) {
        wordDiv.append("<span class='letterInWord'>"+wordArray[i].toUpperCase()+"</span>");
        wordArray[i] = "+"; //to signify it has been replaced
      } else {
        wordDiv.append("<span class='letterInWord'>_</span>");
      }
    }
    this.wordArray = wordArray;
  }
  
  function guessWord (letter) {
    var index, isValidGuess;
    var wordArray = this.wordArray;
    //for multiple matches
    while(wordArray.indexOf(letter) != -1) {
      index = wordArray.indexOf(letter);
      $(".letterInWord:eq("+index+")").html(wordArray[index].toUpperCase());
      wordArray[index] = "+"; //to signify it has been guessed
      isValidGuess = true;
    }
    if (wordArray.allValuesSame()) {
      this.guessesLeft = 0;
      $('.word').html("Congratulations! You guessed the right word, "+this.word+". To play again, please select a new category.");
    }
    this.wordArray = wordArray;
    if(isValidGuess) return true;
    var guessedBefore = $("#"+letter).hasClass("used");
    if(!guessedBefore) this.guessesLeft -= 1;
    if(!this.guessesLeft) {
      $('.word').html("Game over! The word was <strong>"+this.word.toUpperCase()+"</strong>. To play again, please select a new category.");
    }
    return false;
  }
  
  function resetWord () {
    this.word = "";
    this.wordArray = [];
    this.guessesLeft = 5;
    $('.word').html('');
    letters.reset();
  }
  
  /***
  Initialization and Events
  ***/
  
  $('.playCircle').on("click", function () {
    $('.introOverlay').css("top", "100%");
  });
  
  
  letters.populate();
  $('.letter').on("click", function () {
    if(word.guessesLeft) {
      var id = $(this).attr('id');
      word.guess(id);
      letters.turnUsed(id);
    }
  });
  
  word.generate($('#chooseCategory option:selected').val());
  $('#chooseCategory').on("change", function () {
    word.reset();
    word.generate($('#chooseCategory option:selected').val());
  });
  

});