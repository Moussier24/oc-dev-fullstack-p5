/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(
        email: string,
        password: string,
        isAdmin?: boolean
      ): Chainable<void>;
      fillSessionForm(sessionData: {
        name: string;
        date: string;
        teacher_id: number;
        description: string;
      }): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  'login',
  (email: string, password: string, isAdmin: boolean = true) => {
    // Interception de la requête de connexion
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        type: 'Bearer',
        id: 1,
        username: 'yoga@studio.com',
        firstName: 'Admin',
        lastName: 'Admin',
        admin: isAdmin,
      },
    }).as('loginRequest');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      [
        {
          id: 1,
          name: 'Cours gratuit',
          date: '2024-12-22T00:00:00.000+00:00',
          teacher_id: 1,
          description: 'Test desc1',
          users: [],
          createdAt: '2024-11-27T20:09:34',
          updatedAt: '2024-11-27T20:09:34',
        },
      ]
    ).as('getSessions');

    cy.visit('/login');

    cy.get('input[formControlName="email"]').should('be.visible').type(email);
    cy.get('input[formControlName="password"]')
      .should('be.visible')
      .type(password);
    cy.get('button[type="submit"]').should('be.visible').click();
    cy.url().should('include', '/sessions');
  }
);
Cypress.Commands.add('fillSessionForm', (sessionData) => {
  cy.get('input[formControlName="name"]').type(sessionData.name);
  cy.get('input[formControlName="date"]').type(sessionData.date);
  cy.get('mat-select[formControlName="teacher_id"]').click();
  cy.get('mat-option').first().click();
  cy.get('textarea[formControlName="description"]').type(
    sessionData.description
  );
});
