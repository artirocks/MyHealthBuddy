/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
const allEmployeesKey = 'all-employees';
const allEmployersKey = 'all-employers';
const allIssuersKey = 'all-issuers';
const earnCertificatesTransactionsKey = 'earn-certis-transactions';
const verifyCertificatesTransactionsKey = 'verify-certis-transactions';

class SkillVerification extends Contract {

    async instantiate(ctx) {
        console.info('============= START : Initialize Ledger ===========');

        await ctx.stub.putState('instantiate', Buffer.from('INIT-LEDGER'));
        await ctx.stub.putState(allEmployeesKey, Buffer.from(JSON.stringify([])));
        await ctx.stub.putState(allEmployersKey, Buffer.from(JSON.stringify([])));
        await ctx.stub.putState(allIssuersKey, Buffer.from(JSON.stringify([])));
        await ctx.stub.putState(earnCertificatesTransactionsKey, Buffer.from(JSON.stringify([])));
        await ctx.stub.putState(verifyCertificatesTransactionsKey, Buffer.from(JSON.stringify([])));

        console.info('============= END : Initialize Ledger ===========');
    }

    // Add a employee on the ledger and add it to the all-employees list
    async CreateEmployee(ctx, employee) {
        employee = JSON.parse(employee);

        await ctx.stub.putState(employee.aadharNumber, Buffer.from(JSON.stringify(employee)));
        
        let allemployees = await ctx.stub.getState(allEmployeesKey);

        allemployees = JSON.parse(allemployees);
        allemployees.push(employee);
        await ctx.stub.putState(allEmployersKey, Buffer.from(JSON.stringify(allemployees)));

        return JSON.stringify(employee);
    }

    // Add a employer on the ledger, and add it to the all-employers list
    async CreateEmployer(ctx, employer) {
        employer = JSON.parse(employer);

        await ctx.stub.putState(employer.id, Buffer.from(JSON.stringify(employer)));

        let allemployers = await ctx.stub.getState(allEmployersKey);
        allemployers = JSON.parse(allemployers);
        allemployers.push(employer);
        await ctx.stub.putState(allEmployersKey, Buffer.from(JSON.stringify(allemployers)));

        return JSON.stringify(employer);
    }

    // Add a Issuer on the ledger, and add it to the all-issuers list
    async CreateIssuer(ctx, issuer) {
        issuer = JSON.parse(issuer);

        await ctx.stub.putState(issuer.id, Buffer.from(JSON.stringify(issuer)));

        let allissuers = await ctx.stub.getState(allIssuersKey);
        allissuers = JSON.parse(allissuers);
        allissuers.push(issuer);
        await ctx.stub.putState(allIssuersKey, Buffer.from(JSON.stringify(allissuers)));

        return JSON.stringify(employer);
    }

    // Record a transaction of employee gaining a certificate
    async EarnCertificate(ctx, earnCerti) {

        earnCerti = JSON.parse(earnCerti);
        earnCerti.timestamp = new Date((ctx.stub.txTimestamp.seconds.low*1000)).toGMTString();
        earnCerti.transactionId = ctx.stub.txId;

        let employee = await ctx.stub.getState(earnCerti.employee);
        employee = JSON.parse(employee);

        for(var key in employee.Certis)
        {
            dict[key] = earnCerti.Certis[key]               // Updating hash values to latest profile
        }

        employee.resume = earnCerti.hashValOfResume;

        await ctx.stub.putState(earnCerti.employee, Buffer.from(JSON.stringify(employee)));

        let earnCertificatesTransactionsKey = await ctx.stub.getState(earnCertificatesTransactionsKey);
        earnCertificatesTransactions = JSON.parse(earnCertificatesTransactionsKey);
        earnCertificatesTransactions.push(earnCerti);
        await ctx.stub.putState(earnCertificatesTransactionsKey, Buffer.from(JSON.stringify(earnCertificatesTransactions)));

        return JSON.stringify(earnCerti);
    }

    // Record a transaction for verification
    async VerifyCerti(ctx, certiDocVerification) {
        certiDocVerification = JSON.parse(certiDocVerification);

        certiDocVerification.timestamp = new Date((ctx.stub.txTimestamp.seconds.low*1000)).toGMTString();
        certiDocVerification.transactionId = ctx.stub.txId;

        let employee = await ctx.stub.getState(certiDocVerification.employee);
        employee = JSON.parse(employee);

        if(employee[resume]!=certiDocVerification.hashValOfCerti)
        {
            certiDocVerification.isValid = "false";
        }
        
        else{
            certiDocVerification.isValid = "true";
        }
        
        let verifyCertificatesTransactions = await ctx.stub.getState(verifyCertificatesTransactionsKey);
        verifyCertificatesTransactions = JSON.parse(verifyCertificatesTransactions);
        verifyCertificatesTransactions.push(certiDocVerification);
        await ctx.stub.putState(verifyCertificatesTransactionsKey, Buffer.from(JSON.stringify(verifyCertificatesTransactions)));

    }

    // Get earn points transactions of the particular employee
    async EarnCertisTransactionsInfo(ctx, userType, userId) {
        let transactions = await ctx.stub.getState(earnCertisTransactionsKey);
        transactions = JSON.parse(transactions);
        let userTransactions = [];

        for (let transaction of transactions) {
            if (userType === 'issuer') {
                if (transaction.employee === userId) {
                    userTransactions.push(transaction);
                }
            }
        }

        return JSON.stringify(userTransactions);
    }

    // Get use points transactions of the particular employer
    async VerifyCertisTransactionsInfo(ctx, userType, userId) {
        let transactions = await ctx.stub.getState(verifyCertificatesTransactionsKey);
        transactions = JSON.parse(transactions);
        let userTransactions = [];

        for (let transaction of transactions) {
            if (userType === 'employer') {
                if (transaction.employer === userId) {
                    userTransactions.push(transaction);
                }
            }
        }

        return JSON.stringify(userTransactions);
    }

    // get the state from key
    async GetState(ctx, key) {
        let data = await ctx.stub.getState(key);

        let jsonData = JSON.parse(data.toString());
        return JSON.stringify(jsonData);
    }

}

module.exports = SkillVerification;
