'use strict';

//get libraries
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

//create express web-app
const app = express();

//get the libraries to call
let network = require('./network/network.js');
let validate = require('./network/validate.js');
let analysis = require('./network/analysis.js');

//bootstrap application settings
app.use(express.static('./public'));
// app.use('/public/registerCandidate', express.static(path.join(__dirname, '/public/registerCandidate')));
app.use(bodyParser.json());

//get register issuer page
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/registerIssuer/registerIssuer.html'));
});

//get home page
app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/home/home.html'));
});

//REGISTERATION PAGES

//get register candidate page
app.get('/registercandidate', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/registerCandidate/registerCandidate.html'));
});

//get register issuer page
app.get('/registerissuer', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/registerIssuer/registerIssuer.html'));
});

//get register verifier page
app.get('/registeremployer', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/registerEmployer/registerEmployer.html'));
});

// SUCCESSFULLY REGISTERATION PAGES

//get register candidate page
app.get('/succregcan', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/SuccRegCan/SuccRegCan.html'));
});

//get register candidate page
app.get('/succregiss', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/SuccRegIss/SuccRegIss.html'));
});

//get register candidate page
app.get('/succregemp', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/SuccRegEmp/SuccRegEmp.html'));
});

// SIGN IN PAGES

//get sign in candidate page
app.get('/signincandidate', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/signInCandidate/signInCandidate.html'));
});

//get sign in issuer page
app.get('/signinissuer', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/signInIssuer/signInIssuer.html'));
});

//get sign in verifier page
app.get('/signinemployer', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/signInEmployer/signInEmployer.html'));
});

// DASHBOARD PAGES

app.get('/dashboardcandidate', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/dashboardCandidate/dashboardCandidate.html'));
});

//get sign in issuer page
app.get('/issuerdashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/issuerDashboard/issuerDashboard.html'));
});

//get sign in verifier page
app.get('/verifierdashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/verifierDashboard/verifierDashboard.html'));
});

//DASHBOARD NEXT PAGES

//get sign in issuer page
app.get('/issuecertificate', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/issueCertificate/issueCertificate.html'));
});

//get sign in issuer page
app.get('/cancertverify', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/canCertVerify/canCertVerify.html'));
});

//get sign in issuer page
app.get('/verifycertificate', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/verifyCertificate/verifyCertificate.html'));
});

//get verified page
app.get('/verified', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/verified/verified.html'));
});

//get verified page
app.get('/notverified', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/notVerified/notVerified.html'));
});

//get issued page
app.get('/issued', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/issued/issued.html'));
});

//get issued page
app.get('/success', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/SuccessfullyRegistered/SuccessfullyRegistered.html'));
});

//get  page
app.get('/certapproved', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/certApproved/certApproved.html'));
});

//get  page
app.get('/skillapproved', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/skillApproved/skillApproved.html'));
});

// OUR TEAM

//get our team page
app.get('/ourteam', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/our-team/ourteam.html'));
});


//get our team page
app.get('/blankdashboardcandidate', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/blankDashboardCandidate/blankDashboardCandidate.html'));
});

//get our team page
app.get('/certaddeddashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/certAddedDashboard/certAddedDashboard.html'));
});

//get our team page
app.get('/skilladdeddashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/skillAddedDashboard/skillAddedDashboard.html'));
});

//get our team page
app.get('/certverifieddashboard', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/certVerifiedDashboard/certVerifiedDashboard.html'));
});
//get member registration page
app.get('/registerMember', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/registerMember.html'));
});

//get partner page
app.get('/partner', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/partner.html'));
});

//get partner registration page
app.get('/registerPartner', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/registerPartner.html'));
});

//get about page
app.get('/about', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/about.html'));
});


