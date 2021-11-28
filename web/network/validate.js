'use strict';

//stackoverflow
function isInt(value) {
    return !isNaN(value) && (function(x) {
        return (x | 0) === x;
    })(parseFloat(value));
}

//stackoverflow
function validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

//stackoverflow
function validatePhoneNumber(phoneNumber) {
    let re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phoneNumber));
}

module.exports = {

    /*
  * Validata member registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} accountNumber
  * @param {String} firstName
  * @param {String} lastName
  * @param {String} phoneNumber
  * @param {String} email
  */
    validateEmployeeRegistration: async function(cardId, aadharNumber, firstName, lastName, email, phoneNumber) {

        let response = {};

        //verify input otherwise return error with an informative message
        if (aadharNumber.length != 16) {
            response.error = 'Aadhar Number must be sixteen digits long';
            console.log(response.error);
            return response;
        } else if (!isInt(accountNumber)) {
            response.error = 'Aadhar Number must be all numbers';
            console.log(response.error);
            return response;
        } else if (cardId.length < 1) {
            response.error = 'Enter access key';
            console.log(response.error);
            return response;
        } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
            response.error = 'Card id can be letters and numbers only';
            console.log(response.error);
            return response;
        } else if (firstName.length < 1) {
            response.error = 'Enter first name';
            console.log(response.error);
            return response;
        } else if (!/^[a-zA-Z]+$/.test(firstName)) {
            response.error = 'First name must be letters only';
            console.log(response.error);
            return response;
        } else if (lastName.length < 1) {
            response.error = 'Enter last name';
            console.log(response.error);
            return response;
        } else if (!/^[a-zA-Z]+$/.test(lastName)) {
            response.error = 'First name must be letters only';
            console.log(response.error);
            return response;
        } else if (email.length < 1) {
            response.error = 'Enter email';
            console.log(response.error);
            return response;
        } else if (!validateEmail(email)) {
            response.error = 'Enter valid email';
            console.log(response.error);
            return response;
        } else if (phoneNumber.length < 1) {
            response.error = 'Enter phone number';
            console.log(response.error);
            return response;
        } else if (!validatePhoneNumber(phoneNumber)) {
            response.error = 'Enter valid phone number';
            console.log(response.error);
            return response;
        } else {
            console.log('Valid Entries');
            return response;
        }

    },

    /*
  * Validata partner registration fields ensuring the fields meet the criteria
  * @param {String} cardId
  * @param {String} partnerId
  * @param {String} name
  */
    validateEmployerRegistration: async function(cardId, partnerId, name) {

        let response = {};

        //verify input otherwise return error with an informative message
        if (cardId.length < 1) {
            response.error = 'Enter access key';
            console.log(response.error);
            return response;
        } else if (!/^[0-9a-zA-Z]+$/.test(cardId)) {
            response.error = 'Access key can be letters and numbers only';
            console.log(response.error);
            return response;
        } else if (partnerId.length < 1) {
            response.error = 'Enter partner id';
            console.log(response.error);
            return response;
        } else if (!/^[0-9a-zA-Z]+$/.test(partnerId)) {
            response.error = 'Partner id can be letters and numbers only';
            console.log(response.error);
            return response;
        } else if (name.length < 1) {
            response.error = 'Enter company name';
            console.log(response.error);
            return response;
        } else if (!/^[a-zA-Z]+$/.test(name)) {
            response.error = 'Company name must be letters only';
            console.log(response.error);
            return response;
        } else {
            console.log('Valid Entries');
            return response;
        }

    },

    validateHashCodes: async function(hashCodeVal) {

        let response = {};
        //verify input otherwise return error with an informative message
        const regexExp = /^[a-f0-9]{64}$/gi;
        if (!regexExp.test(hashCodeVal)) {
            response.error = 'Not SHA 256 code!';
            console.log(response.error);
            return response;
        } else {
            return hashCodeVal;
        }

    }

};