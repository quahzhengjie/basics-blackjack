var makeDeck = function () {
  // create the empty deck at the beginning
  var deck = [];

  var suits = ["hearts", "diamonds", "clubs", "spades"];

  var suitIndex = 0;
  while (suitIndex < suits.length) {
    // make a variable of the current suit
    var currentSuit = suits[suitIndex];

    // loop to create all cards in this suit
    // rank 1-13
    var rankCounter = 1;
    while (rankCounter <= 13) {
      var cardName = rankCounter;

      // 1, 11, 12 ,13
      if (cardName == 1) {
        cardName = "ace";
      } else if (cardName == 11) {
        cardName = "jack";
      } else if (cardName == 12) {
        cardName = "queen";
      } else if (cardName == 13) {
        cardName = "king";
      }

      // make a single card object variable
      var card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
      };

      // add the card to the deck
      deck.push(card);

      rankCounter = rankCounter + 1;
    }
    suitIndex = suitIndex + 1;
  }

  return deck;
};

var getRandomIndex = function (size) {
  return Math.floor(Math.random() * size);
};

var shuffleCards = function (cards) {
  var index = 0;

  while (index < cards.length) {
    var randomIndex = getRandomIndex(cards.length);

    var currentItem = cards[index];

    var randomItem = cards[randomIndex];

    cards[index] = randomItem;
    cards[randomIndex] = currentItem;

    index = index + 1;
  }

  return cards;
};

var deck = shuffleCards(makeDeck());

/* ========== Everything above this line is helper methods taken from Module 10.3 ========== */
// I have removed console.logs in the starter code to remove noise in console

// The maximum valid sum in Blackjack is 21.
var sumLimit = 21;
// Dealer always hits until she reaches a sum greater than 16.
var dealerHitThreshold = 16;
// If player has chosen to stand, then player can no longer hit until game is over
var playerHasChosenToStand = false;
// Keep track of when the game ends to prevent further moves
var gameOver = false;

// Store player's cards and computer's cards in separate arrays
var playerHand = [];
var computerHand = [];

// Deal a card to the given hand
var dealCardToHand = function (hand) {
  hand.push(deck.pop());
};

// Get sum of cards in hand
var getHandSum = function (hand) {
  var numAcesInHand = 0;
  var sum = 0;
  for (let i = 0; i < hand.length; i += 1) {
    var currCard = hand[i];
    // If card rank is 2-10, value is same as rank
    if (currCard.rank >= 2 && currCard.rank <= 10) {
      sum += currCard.rank;
      // If card rank is 11-13, i.e. Jack, Queen, or King, value is 10
    } else if (currCard.rank >= 11 && currCard.rank <= 13) {
      sum += 10;
      // If card is Ace, value is 11 by default
    } else if (currCard.rank === 1) {
      numAcesInHand += 1;
      sum += 11;
    }
  }
  // If sum is greater than sum limit and hand contains Aces, convert Aces from value of 11
  // to value of 1, until sum is less than or equal to sum limit or there are no more Aces.
  if (sum > sumLimit && numAcesInHand > 0) {
    for (let i = 0; i < numAcesInHand; i += 1) {
      sum -= 10;
      // If the sum is less than sumLimit before converting all Ace values from
      // 11 to 1, break out of the loop and return the current sum.
      if (sum <= sumLimit) {
        break;
      }
    }
  }
  return sum;
};

// Return whether the hand contains a Blackjack combination
var isBlackjack = function (hand) {
  return hand.length === 2 && getHandSum(hand) === sumLimit;
};

// Convert hand to a string where objects within the array are stringified
var convertHandToString = function (hand) {
  // The map function takes a function F as input, and returns a new array A_new after applying
  // F to each element e_orig in the original array A_orig. F takes e_orig as input and F's
  // return value is e_new, the element at the same index as e_orig in A_new.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
  // Arrow function syntax (i.e. "=>") is a shorthand function syntax in JS.
  // The equivalent function in traditional function syntax would be:
  // function (card) {
  //   return card.name;
  // }
  return `[${hand.map((card) => card.name)}]`;
};

var getDefaultOutput = function () {
  return `Player has hand ${convertHandToString(
    playerHand
  )} with sum ${getHandSum(playerHand)}. <br>
    Computer has hand ${convertHandToString(
      computerHand
    )} with sum ${getHandSum(computerHand)}.`;
};

var main = function (input) {
  if (gameOver) {
    return "The game is over. Please refresh to play again.";
  }

  // If initial hands have not been dealt, deal initial hands
  if (playerHand.length === 0) {
    // User clicks submit button to deal cards.
    // Deal first card for player then computer
    dealCardToHand(playerHand);
    dealCardToHand(computerHand);

    // Deal second card for player then computer
    dealCardToHand(playerHand);
    dealCardToHand(computerHand);

    // The cards are analyzed for any game winning conditions. (Blackjack)
    // If computer has Blackjack, computer auto wins because computer is dealer
    if (isBlackjack(computerHand)) {
      gameOver = true;
      // Computer wins, return
      return `${getDefaultOutput()} <br>
        Computer has Blackjack and wins. Please refresh to play again.`;
    }

    // If player has Blackjack and computer does not, player wins
    if (isBlackjack(playerHand)) {
      gameOver = true;
      // Player wins, return
      return `${getDefaultOutput()} <br>
        Player has Blackjack and wins. Please refresh to play again.`;
    }

    // The cards are displayed to the user.
    return `${getDefaultOutput()} <br>
      Please enter "hit" or "stand", then press Submit`;
  }

  // Then begins a new action, where the user has to decide something: do they hit or stand.
  if (!playerHasChosenToStand) {
    // If user input is neither "hit" nor "stand" prompt user
    if (input !== "hit" && input !== "stand") {
      return 'Please input either "hit" or "stand" as possible moves in Blackjack';
    }

    if (input === "hit") {
      dealCardToHand(playerHand);
      // If bust, show player that she busts
      if (getHandSum(playerHand) > sumLimit) {
        gameOver = true;
        return `${getDefaultOutput()} <br>
          Player has busted and loses. Please refresh to play again.`;
      }
    }

    if (input === "stand") {
      playerHasChosenToStand = true;
    }
  }

  // The computer also decides to hit or stand.
  // Computer hits if sum less than or equal to dealer hit threshold
  // Otherwise, computer stays
  var computerHandSum = getHandSum(computerHand);
  if (computerHandSum <= dealerHitThreshold) {
    dealCardToHand(computerHand);
    // Update computer hand sum after dealing new card
    computerHandSum = getHandSum(computerHand);
    // If bust, show computer that she busts
    if (computerHandSum > sumLimit) {
      gameOver = true;
      return `${getDefaultOutput()} <br>
      Computer has busted and loses. Please refresh to play again.`;
    }
  }

  // If player and computer have both not busted and chosen to stand, decide who wins
  if (playerHasChosenToStand && computerHandSum > dealerHitThreshold) {
    // The game is always over after this point
    gameOver = true;
    // If player hand sum is greater than computer hand sum, player wins!
    if (getHandSum(playerHand) > computerHandSum) {
      return `${getDefaultOutput()} <br>
        Player wins! Please refresh to play again.`;
    }
    // Else, computer wins
    return `${getDefaultOutput()} <br>
      Computer wins! Please refresh to play again.`;
  }

  // If game is not yet over, show current game status
  return `${getDefaultOutput()} <br>
    playerHasChosenToStand is ${playerHasChosenToStand} <br>
    If player has not yet chosen to stand, please enter "hit" or "stand". <br>
    Else, press Submit to see Computer's next move.`;
};
