///< reference type="cypress"/>
import guessNum from "../pages/guessNumber.page"
import 'cypress-plugin-steps'


describe('guessNumberPage', () => {
  const getLocator = new guessNum().getLocators
  const getFlipCard = new guessNum().getFlipCardLocators

  beforeEach(() => {
    cy.section('main page').step('Navigate to the application URL')
    cy.visit('http://mapleqa.com:8070/js22/?randomParam=12')

  })


  it('[TS888-001]: Verify Initial Application State on Load', () => {
    cy.section('TS888-001: Verify Initial Application State on Load')
    cy.step('Verify the card front displays "Guess the card value" and "**"')
    getFlipCard.getCardContainer()
      .should('be.visible');

    getFlipCard.getFrontCardTitle()
      .should('be.visible')
      .should('contain', 'Guess the card value');

    getFlipCard.getFrontCardValue()
      .should('be.visible')
      .should('contain', '**');

    cy.step('Verify the input field `[data-testid="guessField"]` is empty, enabled, and has focus.')
    getLocator.getGuessField()
      .should('be.visible')
      .should('to.focus')
      .and('be.empty')
      .and('be.enabled');

    cy.step('Verify the `[data-testid="guessButton"]` button displays "GUESS" and is **disabled**')
    getLocator.getGuessResetButton()
      .should('be.disabled')
      .and('be.visible')
      .contains('GUESS');

    cy.step('Verify the `[data-testid="messageArea"]` is empty.')
    getLocator.getGuessErrormessage()
      .should('be.empty');

    cy.step('Verify the `[data-testid="guesses"]` container is empty.')
    getLocator.getGuessesBox()
      .should('be.visible');
    getLocator.getGuessBoxTitle()
      .should('be.visible').contains('guesses');

    cy.step('Verify the `[data-testid="showAttempts"]` attempts counter is in its initial state (e.g., " / 10").')
    getLocator.getAttemptsBox()
      .should('be.visible');
    getLocator.getAttemptsTitle()
      .should('be.visible')
      .contains('ATTEMPTS');
    getLocator.getAttemptsCount()
      .should('not.be.visible');

  });


  it('[TS888-002]: Verify "GUESS" Button Enables/Disables with Input', () => {
    cy.section('TS888-002: Verify "GUESS" Button Enables/Disables with Input')
    cy.step('Verify that "GUESS" button state is disabled')
    getLocator.getGuessResetButton()
      .should('be.disabled')
      .and('be.visible')
      .contains('GUESS');

    cy.step('Enter the value "1" into the input field.')
    getLocator.getGuessField()
      .type('1');

    cy.step('Verify the button becomes **enabled**.')
    getLocator.getGuessResetButton()
      .should('be.enabled');

    cy.step('Clear the input field.')
    getLocator.getGuessField()
      .type('{backspace}')
      .should('be.empty');

    cy.step('Verify the button becomes **disabled** again.')
    getLocator.getGuessResetButton()
      .should('be.disabled')
      .and('be.visible')
      .contains('GUESS');
  });


  it('[TS888-003]: Verify Correct Guess on First Attempt (Win Condition)', () => {
    cy.section('**TS888-003: Verify Correct Guess on First Attempt (Win Condition)**')
    cy.step('Enter the correct number `12`.')
    cy.step('Click the "GUESS" button.')

    const correctNum = 12
    cy.gameBegin(correctNum)

    cy.step('Verify the card flips (element `#card` has class `flipped`), revealing the number 12.')
    getFlipCard.getCardContainer()
      .should('have.class', 'flipped')
      .contains(correctNum);

    cy.step('Verify the message area displays: **"Congratulations! You guessed the number!"**.')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .and('contain.text', 'Congratulations! You guessed the number!');

    cy.step('Verify the "GUESS" button is replaced with a "RESET" button.')
    getLocator.getGuessResetButton()
      .should('be.visible')
      .and('have.text', 'RESET')
      .and('be.enabled');

    cy.step('Verify the guess `12` appears in the previous guesses area with a special `.guessed` class.')
    getLocator.getGuessesBox()
      .should('be.visible');

    getLocator.getGuessesList()
      .find('span.boxed.guessed')
      .contains(correctNum);

    cy.step('Verify the input field is disabled.')
    getLocator.getGuessField()
      .should('be.disabled');

    cy.step('Verify the guess is added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .should('have.length', '1');

    getLocator.getGuessesList()
      .children()
      .eq(0)
      .should('have.text', '12');

    cy.step('Verify the attempts counter increments (e.g., to "1 / 10").')
    cy.get('.rotateAttempt').should('contain', 1);
  });


  it('[TS888-004]: Verify "My number is larger" Feedback (Too Low)', () => {
    cy.section('TS888-004: Verify "My number is larger" Feedback (Too Low)')
    cy.step('Enter a valid number less than 12 (e.g., `5`).')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin(5);

    cy.step('Verify the message area displays: **"My number is larger.\n Try Again!"**')
    getLocator.getGuessErrormessage()
      .should('have.text', 'My number is larger. Try Again!')
      .should('be.visible');

    cy.step('Verify the input field is cleared and retains focus.')
    getLocator.getGuessField()
      .should('be.empty')
      .focus();

    cy.step('Verify the guess is added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .should('have.length', '1');

    getLocator.getGuessesList()
      .children()
      .eq(0)
      .should('have.text', '5');

    cy.step('Verify the attempts counter increments (e.g., to "1 / 10").')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 1);
  });


  it('[TS888-005]: Verify "My number is smaller" Feedback (Too High)', () => {
    cy.section('TS888-005: Verify "My number is smaller" Feedback (Too High)')
    cy.step('Enter a valid number greater than 12 (e.g., `20`).')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin(20);

    cy.step('Verify the message area displays: **"My number is smaller.\n Try Again!"**.')
    getLocator.getGuessErrormessage()
      .should('have.text', 'My number is smaller. Try Again!');

    cy.step('Verify the input field is cleared and retains focus.')
    getLocator.getGuessField()
      .should('be.empty').focus();

    cy.step('Verify the guess is added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .should('have.length', '1');

    getLocator.getGuessesList()
      .children()
      .eq(0)
      .should('have.text', '20');

    cy.step('Verify the attempts counter increments (e.g., to "1 / 10").')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 1);
  });


  it('[TS888-006]: Validate Input Boundary (Lower): Number 1', () => {
    cy.section('TS888-006: Validate Input Boundary (Lower): Number 1')
    cy.step('Enter the value `1`')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin(1);

    cy.step(' Verify the input is processed as a valid guess (no error message).')
    getLocator.getGuessErrormessage()
      .should('not.have.text', 'ERROR');

    cy.step('Verify the attempts counter increments.')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 1);
  });


  it('[TS888-007]: Validate Input Boundary (Upper): Number 50', () => {
    cy.section('TS888-007: Validate Input Boundary (Upper): Number 50')
    cy.step('Enter the value `50`.')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin(50);

    cy.step('Verify the input is processed as a valid guess (no error message).')
    getLocator.getGuessErrormessage()
      .should('not.have.text', 'ERROR');

    cy.step('Verify the attempts counter increments.')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 1);
  })


  it('[TS888-008]: Verify Error for Out-of-Range Input (Low: 0)', () => {
    cy.section('TS888-008: Verify Error for Out-of-Range Input (Low: 0)')
    cy.step(' Enter the value `0`.')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin(0);

    cy.step('Verify the message area displays: **"ERROR:\nInput should be between 1 & 50"**.')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .and('have.text', 'ERROR:Input should be between 1 & 50')
    cy.step('Verify the attempts counter does **not** increment.')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 0);

    cy.step('Verify the guess is **not** added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .should('not.exist');
  })


  it('[TS888-009]: Verify Error for Out-of-Range Input (High: 51)', () => {
    cy.section('TS888-009: Verify Error for Out-of-Range Input (High: 51)')
    cy.step(' Enter the value `51`.')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin(51);

    cy.step('Verify the message area displays: **"ERROR:\nInput should be between 1 & 50"**.')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .and('have.text', 'ERROR:Input should be between 1 & 50');

    cy.step('Verify the attempts counter does **not** increment.')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 0);

    cy.step('Verify the guess is **not** added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .should('not.exist');
  });


  it('[TS888-010]: Verify Error for Negative Input', () => {
    cy.section('TS888-010: Verify Error for Negative Input')
    cy.step('Enter a negative value (e.g., `-5`).')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin(-5);

    cy.step('Verify the message area displays: **"ERROR:\nInput should be between 1 & 50"**.')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .and('have.text', 'ERROR:Input should be between 1 & 50');

    cy.step('Verify the attempts counter does **not** increment.')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 0);

    cy.step('Verify the guess is **not** added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .should('not.exist');
  });


  it('[TS888-011]: Verify Error for Non-Numeric Input', () => {
    cy.section('TS888-011: Verify Error for Non-Numeric Input')
    cy.step('Enter a non-numeric value (e.g., `abc`)')
    cy.step('Click the "GUESS" button.')
    cy.gameBegin('ab');

    cy.step('Verify the application displays an error.')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .and('have.text', 'ERROR:Input should be between 1 & 50');

    cy.step('Verify the attempts counter does **not** increment.')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 0);

    cy.step('Verify the guess is **not** added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .should('not.exist');
  });


  it('[TS888-012]: Verify Game Over After 10 Incorrect Attempts (Lose Condition)', () => {
    const inputGuesses = [1, 2, 3, 50, 40, 39, 15, 14, 9, 11]

    cy.section('TS888-012: Verify Game Over After 10 Incorrect Attempts (Lose Condition)')
    cy.step('Enter 10 incorrect guesses (e.g., numbers that are not 12)')

    for (let i = 0; i < inputGuesses.length; i++) {
      const guess = inputGuesses[i];
      let attemptsCount = i;

      cy.gameBegin(guess);
      attemptsCount++;

      // Verify the attempts counter increments with each loop
      cy.get('.rotateAttempt').should('contain', attemptsCount);
    }

    cy.step('Verify on the 10th attempt, the card flips, revealing the secret number (12).')
    getFlipCard.getCardContainer()
      .should('have.class', 'flipped')
      .contains(12);

    cy.step('Verify the message area displays: "Game Over! Youve used all your attempts."')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .should('contain', "Game Over! You've used all your attempts.");

    cy.step('Verify the "GUESS" button is replaced with a "RESET" button.')
    getLocator.getGuessResetButton()
      .should('be.visible')
      .and('have.text', 'RESET')
      .and('be.enabled');

    cy.step('Verify the input field is disabled.')
    getLocator.getGuessField()
      .should('be.disabled');

    cy.step('Verify the attempts counter shows "10 / 10".')
    getLocator.getAttemptsCount().should('have.text', '10 / 10');
  });


  it('[TS888-013]: Verify "RESET" Button Functionality After Win', () => {
    cy.section('TS888-013: Verify "RESET" Button Functionality After Win')
    cy.step('Complete a winning game (e.g., guess `12`).')
    cy.gameBegin(12);

    cy.step('Click the `[data-testid="reset"]` button.')
    getLocator.getGuessResetButton()
      .should('be.visible')
      .and('have.text', 'RESET')
      .and('be.enabled')
      .click();

    cy.step('Verify the page reloads and returns to the initial state described in TS888-001.')
    getFlipCard.getCardContainer()
      .should('be.visible');

    getFlipCard.getFrontCardTitle()
      .should('be.visible')
      .should('contain', 'Guess the card value');

    getFlipCard.getFrontCardValue()
      .should('be.visible')
      .should('contain', '**');

    getLocator.getGuessField()
      .should('be.visible')
      .should('to.focus')
      .and('be.empty')
      .and('be.enabled');

    getLocator.getGuessResetButton()
      .should('be.disabled')
      .and('be.visible')
      .contains('GUESS');

    getLocator.getGuessErrormessage()
      .should('be.empty');

    getLocator.getGuessesBox()
      .should('be.visible');
    getLocator.getGuessBoxTitle()
      .should('be.visible').contains('guesses');

    getLocator.getAttemptsBox()
      .should('be.visible');
    getLocator.getAttemptsTitle()
      .should('be.visible')
      .contains('ATTEMPTS');
    getLocator.getAttemptsCount()
      .should('not.be.visible');
  });


  it('[TS888-014]: Verify "RESET" Button Functionality After Loss (via enter key)', () => {
    cy.section('TS888-014: Verify "RESET" Button Functionality After Loss')
    cy.step('Complete a losing game (e.g., 10 wrong guesses).')
    const inputGuesses = [50, 39, 11, 4, 29, 20, 15, 1, 8, 10]

    for (let i = 0; i < inputGuesses.length; i++) {
      const guess = inputGuesses[i];
      let attemptsCount = i;

      cy.gameBegin(guess);

      attemptsCount++;

      // Verify the attempts counter increments with each loop
      cy.get('.rotateAttempt').should('contain', attemptsCount);
    }

    cy.step('Verify on the 10th attempt, the card flips, revealing the secret number (12).')
    getFlipCard.getCardContainer()
      .should('have.class', 'flipped')
      .contains(12);

    cy.step('Verify the message area displays: "Game Over! Youve used all your attempts."')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .should('contain', "Game Over! You've used all your attempts.");

    cy.step('Verify the "GUESS" button is replaced with a "RESET" button.')
    getLocator.getGuessResetButton()
      .should('be.visible')
      .and('have.text', 'RESET')
      .and('be.enabled');

    cy.step('Verify the input field is disabled.')
    getLocator.getGuessField()
      .should('be.disabled');

    cy.step('Verify the attempts counter shows "10 / 10".')
    getLocator.getAttemptsCount().should('have.text', '10 / 10');

    cy.step('Press enter key to reset the game.')
    getLocator.getGuessResetButton().type('{enter}');

    cy.step('Verify the page reloads and returns to the initial state described in TS888-001.')
    getFlipCard.getCardContainer()
      .should('be.visible');

    getFlipCard.getFrontCardTitle()
      .should('be.visible')
      .should('contain', 'Guess the card value');

    getFlipCard.getFrontCardValue()
      .should('be.visible')
      .should('contain', '**');

    getLocator.getGuessField()
      .should('be.visible')
      .should('to.focus')
      .and('be.empty')
      .and('be.enabled');

    getLocator.getGuessResetButton()
      .should('be.disabled')
      .and('be.visible')
      .contains('GUESS');

    getLocator.getGuessErrormessage()
      .should('be.empty');

    getLocator.getGuessesBox()
      .should('be.visible');
    getLocator.getGuessBoxTitle()
      .should('be.visible').contains('guesses');

    getLocator.getAttemptsBox()
      .should('be.visible');
    getLocator.getAttemptsTitle()
      .should('be.visible')
      .contains('ATTEMPTS');
    getLocator.getAttemptsCount()
      .should('not.be.visible');
  });


  it('[TS888-015]: Verify Attempts Counter Increments Only on Valid Guesses', () => {
    cy.section('TS888-015: Verify Attempts Counter Increments Only on Valid Guesses')
    cy.step(' Enter `0` (invalid). Click "GUESS".')
    cy.gameBegin(0);

    cy.step('Verify attempts counter remains unchanged from initial state (e.g., " / 10").')
    cy.get('.rotateAttempt').should('contain', 0);

    cy.step('Enter `60` (invalid). Click "GUESS".')
    cy.gameBegin(60);

    cy.step('Verify the attempts counter does **not** increment.')
    cy.get('.rotateAttempt').should('contain', 0);

    cy.step('Enter `5` (valid). Click "GUESS".')
    cy.step('Verify attempts counter now reads "1 / 10".')
    cy.step('Enter `30` (valid). Click "GUESS".')
    cy.step('Verify attempts counter now reads "2 / 10".')
    cy.step('Enter `12` (valid). Click "GUESS".')
    cy.step('Verify attempts counter now reads "3 / 10".')

    const validInput = [5, 30, 12]

    for (let i = 0; i < validInput.length; i++) {
      let attemptsCount = i;

      cy.gameBegin(validInput[i]);

      cy.step('Verify the guess was added to the history list')
      getLocator.getGuessesList()
        .children().eq(i).should('have.text', String(validInput[i]))

      attemptsCount++;
      // Verify the attempts counter increments with each loop
      cy.get('.rotateAttempt').should('contain', attemptsCount);
      getLocator.getGuessesList()
        .children()
        .should('have.length', attemptsCount);

    }

  });


  it('[TS888-016]: Verify Sequential Guesses with Mixed Feedback', () => {
    cy.section('TS888-016: Verify Sequential Guesses with Mixed Feedback')
    cy.step(' Guess `5`.')
    cy.gameBegin(5);
    cy.step('Verify message is "My number is larger.\n Try Again!".')
    getLocator.getGuessErrormessage()
      .should('have.text', 'My number is larger. Try Again!');
    cy.step('Verify the input field is cleared and retains focus.')
    getLocator.getGuessField()
      .should('be.empty').focus();

    cy.step('Guess `20`.')
    cy.gameBegin(20);
    cy.step('Verify message is "My number is larger.\n Try Again!".')
    getLocator.getGuessErrormessage()
      .should('have.text', 'My number is smaller. Try Again!');
    cy.step('Verify the input field is cleared and retains focus.')
    getLocator.getGuessField()
      .should('be.empty')
      .focus();

    cy.step('Guess `12`.')
    cy.gameBegin(12);
    cy.step(' Verify message is "Congratulations! You guessed the number!".')
    getLocator.getGuessErrormessage()
      .should('be.visible')
      .and('contain.text', 'Congratulations! You guessed the number!');

    cy.step('Verify previous guesses list contains `5`, `20`, and `12` in that order.')
    getLocator.getGuessesList()
      .children()
      .should('have.length', '3');

    getLocator.getGuessesList()
      .children()
      .eq(0)
      .should('have.text', '5');

    getLocator.getGuessesList()
      .children()
      .eq(1)
      .should('have.text', '20');

    getLocator.getGuessesList()
      .children()
      .eq(2)
      .should('have.text', '12');


    cy.step('Verify final attempts counter is `3 / 10`.')
    getLocator.getAttemptsCount().should('have.text', '3 / 10');
  });


  it('[TS888-017]: Verify Input via Keyboard "Enter" Key', () => {
    cy.section('TS888-017: Verify Input via Keyboard "Enter" Key')
    cy.step('Enter a value (e.g., `10`) into the input field. Press `Enter` key')
    getLocator.getGuessField()
      .type('1')
      .type('{enter}');

    cy.step('Verify the guess is submitted and feedback is provided, identical to clicking the "GUESS" button.')
    getLocator.getGuessErrormessage()
      .should('have.text', 'My number is larger. Try Again!')
      .should('be.visible');

    //cy.step('Verify the input field is cleared and retains focus.')
    getLocator.getGuessField()
      .should('be.empty')
      .focus();

    //cy.step('Verify the guess is added to the previous guesses list.')
    getLocator.getGuessesList()
      .children()
      .eq(0)
      .should('have.text', '1');

    // cy.step('Verify the attempts counter increments (e.g., to "1 / 10").')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt')
      .should('contain', 1);
  });


  it('[TS888-018]: Verify Previous Guesses Styling and Order', () => {
    cy.section('TS888-018: Verify Previous Guesses Styling and Order')
    cy.step('Make guesses in this order: `25`, `10`, `12`.')
    //input guess 25
    cy.gameBegin(25);

    cy.step('Verify the guess 25 was added to the history list')
    cy.get('#guesses span')
      .should('have.length', 1);

    cy.step(' Verify guesses `25` and `10` have only the class `.boxed`.')
    cy.get('#guesses span').eq(0)
      .should('have.text', '25')
      .and('have.class', 'boxed')
      .and('not.have.class', 'guessed');

    // input guess 10
    cy.gameBegin(10);

    cy.step('Verify the guess 10 was added to the history list')
    cy.get('#guesses span')
      .should('have.length', 2);

    cy.step(' Verify guesses `25` and `10` have only the class `.boxed`.')
    cy.get('#guesses span')
      .eq(1)
      .should('have.text', '10')
      .and('have.class', 'boxed')
      .and('not.have.class', 'guessed');

    // input guess 12
    cy.gameBegin(12);

    cy.step('Verify the guess 12 was added to the history list')
    cy.get('#guesses span')
      .should('have.length', 3);

    cy.step(' Verify guesses `25` and `10` have only the class `.boxed`.')
    cy.get('#guesses span')
      .eq(2)
      .should('have.text', '12')
      .and('have.class', 'boxed')
      .and('have.class', 'guessed');

    cy.step('Verify the guess was added to the history list')
    cy.step(' Verify the `#guesses` container displays the guesses in the order: `25`, `10`, `12`.')
    getLocator.getGuessesList()
      .children()
      .should('have.length', '3');

    getLocator.getGuessesList()
      .children()
      .eq(0)
      .should('have.text', '25');

    getLocator.getGuessesList()
      .children()
      .eq(1)
      .should('have.text', '10');

    getLocator.getGuessesList()
      .children()
      .eq(2)
      .should('have.text', '12');
  });


  it('[TS888-019]: Verify Mixed Out-of-Range and Valid Attempts Count', () => {
    cy.section('TS888-019: Verify Mixed Out-of-Range and Valid Attempts Count')
    cy.step('Enter `0` (invalid).')
    cy.gameBegin(0);
    cy.step('Expect error message.')
    getLocator.getGuessErrormessage()
      .should('have.text', 'ERROR:Input should be between 1 & 50')
      .should('be.visible');

    cy.step('Verify attempts counter still = initial state (e.g., " / 10") (invalid inputs should not count).')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt').should('contain', 0);

    cy.step('Enter `60` (invalid).')
    cy.gameBegin(60);
    cy.step('Expect error message.')
    getLocator.getGuessErrormessage()
      .should('have.text', 'ERROR:Input should be between 1 & 50')
      .should('be.visible');

    cy.step('Same expectation. Counter should remain unchanged.')
    getLocator.getAttemptsCount()
      .find('span.rotateAttempt').should('contain', 0);

    cy.step('Enter `5` (valid), `30` (valid), `12` (valid).');
    cy.step('Attempts counter increments only for these valid guesses → should read **"3 / 10"**.')
    const inputData = [5, 30, 12]

    inputData.forEach((input, index) => {
      let attemptsCount = index;

      cy.gameBegin(input);

      attemptsCount++;
      // Verify the attempts counter increments with each loop
      cy.get('.rotateAttempt').should('contain', attemptsCount);
      getLocator.getGuessesList()
        .children()
        .should('have.length', attemptsCount);

    })
  });


  it('[TS888-020]: Verify guess field is focused if mouse is use', () => {
    cy.section('TS888-020: Verify guess field is focused if mouse is use');
    cy.step('Click the guess field with the mouse.');
    cy.step('Verify that the guess field is focused.');
    getLocator.getGuessField().click().should('be.focused');
  });

});