//post call to register member on the network
app.post('/api/registerMember', function(req, res) {

    //declare variables to retrieve from request
    let accountNumber = req.body.accountnumber;
    let cardId = req.body.cardid;
    let firstName = req.body.firstname;
    let lastName = req.body.lastname;
    let email = req.body.email;
    let phoneNumber = req.body.phonenumber;

    //print variables
    console.log('Using param - firstname: ' + firstName + ' lastname: ' + lastName + ' email: ' + email + ' phonenumber: ' + phoneNumber + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

    //validate member registration fields
    validate.validateMemberRegistration(cardId, accountNumber, firstName, lastName, email, phoneNumber)
        .then((response) => {
            //return error if error in response
            if (typeof response === 'object' && 'error' in response && response.error !== null) {
                res.json({
                    error: response.error
                });
                return;
            } else {
                //else register member on the network
                network.registerMember(cardId, accountNumber, firstName, lastName, email, phoneNumber)
                    .then((response) => {
                        //return error if error in response
                        if (typeof response === 'object' && 'error' in response && response.error !== null) {
                            res.json({
                                error: response.error
                            });
                        } else {
                            //else return success
                            res.json({
                                success: response
                            });
                        }
                    });
            }
        });


});

//post call to register partner on the network
app.post('/api/registerPartner', function(req, res) {

    //declare variables to retrieve from request
    let name = req.body.name;
    let partnerId = req.body.partnerid;
    let cardId = req.body.cardid;

    //print variables
    console.log('Using param - name: ' + name + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

    //validate partner registration fields
    validate.validatePartnerRegistration(cardId, partnerId, name)
        .then((response) => {
            //return error if error in response
            if (typeof response === 'object' && 'error' in response && response.error !== null) {
                res.json({
                    error: response.error
                });
                return;
            } else {
                //else register partner on the network
                network.registerPartner(cardId, partnerId, name)
                    .then((response) => {
                        //return error if error in response
                        if (typeof response === 'object' && 'error' in response && response.error !== null) {
                            res.json({
                                error: response.error
                            });
                        } else {
                            //else return success
                            res.json({
                                success: response
                            });
                        }
                    });
            }
        });

});

//post call to perform EarnPoints transaction on the network
app.post('/api/earnPoints', function(req, res) {

    //declare variables to retrieve from request
    let accountNumber = req.body.accountnumber;
    let cardId = req.body.cardid;
    let partnerId = req.body.partnerid;
    let points = parseFloat(req.body.points);

    //print variables
    console.log('Using param - points: ' + points + ' partnerId: ' + partnerId + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

    //validate points field
    validate.validatePoints(points)
        .then((checkPoints) => {
            //return error if error in response
            if (typeof checkPoints === 'object' && 'error' in checkPoints && checkPoints.error !== null) {
                res.json({
                    error: checkPoints.error
                });
                return;
            } else {
                points = checkPoints;
                //else perforn EarnPoints transaction on the network
                network.earnPointsTransaction(cardId, accountNumber, partnerId, points)
                    .then((response) => {
                        //return error if error in response
                        if (typeof response === 'object' && 'error' in response && response.error !== null) {
                            res.json({
                                error: response.error
                            });
                        } else {
                            //else return success
                            res.json({
                                success: response
                            });
                        }
                    });
            }
        });

});

//post call to perform UsePoints transaction on the network
app.post('/api/usePoints', function(req, res) {

    //declare variables to retrieve from request
    let accountNumber = req.body.accountnumber;
    let cardId = req.body.cardid;
    let partnerId = req.body.partnerid;
    let points = parseFloat(req.body.points);

    //print variables
    console.log('Using param - points: ' + points + ' partnerId: ' + partnerId + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

    //validate points field
    validate.validatePoints(points)
        //return error if error in response
        .then((checkPoints) => {
            if (typeof checkPoints === 'object' && 'error' in checkPoints && checkPoints.error !== null) {
                res.json({
                    error: checkPoints.error
                });
                return;
            } else {
                points = checkPoints;
                //else perforn UsePoints transaction on the network
                network.usePointsTransaction(cardId, accountNumber, partnerId, points)
                    .then((response) => {
                        //return error if error in response
                        if (typeof response === 'object' && 'error' in response && response.error !== null) {
                            res.json({
                                error: response.error
                            });
                        } else {
                            //else return success
                            res.json({
                                success: response
                            });
                        }
                    });
            }
        });


});

//post call to retrieve member data, transactions data and partners to perform transactions with from the network
app.post('/api/memberData', function(req, res) {

    //declare variables to retrieve from request
    let accountNumber = req.body.accountnumber;
    let cardId = req.body.cardid;

    //print variables
    console.log('memberData using param - ' + ' accountNumber: ' + accountNumber + ' cardId: ' + cardId);

    //declare return object
    let returnData = {};

    //get member data from network
    network.memberData(cardId, accountNumber)
        .then((member) => {
            //return error if error in response
            if (typeof member === 'object' && 'error' in member && member.error !== null) {
                res.json({
                    error: member.error
                });
            } else {
                //else add member data to return object
                returnData.accountNumber = member.accountNumber;
                returnData.firstName = member.firstName;
                returnData.lastName = member.lastName;
                returnData.phoneNumber = member.phoneNumber;
                returnData.email = member.email;
                returnData.points = member.points;
            }

        })
        .then(() => {
            //get UsePoints transactions from the network
            network.usePointsTransactionsInfo(cardId, 'member', accountNumber)
                .then((usePointsResults) => {
                    //return error if error in response
                    if (typeof usePointsResults === 'object' && 'error' in usePointsResults && usePointsResults.error !== null) {
                        res.json({
                            error: usePointsResults.error
                        });
                    } else {
                        //else add transaction data to return object
                        returnData.usePointsResults = usePointsResults;
                    }

                }).then(() => {
                    //get EarnPoints transactions from the network
                    network.earnPointsTransactionsInfo(cardId, 'member', accountNumber)
                        .then((earnPointsResults) => {
                            //return error if error in response
                            if (typeof earnPointsResults === 'object' && 'error' in earnPointsResults && earnPointsResults.error !== null) {
                                res.json({
                                    error: earnPointsResults.error
                                });
                            } else {
                                //else add transaction data to return object
                                returnData.earnPointsResult = earnPointsResults;
                            }

                        })
                        .then(() => {
                            //get partners to transact with from the network
                            network.allPartnersInfo(cardId)
                                .then((partnersInfo) => {
                                    //return error if error in response
                                    if (typeof partnersInfo === 'object' && 'error' in partnersInfo && partnersInfo.error !== null) {
                                        res.json({
                                            error: partnersInfo.error
                                        });
                                    } else {
                                        //else add partners data to return object
                                        returnData.partnersData = partnersInfo;
                                    }

                                    //return returnData
                                    res.json(returnData);

                                });
                        });
                });
        });

});

//post call to retrieve partner data and transactions data from the network
app.post('/api/partnerData', function(req, res) {

    //declare variables to retrieve from request
    let partnerId = req.body.partnerid;
    let cardId = req.body.cardid;

    //print variables
    console.log('partnerData using param - ' + ' partnerId: ' + partnerId + ' cardId: ' + cardId);

    //declare return object
    let returnData = {};

    //get partner data from network
    network.partnerData(cardId, partnerId)
        .then((partner) => {
            //return error if error in response
            if (typeof partner === 'object' && 'error' in partner && partner.error !== null) {
                res.json({
                    error: partner.error
                });
            } else {
                //else add partner data to return object
                returnData.id = partner.id;
                returnData.name = partner.name;
            }

        })
        .then(() => {
            //get UsePoints transactions from the network
            network.usePointsTransactionsInfo(cardId, 'partner', partnerId)
                .then((usePointsResults) => {
                    //return error if error in response
                    if (typeof usePointsResults === 'object' && 'error' in usePointsResults && usePointsResults.error !== null) {
                        res.json({
                            error: usePointsResults.error
                        });
                    } else {
                        //else add transaction data to return object
                        returnData.usePointsResults = usePointsResults;
                        //add total points collected by partner to return object
                        returnData.pointsCollected = analysis.totalPointsCollected(usePointsResults);
                    }

                })
                .then(() => {
                    //get EarnPoints transactions from the network
                    network.earnPointsTransactionsInfo(cardId, 'partner', partnerId)
                        .then((earnPointsResults) => {
                            //return error if error in response
                            if (typeof earnPointsResults === 'object' && 'error' in earnPointsResults && earnPointsResults.error !== null) {
                                res.json({
                                    error: earnPointsResults.error
                                });
                            } else {
                                //else add transaction data to return object
                                returnData.earnPointsResults = earnPointsResults;
                                //add total points given by partner to return object
                                returnData.pointsGiven = analysis.totalPointsGiven(earnPointsResults);
                            }

                            //return returnData
                            res.json(returnData);

                        });
                });
        });

});

//declare port
let port = process.env.PORT || 8000;
if (process.env.VCAP_APPLICATION) {
    port = process.env.PORT;
}

//run app on port
app.listen(port, function() {
    console.log('app running on port: %d', port);
});