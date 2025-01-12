/// <reference types="cypress" />

describe('Account', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.login('yoga@studio.com', 'test!1234');
  });

  it('should display user information correctly', () => {
    cy.intercept('GET', '/api/user/*', {
      statusCode: 200,
      body: {
        id: 1,
        lastName: 'Test Lastname',
        firstName: 'Test Firstname',
        admin: true,
        createdAt: '2024-11-15T11:05:38',
        updatedAt: '2024-11-15T11:05:38',
        email: 'yoga@studio.com',
      },
    }).as('getUser');

    cy.contains('Account').click();
    cy.wait('@getUser');

    cy.contains('User information').should('be.visible');
    cy.contains('Name: Test Firstname TEST LASTNAME').should('be.visible');
    cy.contains('Email: yoga@studio.com').should('be.visible');
    cy.contains('You are admin').should('be.visible');
    cy.contains('Create at: November 15, 2024').should('be.visible');
    cy.contains('Last update: November 15, 2024').should('be.visible');
  });

  it('should navigate back when clicking back button', () => {
    cy.intercept('GET', '/api/user/*', {
      statusCode: 200,
      body: {
        id: 1,
        lastName: 'Test Lastname',
        firstName: 'Test Firstname',
        admin: true,
        createdAt: '2024-11-15T11:05:38',
        updatedAt: '2024-11-15T11:05:38',
        email: 'yoga@studio.com',
      },
    }).as('getUser');

    cy.contains('Account').click();
    cy.wait('@getUser');

    cy.get('button[mat-icon-button]').click();
    cy.url().should('include', '/sessions');
  });

  it('should show delete button for non-admin users', () => {
    cy.intercept('GET', '/api/user/*', {
      statusCode: 200,
      body: {
        id: 1,
        lastName: 'Test Lastname',
        firstName: 'Test Firstname',
        admin: false,
        createdAt: '2024-11-15T11:05:38',
        updatedAt: '2024-11-15T11:05:38',
        email: 'user@test.com',
      },
    }).as('getUser');

    cy.contains('Account').click();
    cy.wait('@getUser');

    cy.contains('Detail').should('be.visible');
  });

  it('should delete account successfully', () => {
    cy.intercept('GET', '/api/user/*', {
      statusCode: 200,
      body: {
        id: 1,
        lastName: 'Test Lastname',
        firstName: 'Test Firstname',
        admin: false,
        createdAt: '2024-11-15T11:05:38',
        updatedAt: '2024-11-15T11:05:38',
        email: 'user@test.com',
      },
    }).as('getUser');

    cy.contains('Account').click();
    cy.wait('@getUser');

    cy.intercept('DELETE', '/api/user/*', {
      statusCode: 200,
    }).as('deleteUser');

    cy.get('button[color="warn"]').click();
    cy.wait('@deleteUser');

    cy.contains('Your account has been deleted !').should('be.visible');
    cy.contains('Login').should('be.visible');
  });
});
