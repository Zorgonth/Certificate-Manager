/// <reference types="cypress" />
describe('Homepage', (): void => {
  beforeEach((): void => {
    cy.visit('/');
  });

  it('should load the homepage and display expected text', (): void => {
    cy.contains('h2', 'Welcome to Certificate Management').should('be.visible'); 
  });

  it('should display navbar links on mobile after hamburger click', (): void => {
    
  
    cy.get('.navbar').should('exist');
    
    cy.get('.navbar-links').should('have.class', 'active');
  
    
    cy.contains('button', 'View').should('be.visible');
    cy.contains('button', 'Create').should('be.visible');
    cy.contains('button', 'Home').should('be.visible');
  });

  it('should navigate to Home when Home button is clicked', ():void  => {
    
    cy.get('.navbar').should('exist');
  
    
    cy.contains('button', 'Home').click();
  
    
    cy.contains('h2', 'Welcome to Certificate Management').should('be.visible'); 
  });

  it('should navigate to Create when Create button is clicked', (): void => {
    cy.contains('button', 'Create').click();
  
    cy.contains('h3', 'Upload Your Certificate').should('be.visible');
  
    cy.get('input#name').should('exist');
    cy.get('input#provider').should('exist');
    cy.get('input#issuedAt').should('exist');
    cy.get('input#file').should('exist');
  });
  it('should navigate to View when View button is clicked', (): void => {
    cy.contains('button', 'View').click();

    cy.contains('Certificate Manager');
    cy.contains('button', 'Delete').should('exist');
    cy.contains('button', 'Download').should('exist');
    cy.contains('button', 'Download All').should('exist');
  });
});
