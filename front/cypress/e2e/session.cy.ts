/// <reference types="cypress" />

describe('Session', () => {
  const sessionData = {
    id: 1,
    name: 'Cours gratuit',
    date: '2024-03-22',
    teacher_id: 1,
    description: 'Test desc',
    users: [],
    createdAt: '2024-11-27T20:09:34',
    updatedAt: '2024-11-27T20:09:34',
  };

  const teacherData = {
    id: 1,
    lastName: 'Test Lastname',
    firstName: 'Test Firstname',
    createdAt: '2024-11-15T11:05:38',
    updatedAt: '2024-11-15T11:05:38',
  };

  beforeEach(() => {
    cy.intercept('GET', '/api/teacher', {
      statusCode: 200,
      body: [teacherData],
    }).as('getTeachers');

    cy.intercept('DELETE', '/api/session/*', {
      statusCode: 200,
      body: {},
    }).as('deleteSession');

    cy.intercept('GET', '/api/session', [sessionData]).as('getSessions');

    cy.intercept('GET', '/api/teacher/1', teacherData).as('getTeacher');

    cy.intercept('GET', '/api/session/1', sessionData).as('getSession');

    cy.login('yoga@studio.com', 'test!1234');
    cy.wait('@getSessions');
  });

  context('Admin actions', () => {
    it('should create session successfully', () => {
      cy.contains('Create').click();

      cy.intercept('POST', '/api/session', {
        statusCode: 200,
        body: sessionData,
      }).as('createSession');

      cy.fillSessionForm(sessionData);

      cy.get('button[type="submit"]').should('not.be.disabled').click();
      cy.wait('@createSession');
      cy.url().should('include', '/sessions');
    });

    it('should update session successfully', () => {
      const updatedSession = {
        ...sessionData,
        name: 'Session Updated E2E',
        description: 'Description updated e2e',
      };

      cy.contains('Edit').click();
      cy.wait('@getSession');

      cy.intercept('PUT', '/api/session/*', {
        statusCode: 200,
        body: updatedSession,
      }).as('updateSession');

      cy.get('input[formControlName="name"]').clear().type(updatedSession.name);
      cy.get('textarea[formControlName="description"]')
        .clear()
        .type(updatedSession.description);

      cy.get('button[type="submit"]').should('not.be.disabled').click();
      cy.wait('@updateSession');
      cy.contains('Session updated !').should('be.visible');
      cy.url().should('include', '/sessions');
    });

    it('should delete session successfully', () => {
      cy.contains('Detail').click();
      cy.wait('@getSession');
      cy.contains('Delete').should('be.visible').click();
      cy.contains('Session deleted !').should('be.visible');
    });
  });

  context('Session participation', () => {
    beforeEach(() => {
      cy.intercept('DELETE', '/api/session/1/participate/1', {}).as(
        'unParticipateSession'
      );
      cy.intercept('POST', '/api/session/1/participate/1', {}).as(
        'participateSession'
      );
    });

    it('should not show participate button for admin', () => {
      cy.contains('Detail').click();
      cy.wait('@getSession');
      cy.get('mat-card').should('be.visible');
      cy.should('not.contain', 'Participate');
    });

    it('should allow user to participate in session', () => {
      cy.login('yoga@studio.com', 'test!1234', false);
      cy.wait('@getSessions');
      cy.contains('Detail').should('be.visible').click();
      cy.wait('@getSession');

      const sessionWithParticipation = {
        ...sessionData,
        users: [1],
      };
      cy.intercept('GET', '/api/session/1', sessionWithParticipation).as(
        'getSessionWithParticipation'
      );

      cy.contains('Participate').click();
      cy.wait('@participateSession');
      cy.wait('@getSessionWithParticipation');
      cy.contains('Do not participate').should('be.visible');
    });

    it('should allow user to unparticipate from session', () => {
      cy.login('yoga@studio.com', 'test!1234', false);
      cy.wait('@getSessions');

      const sessionWithUser = {
        ...sessionData,
        users: [1],
      };
      cy.intercept('GET', '/api/session/1', sessionWithUser).as('getSession');

      cy.contains('Detail').should('be.visible').click();

      cy.wait('@getSession');

      const sessionWithoutUser = {
        ...sessionData,
        users: [0],
      };
      cy.intercept('GET', '/api/session/1', sessionWithoutUser).as(
        'getSessionWithoutParticipation'
      );

      cy.contains('Do not participate').click();
      cy.wait('@unParticipateSession');
      cy.wait('@getSessionWithoutParticipation');
      cy.contains('Participate').should('be.visible');
    });
  });

  context('Access control', () => {
    it('should redirect unauthenticated users to login', () => {
      cy.clearLocalStorage();
      cy.visit('/sessions/create');
      cy.url().should('include', '/login');
    });

    it('should hide admin actions for non-admin users', () => {
      cy.login('yoga@studio.com', 'test!1234', false);
      cy.should('not.contain', 'Create');
      cy.should('not.contain', 'Edit');

      cy.contains('Detail').click();
      cy.wait('@getSession');
      cy.get('mat-card').should('be.visible');
      cy.should('not.contain', 'Delete');
    });
  });
});
