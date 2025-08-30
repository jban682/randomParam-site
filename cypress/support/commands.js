// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import guessNum from "../e2e/pages/guessNumber.page"

const getLocator = new guessNum().getLocators

Cypress.Commands.add('gameBegin', (inputValue) => {
  //cy.step('Enter the a number.')
  getLocator.getGuessField()
    .type(inputValue);

  //cy.step('Click the "GUESS" button.')
  getLocator.getGuessResetButton()
    .click();
});


