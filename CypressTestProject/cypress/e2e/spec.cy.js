const dayjs = require('dayjs')

const getIframeDocument = (iframeSelector) => {
  return cy
  .get(iframeSelector)
  // Cypress yields jQuery element, which has the real
  // DOM element under property "0".
  // From the real DOM iframe element we can get
  // the "document" element, it is stored in "contentDocument" property
  .its('0.contentDocument').should('exist')
}

const getIframeBodyAlert = () => {
  return getIframeBody('iframe[src="alert/input-alert.html"]')
}

const getIframeBodyFormatDate = () => {
  return getIframeBody('iframe[src="datepicker/defult4.html"]')
}


const getIframeBody = (getIframeBodySelector) => {
  // get the document
  return getIframeDocument(getIframeBodySelector)
  // automatically retries until body is loaded
  .its('body').should('not.be.undefined')
  .then(cy.wrap)
}

//Alert popup test: verifying text entered into input field appears in the iframe
describe('Alert popup label test', () => {
  it('passes', () => {
    cy.on('uncaught:exception', (err, runnable) => {return false})
    cy.visit('https://way2automation.com/way2auto_jquery/automation-practice-site.html')
       
    cy.get('a:contains("Alert")').should($a => {
        expect($a.attr('href'), 'href').to.equal('alert.php')
        expect($a.attr('target'), 'target').to.equal('_blank')
        $a.attr('target', '_self')
    }).click()

    cy.get('a:contains("Input Alert")').click()

    cy.get('iframe[src="alert/input-alert.html"]').its('0.contentWindow')
        .should('exist')
        .then(function($promptelement){   // for prompt-type alert
         cy.stub($promptelement, "prompt").returns("Birute");
    })

    getIframeBodyAlert().find('button')
          .should('have.text', 'Click the button to demonstrate the Input box.')
          .click()

    getIframeBodyAlert().find('#demo').should('contain','Hello Birute! How are you today?')    
  })
})

//Date picker test: verifies if selected date corresponds specified format
describe('Date picker test', () => {
  it('passes', () => {
    cy.on('uncaught:exception', (err, runnable) => {return false})
    cy.visit('https://way2automation.com/way2auto_jquery/automation-practice-site.html')
       
    cy.get('a:contains("Datepicker")').should($a => {
        expect($a.attr('href'), 'href').to.equal('datepicker.php')
        expect($a.attr('target'), 'target').to.equal('_blank')
        $a.attr('target', '_self')
    }).click()

    cy.get('a:contains("Format date")').click()

    getIframeBodyFormatDate().find('#datepicker').click()
    getIframeBodyFormatDate().find('.ui-datepicker-calendar .ui-datepicker-today').click()
    getIframeBodyFormatDate().find('#format').select('ISO 8601 - yy-mm-dd')

    getIframeBodyFormatDate().find('#datepicker').should('have.value',dayjs().format('YYYY-MM-DD') )
  })
})