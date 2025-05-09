/// <reference types="cypress" />
describe('Test Table', ():void => {
    beforeEach((): void => {
        cy.visit('/');
        cy.contains('button', 'View').click();
        cy.contains('Certificate Manager');
    });

    it('should fail to download a certificate when not selecting anything', () : void => {
        cy.contains('button', 'Download').click();
        cy.on('window:alert', (text): void => {
            expect(text).to.include('Please select at least one certificate to download');
          });    
    });


    it('should download selected certificates when clicking "Download"', (): void => {
        cy.intercept('GET', 'api/v1/certificates/download').as('downloadCertificate');
        cy.get('.MuiDataGrid-row').should('exist');
    
        cy.get('[type="checkbox"]').first().check({ force: true });
    
        cy.contains('button', 'Download').click();
    
        cy.wait('@downloadCertificate').its('response.statusCode').should('eq', 200);
    });
    
    it('should download all certificates when clicking "Download All"', (): void => {
        cy.intercept('GET', 'api/v1/certificates/downloadall').as('downloadAll');
        cy.contains('button', 'Download All').click();
    
        cy.wait('@downloadAll').its('response.statusCode').should('eq', 200);
    });

    it('should delete all the existing certificates from the table', () : void => {

        cy.intercept('DELETE', 'api/v1/certificates/delete').as('deleteCertificate');
        cy.get('.MuiDataGrid-row').should('exist');
        
        cy.get('[type="checkbox"]').first().check({ force: true });
    
        
        cy.contains('button', 'Delete').click();
    
        
        cy.on('window:confirm', (): boolean => true);
        cy.wait('@deleteCertificate').its('response.statusCode').should('eq', 200);
        cy.on('window:alert', (text): void => {
            expect(text).to.include('Certificates deleted successfully');
          });    
        cy.get('.MuiDataGrid-row').should('not.exist');
    });

    it('should show error for trying download all certificates when the table is empty', () : void => {
        cy.contains('button', 'Download All').click();
        cy.contains('No certificates found').should('be.visible');
    });
});