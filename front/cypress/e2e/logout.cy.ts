/// <reference types="cypress" />

describe('Logout', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.login('yoga@studio.com', 'test!1234');
  });

  it('should logout successfully', () => {
    cy.contains('Logout').click();
    cy.contains('Login').should('be.visible');
  });
});
