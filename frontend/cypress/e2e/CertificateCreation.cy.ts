/// <reference types="cypress" />
describe('Create Certificate Form', (): void => {
    beforeEach((): void => {
      cy.visit('/');
      cy.contains('button', 'Create').click();
    });
  
    it('should successfully submit the form with valid data and file', (): void => {
      
     cy.intercept('POST', '/api/v1/certificates/create').as('createCertificate');
      const r_suffix :number= Math.floor(Math.random() * 10000);
      const name:string = `Test-${r_suffix}`;
      const provider:string = `DMA-${r_suffix}`;
      cy.get('input#name').type(name);
      cy.get('input#provider').type(provider);
      cy.get('input#issuedAt').type('2024-05-01');
      cy.get('input#expiresAt').type('2026-05-01');
  
      
      cy.fixture('sample.pdf', 'base64').then((fileContent: string ) : void => {
        const decodedFile = Cypress.Blob.base64StringToBlob(fileContent, 'application/pdf');
        cy.get('input#file').attachFile({
          fileContent: decodedFile,
          fileName: 'sample.pdf',
          mimeType: 'application/pdf',
        });
      });
  
      
      cy.get('form').submit();
  
      
      cy.wait('@createCertificate').its('response.statusCode').should('eq', 201);


      cy.contains('Certificate Manager').should('be.visible');

      cy.get('.MuiDataGrid-virtualScroller').within(():void  => {
        cy.contains(name).should('be.visible');
        cy.contains(provider).should('be.visible');
      });
      
    });
  
    it('should show error for invalid file type', (): void => {
      
      cy.fixture('sample.txt', 'base64').then((fileContent: string ) : void => {
        const decodedFile = Cypress.Blob.base64StringToBlob(fileContent, 'text/plain');
        cy.get('input#file').attachFile({
          fileContent: decodedFile,
          fileName: 'sample.txt',
          mimeType: 'text/plain',
        });
      });
  
      
      cy.contains('Invalid file type. Only PDF, PNG, or JPEG allowed.').should('be.visible');
    });

});
  