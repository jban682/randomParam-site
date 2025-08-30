export default class guessNum{
    getLocators = {
        getGuessField: () => cy.get('#guessField'),
        getGuessResetButton: () => cy.get('#guessButton button'),
        getGuessesBox: () => cy.get('#prevGuesses'),
        getGuessesList:() => cy.get('#guesses'),
        getGuessBoxTitle: () => cy.get('#misc .miscTitle'),
        getAttemptsBox: () => cy.get('#attempts'),
        getAttemptsTitle: () => cy.get('#misc #attempts'),
        getAttemptsCount: () => cy.get('#showAttempts'),
        getGuessErrormessage: () => cy.get('#messageArea')
    }

    getFlipCardLocators = {
        getCardContainer: () => cy.get('#card'),
        getFrontCardTitle: () => cy.get('#frontCardTitle'),
        getFrontCardValue: () => cy.get('#frontCardValue')
    }   
}
