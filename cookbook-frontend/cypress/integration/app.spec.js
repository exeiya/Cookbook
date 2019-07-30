describe('Cookbook', function() {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const newUser = {
      username: 'Kokkikolmonen',
      password: 'Salasana_1234'
    };
    cy.request('POST', 'http://localhost:3001/api/users', newUser);
    cy.visit('http://localhost:3000');
  });

  it('Front page can be opened', function() {
    cy.contains('Cookbook');
  });

  it('User can log in', function() {
    cy.contains('Kirjaudu sisään').click();
    cy.get('[data-cy=login-username]').children('input').type('Kokkikolmonen');
    cy.get('[data-cy=login-password]').children('input').type('Salasana_1234');
    cy.get('[data-cy=login-submit]').click();
    cy.contains('Kokkikolmonen');
  });

  describe('when user is logged in', function () {
    beforeEach(function () {
      cy.contains('Kirjaudu sisään').click();
      cy.get('[data-cy=login-username]').children('input').type('Kokkikolmonen');
      cy.get('[data-cy=login-password]').children('input').type('Salasana_1234');
      cy.get('[data-cy=login-submit]').click();
    });

    it('a new recipe can be created', function () {
      cy.contains('Reseptit').click();
      cy.get('[data-cy=create-recipe-button]').click();
      cy.get('[name=title]').type('Purkkihernekeitto');
      cy.get('[data-cy=ingredient-name-field]').type('hernekeitto');
      cy.get('[data-cy=ingredient-amount-field]').type('1 purkki');
      cy.get('[data-cy=ingredient-add-button]').click();
      cy.get('[data-cy=ingredient-name-field]').eq(1).type('vesi');
      cy.get('[data-cy=ingredient-amount-field]').eq(1).type('2,5 dl');
      cy.get('[name=instructions]').type('Sekoita hernekeitto ja vesi keskenään kattilassa, kiehauta.');
      cy.get('[name=category]').click();
      cy.get('[role=option]').contains('Pääruoka').click();
      cy.contains('Lisää resepti').click();
    });

    describe('and a new recipe is created', function () {
      beforeEach(function () {
        cy.contains('Reseptit').click();
        cy.get('[data-cy=create-recipe-button]').click();
        cy.get('[name=title]').type('Purkkihernekeitto');
        cy.get('[data-cy=ingredient-name-field]').type('hernekeitto');
        cy.get('[data-cy=ingredient-amount-field]').type('1 purkki');
        cy.get('[data-cy=ingredient-add-button]').click();
        cy.get('[data-cy=ingredient-name-field]').eq(1).type('vesi');
        cy.get('[data-cy=ingredient-amount-field]').eq(1).type('2,5 dl');
        cy.get('[name=instructions]').type('Sekoita hernekeitto ja vesi keskenään kattilassa, kiehauta.');
        cy.get('[name=category]').click();
        cy.get('[role=option]').contains('Pääruoka').click();
        cy.contains('Lisää resepti').click();
      });

      it('the recipe can be viewed', function () {
        cy.contains('Reseptit').click();
        cy.get('[data-cy=recipe-card-header]').contains('Purkkihernekeitto').click();
        cy.contains('Tykkää');
        cy.contains('Sekoita hernekeitto ja vesi keskenään kattilassa, kiehauta.');
      });

      it('the recipe can be liked', function () {
        cy.contains('Reseptit').click();
        cy.get('[data-cy=recipe-card-header]').contains('Purkkihernekeitto').click();
        cy.contains('Tykkää').click();
        cy.get('[data-cy=recipe-likes]').contains(1);
      });

      it('the recipe can be favorited', function () {
        cy.contains('Reseptit').click();
        cy.get('[data-cy=recipe-card-header]').contains('Purkkihernekeitto').click();
        cy.contains('Lisää suosikkeihin').click();
        cy.contains('Poista suosikeista');
      });
    });
  });
});

