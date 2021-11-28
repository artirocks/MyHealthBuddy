'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// capture network variables from config.json
const configPath = path.join(process.cwd(), 'config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);
let connection_file = config.connection_file;
let appAdmin = config.appAdmin;
let orgMSPID = config.orgMSPID;
let gatewayDiscovery = config.gatewayDiscovery;

const ccpPath = path.join(process.cwd(), connection_file);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//export module
module.exports = {

    /*
  * Create Employee participant and import card for identity
  * @param {String} cardId Import card id for employee
  * @param {String} accountNumber Employee account number as identifier on network
  * @param {String} firstName Employee first name
  * @param {String} lastName Employee last name
  * @param {String} phoneNumber Employee phone number
  * @param {String} email Employee email
  */
    registerEmployee: async function (cardId, employeeId, firstName, lastName, email, phoneNumber) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {

            let response = {};


            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(cardId);
            if (userExists) {
                let err = `An identity for the user ${cardId} already exists in the wallet`;
                console.log(err);
                response.error = err;
                return response;
            }

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists(appAdmin);
            if (!adminExists) {
                let err = 'An identity for the admin user-admin does not exist in the wallet. Run the enrollAdmin.js application before retrying';
                console.log(err);
                response.error = err;
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: cardId, role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: cardId, enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
            wallet.import(cardId, userIdentity);
            console.log('Successfully registered and enrolled admin user ' + cardId + ' and imported it into the wallet');

            // Disconnect from the gateway.
            await gateway.disconnect();
            console.log('admin user admin disconnected');

        } catch (err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

        await sleep(2000);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            let employee = {};
            employee.employeeId = employeeId;
            employee.firstName = firstName;
            employee.lastName = lastName;
            employee.email = email;
            employee.phoneNumber = phoneNumber;
            employee.Certis = {};

            // Submit the specified transaction.
            console.log('\nSubmit Create Employee transaction.');
            const createEmployeeResponse = await contract.submitTransaction('CreateEmployee', JSON.stringify(employee));
            console.log('createEmployeeResponse: ');
            console.log(JSON.parse(createEmployeeResponse.toString()));

            console.log('\nGet employee state ');
            const employeeResponse = await contract.evaluateTransaction('GetState', employeeId);
            console.log('employeeResponse.parse_response: ');
            console.log(JSON.parse(employeeResponse.toString()));

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Create Employer participant and import card for identity
  * @param {String} cardId Import card id for employer
  * @param {String} employerId Employer Id as identifier on network
  * @param {String} name Employer name
  */
    registerEmployer: async function (cardId, employerId, name) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {

            let response = {};


            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(cardId);
            if (userExists) {
                let err = `An identity for the user ${cardId} already exists in the wallet`;
                console.log(err);
                response.error = err;
                return response;
            }

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists(appAdmin);
            if (!adminExists) {
                let err = 'An identity for the admin user-admin does not exist in the wallet. Run the enrollAdmin.js application before retrying';
                console.log(err);
                response.error = err;
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: cardId, role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: cardId, enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
            wallet.import(cardId, userIdentity);
            console.log('Successfully registered and enrolled admin user ' + cardId + ' and imported it into the wallet');

            // Disconnect from the gateway.
            await gateway.disconnect();
            console.log('admin user admin disconnected');

        } catch (err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

        await sleep(2000);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            let employer = {};
            employer.id = employerId;
            employer.name = name;

            // Submit the specified transaction.
            console.log('\nSubmit Create Employer transaction.');
            const createEmployerResponse = await contract.submitTransaction('CreateEmployer', JSON.stringify(employer));
            console.log('createEmployerResponse: ');
            console.log(JSON.parse(createEmployerResponse.toString()));

            console.log('\nGet employer state ');
            const employerResponse = await contract.evaluateTransaction('GetState', employerId);
            console.log('employerResponse.parse_response: ');
            console.log(JSON.parse(employerResponse.toString()));

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },


    registerIssuer: async function (cardId, issuerId, name) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {

            let response = {};


            // Check to see if we've already enrolled the user.
            const userExists = await wallet.exists(cardId);
            if (userExists) {
                let err = `An identity for the user ${cardId} already exists in the wallet`;
                console.log(err);
                response.error = err;
                return response;
            }

            // Check to see if we've already enrolled the admin user.
            const adminExists = await wallet.exists(appAdmin);
            if (!adminExists) {
                let err = 'An identity for the admin user-admin does not exist in the wallet. Run the enrollAdmin.js application before retrying';
                console.log(err);
                response.error = err;
                return response;
            }

            // Create a new gateway for connecting to our peer node.
            const gateway = new Gateway();
            await gateway.connect(ccp, { wallet, identity: appAdmin, discovery: gatewayDiscovery });

            // Get the CA client object from the gateway for interacting with the CA.
            const ca = gateway.getClient().getCertificateAuthority();
            const adminIdentity = gateway.getCurrentIdentity();

            // Register the user, enroll the user, and import the new identity into the wallet.
            const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: cardId, role: 'client' }, adminIdentity);
            const enrollment = await ca.enroll({ enrollmentID: cardId, enrollmentSecret: secret });
            const userIdentity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
            wallet.import(cardId, userIdentity);
            console.log('Successfully registered and enrolled admin user ' + cardId + ' and imported it into the wallet');

            // Disconnect from the gateway.
            await gateway.disconnect();
            console.log('admin user admin disconnected');

        } catch (err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

        await sleep(2000);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            let issuer = {};
            issuer.id = issuerId;
            issuer.name = name;

            // Submit the specified transaction.
            console.log('\nSubmit Create Employer transaction.');
            const createIssuerResponse = await contract.submitTransaction('CreateIssuer', JSON.stringify(issuer));
            console.log('createIssuerResponse: ');
            console.log(JSON.parse(createIssuerResponse.toString()));

            console.log('\nGet issuer state ');
            const issuerResponse = await contract.evaluateTransaction('GetState', issuerId);
            console.log('issuerResponse.parse_response: ');
            console.log(JSON.parse(issuerResponse.toString()));

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },


    /*
  * Perform EarnCertis transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} aadharNumber of employee
  * @param {String} certificateType of certificate allocated to employee
  * @param {String} hashVal is SHA 256 hashCode of Employee certificate 
  */
    earnCertisTransaction: async function (cardId, empployeeId, certificateType, hashVal, Certis) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            let earnCertis = {};
            earnCertis.certiType = certificateType;
            earnCertis.employee = employeeId;
            earnCertis.hashValOfResume = hashVal;
            earnCertis.Certis = Certis;

            // Submit the specified transaction.
            console.log('\nSubmit EarnCertis transaction.');
            const earnCertisResponse = await contract.submitTransaction('EarnCertificate', JSON.stringify(earnCertis));
            console.log('earnCertisResponse: ');
            console.log(JSON.parse(earnCertisResponse.toString()));

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Perform UsePoints transaction
  * @param {String} cardId Card id to connect to network
  * @param {String} aadharNumber of employee
  * @param {String} employerId Employer Id of Employer
  * @param {String} hashValOfCerti SHA 256 hash code of document submitted by employee
  */
    verifyCertiTransaction: async function (cardId, employeeId, hashValOfCerti, docType) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            let certiDocVerification = {};
            certiDocVerification.docType = docType;
            certiDocVerification.employee = employeeId;
            certiDocVerification.hashValOfCerti = hashValOfCerti;
            certiDocVerification.isValid = "true";

            // Submit the specified transaction.
            console.log('\nSubmit VerifyCerti transaction.');
            const verifyCertiResponse = await contract.submitTransaction('VerifyCerti', JSON.stringify(certiDocVerification));
            console.log('verifyCertiResponse: ');
            console.log(JSON.parse(verifyCertiResponse.toString()));

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return true;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Get Employee data
  * @param {String} cardId Card id to connect to network
  * @param {String} aadharNumber of employee
  */
    employeeData: async function (cardId, employeeId) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            console.log('\nGet employee state ');
            let employee = await contract.submitTransaction('GetState', employeeId);
            employee = JSON.parse(employee.toString());
            console.log(employee);

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return employee;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Get Employer data
  * @param {String} cardId Card id to connect to network
  * @param {String} employeeId Employee Id of employee
  */
    employerData: async function (cardId, employerId) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            let employer = await contract.submitTransaction('GetState', employerId);
            employer = JSON.parse(employer.toString());
            console.log(employer);

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return employer;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    issuerData: async function (cardId, issuerId) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            let issuer = await contract.submitTransaction('GetState', issuerId);
            issuer = JSON.parse(issuer.toString());
            console.log(issuer);

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return issuer;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Get all employer data
  * @param {String} cardId Card id to connect to network
  */
    allEmployersInfo : async function (cardId) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            console.log('\nGet all employers state ');
            let allEmployers = await contract.evaluateTransaction('GetState', 'all-employers');
            allEmployers = JSON.parse(allEmployers.toString());
            console.log(allEmployers);

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return allEmployers;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }
    },

    /*
  * Get all EarnCertis transactions data
  * @param {String} cardId Card id to connect to network
  */
    earnCertisTransactionsInfo: async function (cardId, userType, userId) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            console.log(`\nGet earn points transactions state for ${userType} ${userId}`);
            let earnCertisTransactions = await contract.evaluateTransaction('EarnCertisTransactionsInfo', userType, userId);
            earnCertisTransactions = JSON.parse(earnCertisTransactions.toString());
            console.log(earnCertisTransactions);

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return earnCertisTransactions;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    },

    /*
  * Get all UsePoints transactions data
  * @param {String} cardId Card id to connect to network
  */
    verifyCertisTransactionsInfo: async function (cardId, userType, userId) {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), '/wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        try {
            // Create a new gateway for connecting to our peer node.
            const gateway2 = new Gateway();
            await gateway2.connect(ccp, { wallet, identity: cardId, discovery: gatewayDiscovery });

            // Get the network (channel) our contract is deployed to.
            const network = await gateway2.getNetwork('mychannel');

            // Get the contract from the network.
            const contract = network.getContract('skill-verification-system');

            console.log(`\nGet use verify transactions state for ${userType} ${userId}`);
            let verifyCertisTransactions = await contract.evaluateTransaction('VerifyCertisTransactionsInfo', userType, userId);
            verifyCertisTransactions = JSON.parse(verifyCertisTransactions.toString());
            console.log(verifyCertisTransactions);

            // Disconnect from the gateway.
            await gateway2.disconnect();

            return verifyCertisTransactions;
        }
        catch(err) {
            //print and return error
            console.log(err);
            let error = {};
            error.error = err.message;
            return error;
        }

    }

};