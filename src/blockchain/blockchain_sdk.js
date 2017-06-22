/*eslint-env node */
//this file acctually acts as a wrapper around a the chaincode
//it directly sends the data which it receives from webservices to chaincode..and then the data is stored it in ledger
"use strict";

/**
@author: risabh sharma
@version: 3.0
@date: 04/02/2017
@Description: SDK to talk to blockchain using hfc
**/

var Promise = require('bluebird');
var config = require('config');
var logHelper = require('../logging/logging.js');
var logger = logHelper.getLogger('blockchain_sdk');
var validate = require('../utils/validation_helper.js');
var util = require('../utils/util.js');
var constants = require('../constants/constants.js');
var bcNetwork = require('../blockchain/blockchain_network.js');


var secure = true;
var retryLimit = 5;
var retryInterval = 2000;


/**
register a new user
**/
//function UserRegisteration receives all the data required for registeration from functions/register.js file 
function UserRegisteration(params) {

    console.log("calling SDK for registration");
    return new Promise(function(resolve, reject){
        var UserDetails;
        try{
            logHelper.logEntryAndInput(logger, 'UserRegisteration', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'UserRegisteration', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid params' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'UserRegisteration', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid user' })
            }

            UserDetails = params.UserDetails;
          
            if(!validate.isValidJson(UserDetails)){
                logHelper.logError(logger, 'UserRegisteration', 'Invalid UserDetails');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create  userRegisteration. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register
//args: [UserDetails.name,UserDetails.email,UserDetails.phone,UserDetails.pan,UserDetails.aadhar,UserDetails.usertype,UserDetails.upi,UserDetails.passpin]})
            var reqSpec = getRequestSpec({functionName: 'registerUser',args: [UserDetails.id,UserDetails.name,UserDetails.email,UserDetails.phone,UserDetails.pan,UserDetails.aadhar,UserDetails.usertype,UserDetails.upi,UserDetails.passpin]});
            recursiveInvoke({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'UserRegisteration', 'Successfully registered user', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: UserDetails});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'UserRegisteration', 'Could not register user', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });



}
/**
login function
**/
function User_login(params) {
    console.log(params,'data in params for query method')
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'get login details', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'get login details', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch login details. Invalid params' })}
            
             
        
            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'get login details', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch login details. Invalid user' })
            }
        
            
            var emailid = params.email;
            if(!validate.isValidString(emailid)){
                logHelper.logError(logger, 'get login details', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch login details. Invalid user' })
            }

            var passpin = params.password;
            logHelper.logMessage(logger,passpin,'params.name of query method' );
            if(!validate.isValidString(passpin)){
                logHelper.logError(logger, 'getUserDetails', 'Invalid name');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch user details. Invalid id' })
            }
                
            var reqSpec = getRequestSpec({functionName: 'login', args: [emailid,passpin]});
            recursiveQuery({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'get login details', 'Successfully fetched login details', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: resp.body});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'getUserDetails', 'Could not fetch user details', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch user details' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'getUserDetails', 'Could not fetch property ad ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch user details' });
      }
    });
}
function Create_Campaign(params) {

    console.log("calling SDK for create campaign");
    return new Promise(function(resolve, reject){
        var CampaignDetails;
        try{
            logHelper.logEntryAndInput(logger, 'createCampaign', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'createCampaign', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create ccampaign. Invalid params' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'createCampaign', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create campaign. Invalid user' })
            }

            CampaignDetails = params.CampaignDetails;
          
            if(!validate.isValidJson(CampaignDetails)){
                logHelper.logError(logger, 'createCampaign', 'Invalid UserDetails');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create  campaign. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register
//args: [UserDetails.name,UserDetails.email,UserDetails.phone,UserDetails.pan,UserDetails.aadhar,UserDetails.usertype,UserDetails.upi,UserDetails.passpin]})
            var reqSpec = getRequestSpec({functionName: 'CreateCampaign',args:[CampaignDetails.status,CampaignDetails.campaign_id,CampaignDetails.user_id,CampaignDetails.campaign_title,CampaignDetails.campaign_discription,CampaignDetails.loan_amt,CampaignDetails.interest_rate,CampaignDetails.term]});
            recursiveInvoke({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'CreateCampaign', 'Successfully created campaign', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: CampaignDetails});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'CreateCampaign', 'Could not create Campaign', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not create campaign' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });
}

function postbid(params) {

    console.log("calling SDK for post bid");
    return new Promise(function(resolve, reject){
        var bid_details;
        try{
            logHelper.logEntryAndInput(logger, 'post bid', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'postbid', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid params' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'postbid', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid user' })
            }

            bid_details = params.bid_details;
          
            if(!validate.isValidJson(bid_details)){
                logHelper.logError(logger, 'postbid', 'Invalid UserDetails');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create  userRegisteration. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register

            var reqSpec = getRequestSpec({functionName: 'PostBid',args: [
            bid_details.bid_id,
            bid_details.bid_campaign_id,
            bid_details.bid_user_id,
            bid_details.bid_quote
            ]});
          
            recursiveInvoke({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'postbid', 'Successfully posted your bid', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: bid_details});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'postbid', 'Could not post your bid', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not post users bid' });

            });
            
        }
        catch(err){
            logHelper.logError(logger, 'postbid', 'Could not postbid on blockchain ledger: ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not postbid user' });
        }
    });
}

//get campaign details based on email id
function fetchCampaignlist(params) {
    console.log(params,'data in params for query method')
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'fetch campaign details', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'fetch campaign details', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid params' })}
            
             
         
            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }
            
            
            var getcusers = params.getcusers;
            if(!validate.isValidString(getcusers)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }    
            var reqSpec = getRequestSpec({functionName: 'readuser', args: ["getcusers"]});
            recursiveQuery({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'fetched campaign details', 'Successfully fetched login details', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: resp.body});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'getcusers', 'Could not fetch user details', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'fetchcampaigndetails', 'Could not fetch property ad ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });
      }
    });
}
    function fetchActiveCampaignlist(params) {
    console.log(params,'data in params for query method')
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'fetch campaign details', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'fetch campaign details', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid params' })}
            
             
         
            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }
            
            
            var getcusers = params.getcusers;
            if(!validate.isValidString(getcusers)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }    
            var reqSpec = getRequestSpec({functionName: 'readuser', args: ["getcusers"]});
            recursiveQuery({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'fetched campaign details', 'Successfully fetched login details', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: resp.body});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'getcusers', 'Could not fetch user details', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'fetch active campaigndetails', 'Could not fetch property ad ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });
      }
    });
}
  
/**
Generates the request object for invoke and query calls using hfc
**/
function getRequestSpec(params){

        if(!validate.isValidJson(params)){
            logHelper.logError(logger, 'getRequestSpec', 'Invalid params');
            throw new Error("Invalid params");
        }

        var chaincodeID = config['chaincode']['id'];//util.getUserDefinedProperty(constants['BLOCKCHAIN_CHAINCODE'])['id'];
        if(!validate.isValidString(chaincodeID)){
            logHelper.logError(logger, 'getRequestSpec', 'Invalid chaincodeID');
            throw new Error("Invalid chaincodeID");
        }

        var functionName = params.functionName;
        if(!validate.isValidString(functionName)){
            logHelper.logError(logger, 'getRequestSpec', 'Invalid function name');
            throw new Error("Invalid function name");
        }

        var args = []
        
        if(validate.isValidArray(params.args)){
            args = params.args;
        }

   //     var attributes = ['username', 'role']
        
     //   if(validate.isValidArray(params.attributes)){
       //     attributes = params.attributes;
        

        var spec = {
            chaincodeID: chaincodeID,
            fcn: functionName,
            args: args
          //  attrs: attributes
        }

        return spec;
}


/**
Performs query operation on blockchain
**/
function doQuery(params){
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'doQuery', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'doQuery', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid params' })
            }

            var requestSpec = params.requestSpec;
            if(!validate.isValidJson(requestSpec)){
                logHelper.logError(logger, 'doQuery', 'Invalid requestSpec');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid requestSpec' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'doQuery', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid user' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(user)
            .then(function(member){
                
                var tx = member.query(requestSpec);
                tx.on('submitted', function() {
                    logHelper.logMessage(logger, 'doQuery','Transaction for query submitted');
                });

                tx.on('complete', function(data) {
                    try{
                        logHelper.logMessage(logger, 'doQuery', 'data in data.result ',data.result);
                        var buffer = new Buffer(data.result);
                         logHelper.logMessage(logger, 'doQuery', 'data in buffer.tostring ',buffer.toString());
                        var jsonResp = JSON.parse(buffer.toString());
                        return resolve({statusCode: constants.SUCCESS, body: jsonResp});
                    }
                    catch(err){
                        logHelper.logError(logger,'doQuery','Could not parse query response',err);
                        return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not parse query response ' });
                    }
                });

                tx.on('error', function (err) {
                    logHelper.logError(logger, 'doQuery', 'Could not perform query ',err);
                    return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
                   
                });
            })
            .catch(function(err){
                logHelper.logError(logger, 'doQuery', 'Could not perform query ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
            })

        }
        catch(err){
                logHelper.logError(logger, 'doQuery', 'Could not perform query ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
        }
    });
  
}


/**
Performs invoke operation on blockchain
**/
function doInvoke(params){
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'doInvoke', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'doInvoke', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid params' })
            }

            var requestSpec = params.requestSpec;
            if(!validate.isValidJson(requestSpec)){
                logHelper.logError(logger, 'doInvoke', 'Invalid requestSpec');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid requestSpec' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'doInvoke', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid user' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);
            

            chainAsync.getMemberAsync(user)
            .then(function(member){
                
                var tx = member.invoke(requestSpec);
                tx.on('submitted', function(data) {
                    logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke submitted ',requestSpec);
                    return resolve({statusCode: constants.SUCCESS, body: data});
                    
                });

                tx.on('complete', function(data) {
                    logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke complete ',data);
                    
                });

                tx.on('error', function (err) {
                    logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ',err);
                    return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
                   
                });
            })
            .catch(function(err){
                logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
            })

        }
        catch(err){
                logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
        }
    });
  
}

/*Performs register on Blockchain CA*/
function doRegister(params) {
    return new Promise(function(resolve, reject){
        
        var username;
        try{
            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'registerUser', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid params' })
            }

            username = params.username;
            if(!validate.isValidString(username)){
                logHelper.logError(logger, 'registerUser', 'Invalid username');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid username' })
            }

            var affiliation = params.affiliation;
            if(!validate.isValidString(affiliation)){
                logHelper.logError(logger, 'registerUser', 'Invalid affiliation');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid affiliation' })
            }

            var roles = params.roles;
            if(!validate.isValidArray(roles)){
                roles = ['client'];
            }

            var enrollsecret
            var chain = bcNetwork.getChain();
            var reg = chain.getRegistrar();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                var memberAsync = Promise.promisifyAll(member);
                
                    var registrationRequest = {
                        enrollmentID: username,
                        attributes: [
                            {name: 'role', value: affiliation},
                            {name: 'username', value: username}
                        ],
                        affiliation: 'group1',
                        registrar: reg,
                        roles: roles
                        
                    };
                    
                return memberAsync.registerAsync(registrationRequest);
            })
            .then(function(enrollsec){
                logHelper.logMessage(logger, 'registerUser', 'Successfully registered user on blockchain: '+username);
                enrollsecret = enrollsec;
                return resolve({statusCode: constants.SUCCESS, body: {password: enrollsecret}});
                
            })
            .catch(function(err){
                logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
            })
        }
        catch(err){
            logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: '+username, err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });
   
}

/**
Enroll user with the Blockchain CA
**/
function doLogin(params) {
    return new Promise(function(resolve, reject){

        try{
            logHelper.logMethodEntry(logger, 'doLogin');
            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'doLogin', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid params' })
            }

            var username = params.username;
            if(!validate.isValidString(username)){
                logHelper.logError(logger, 'doLogin', 'Invalid username');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid username' })
            }

            var password = params.password;
            if(!validate.isValidString(password)){
                logHelper.logError(logger, 'doLogin', 'Invalid account');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid password' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                var memberAsync = Promise.promisifyAll(member);
                return memberAsync.enrollAsync(password);
            })
            .then(function(crypto){
                logHelper.logMessage(logger, 'doLogin', 'Successfully logged in user on blockchain: '+username);
                return resolve({statusCode: constants.SUCCESS, body: crypto});
            })
            .catch(function(err){
                logHelper.logError(logger, 'doLogin', 'Could not login user on blockchain: '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not login user' });
            });

        }
        catch(err){
            logHelper.logError(logger, 'doLogin', 'Could not register user on blockchain: '+username, err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveRegister(params){
    if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doRegister(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveRegister', "Register Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            return recursiveRegister(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveLogin(params){
    if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doLogin(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveLogin', "Login Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            return recursiveLogin(params);
        });
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveInvoke(params){
    if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doInvoke(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retries Exhausted", err);
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retry "+params.retryCounter, err)
            return recursiveInvoke(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveQuery(params){
   if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doQuery(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveQuery', "Query Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            logHelper.logError(logger, 'recursiveQuery', "Query Retry "+params.retryCounter, err)
            return recursiveQuery(params);
        });
    });
}

function isUserRegistered(params){
    return new Promise(function(resolve,reject){
        try{
            logHelper.logMethodEntry(logger,'isUserRegistered');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                return resolve({statusCode: constants.SUCCESS, body: member.isRegistered()});
            })
            .catch(function(err){
                logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user registration status' });
            });
        }
        catch(err){
             logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status '+username, err);
             return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user registration status' });
        }
    })
   
}

function isUserEnrolled(params){
    return new Promise(function(resolve,reject){
        try{
            logHelper.logMethodEntry(logger,'isUserEnrolled');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                return resolve({statusCode: constants.SUCCESS, body: member.isEnrolled()});
            })
            .catch(function(err){
                logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user enrollment status' });
            });
        }
        catch(err){
             logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status '+username, err);
             return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user enrollment status' });
        }
    });
   
}

module.exports = {
    UserRegisteration: UserRegisteration,
    User_login: User_login,
    Create_Campaign:Create_Campaign,
    postbid:postbid,
    fetchCampaignlist:fetchCampaignlist,
    fetchActiveCampaignlist:fetchActiveCampaignlist,
    recursiveRegister: recursiveRegister,
    recursiveLogin: recursiveLogin,
    isUserEnrolled: isUserEnrolled,
    isUserRegistered: isUserRegistered
   };/*eslint-env node */
//this file acctually acts as a wrapper around a the chaincode
//it directly sends the data which it receives from webservices to chaincode..and then the data is stored it in ledger
"use strict";

/**
@author: risabh sharma
@version: 3.0
@date: 04/02/2017
@Description: SDK to talk to blockchain using hfc
**/

var Promise = require('bluebird');
var config = require('config');
var logHelper = require('../logging/logging.js');
var logger = logHelper.getLogger('blockchain_sdk');
var validate = require('../utils/validation_helper.js');
var util = require('../utils/util.js');
var constants = require('../constants/constants.js');
var bcNetwork = require('../blockchain/blockchain_network.js');


var secure = true;
var retryLimit = 5;
var retryInterval = 2000;


/**
register a new user
**/
//function UserRegisteration receives all the data required for registeration from functions/register.js file 
function UserRegisteration(params) {

    console.log("calling SDK for registration");
    return new Promise(function(resolve, reject){
        var UserDetails;
        try{
            logHelper.logEntryAndInput(logger, 'UserRegisteration', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'UserRegisteration', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid params' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'UserRegisteration', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid user' })
            }

            UserDetails = params.UserDetails;
          
            if(!validate.isValidJson(UserDetails)){
                logHelper.logError(logger, 'UserRegisteration', 'Invalid UserDetails');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create  userRegisteration. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register
//args: [UserDetails.name,UserDetails.email,UserDetails.phone,UserDetails.pan,UserDetails.aadhar,UserDetails.usertype,UserDetails.upi,UserDetails.passpin]})
            var reqSpec = getRequestSpec({functionName: 'registerUser',args: [UserDetails.id,UserDetails.name,UserDetails.email,UserDetails.phone,UserDetails.pan,UserDetails.aadhar,UserDetails.usertype,UserDetails.upi,UserDetails.passpin]});
            recursiveInvoke({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'UserRegisteration', 'Successfully registered user', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: UserDetails});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'UserRegisteration', 'Could not register user', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });



}
/**
login function
**/
function User_login(params) {
    console.log(params,'data in params for query method')
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'get login details', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'get login details', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch login details. Invalid params' })}
            
             
        
            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'get login details', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch login details. Invalid user' })
            }
        
            
            var emailid = params.email;
            if(!validate.isValidString(emailid)){
                logHelper.logError(logger, 'get login details', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch login details. Invalid user' })
            }

            var passpin = params.password;
            logHelper.logMessage(logger,passpin,'params.name of query method' );
            if(!validate.isValidString(passpin)){
                logHelper.logError(logger, 'getUserDetails', 'Invalid name');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch user details. Invalid id' })
            }
                
            var reqSpec = getRequestSpec({functionName: 'login', args: [emailid,passpin]});
            recursiveQuery({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'get login details', 'Successfully fetched login details', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: resp.body});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'getUserDetails', 'Could not fetch user details', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch user details' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'getUserDetails', 'Could not fetch property ad ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch user details' });
      }
    });
}
function Create_Campaign(params) {

    console.log("calling SDK for create campaign");
    return new Promise(function(resolve, reject){
        var CampaignDetails;
        try{
            logHelper.logEntryAndInput(logger, 'createCampaign', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'createCampaign', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create ccampaign. Invalid params' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'createCampaign', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create campaign. Invalid user' })
            }

            CampaignDetails = params.CampaignDetails;
          
            if(!validate.isValidJson(CampaignDetails)){
                logHelper.logError(logger, 'createCampaign', 'Invalid UserDetails');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create  campaign. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register
//args: [UserDetails.name,UserDetails.email,UserDetails.phone,UserDetails.pan,UserDetails.aadhar,UserDetails.usertype,UserDetails.upi,UserDetails.passpin]})
            var reqSpec = getRequestSpec({functionName: 'CreateCampaign',args:[CampaignDetails.status,CampaignDetails.campaign_id,CampaignDetails.user_id,CampaignDetails.campaign_title,CampaignDetails.campaign_discription,CampaignDetails.loan_amt,CampaignDetails.interest_rate,CampaignDetails.term]});
            recursiveInvoke({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'CreateCampaign', 'Successfully created campaign', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: CampaignDetails});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'CreateCampaign', 'Could not create Campaign', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not create campaign' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'UserRegisteration', 'Could not register user application on blockchain ledger: ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });
}

function postbid(params) {

    console.log("calling SDK for post bid");
    return new Promise(function(resolve, reject){
        var bid_details;
        try{
            logHelper.logEntryAndInput(logger, 'post bid', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'postbid', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid params' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'postbid', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create UserRegisteration. Invalid user' })
            }

            bid_details = params.bid_details;
          
            if(!validate.isValidJson(bid_details)){
                logHelper.logError(logger, 'postbid', 'Invalid UserDetails');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not create  userRegisteration. Invalid json object' })
            }
            //here in function name we use the actual function name which is used for registeration i.e User_register

            var reqSpec = getRequestSpec({functionName: 'PostBid',args: [
            bid_details.bid_id,
            bid_details.bid_campaign_id,
            bid_details.bid_user_id,
            bid_details.bid_quote
            ]});
          
            recursiveInvoke({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'postbid', 'Successfully posted your bid', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: bid_details});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'postbid', 'Could not post your bid', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not post users bid' });

            });
            
        }
        catch(err){
            logHelper.logError(logger, 'postbid', 'Could not postbid on blockchain ledger: ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not postbid user' });
        }
    });
}

//get campaign details based on email id
function fetchCampaignlist(params) {
    console.log(params,'data in params for query method')
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'fetch campaign details', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'fetch campaign details', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid params' })}
            
             
         
            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }
            
            
            var getcusers = params.getcusers;
            if(!validate.isValidString(getcusers)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }    
            var reqSpec = getRequestSpec({functionName: 'readuser', args: ["getcusers"]});
            recursiveQuery({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'fetched campaign details', 'Successfully fetched login details', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: resp.body});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'getcusers', 'Could not fetch user details', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'fetchcampaigndetails', 'Could not fetch property ad ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });
      }
    });
}
    function fetchActiveCampaignlist(params) {
    console.log(params,'data in params for query method')
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'fetch campaign details', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'fetch campaign details', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid params' })}
            
             
         
            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }
            
            
            var getcusers = params.getcusers;
            if(!validate.isValidString(getcusers)){
                logHelper.logError(logger, 'fetch campaign details of user', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not fetch campaign details. Invalid user' })
            }    
            var reqSpec = getRequestSpec({functionName: 'readuser', args: ["getcusers"]});
            recursiveQuery({requestSpec: reqSpec, user: user})
            .then(function(resp){
                logHelper.logMessage(logger, 'fetched campaign details', 'Successfully fetched login details', resp.body);
                return resolve({statusCode: constants.SUCCESS, body: resp.body});
            })
            .catch(function(err){   
                logHelper.logError(logger, 'getcusers', 'Could not fetch user details', err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });

            });

        }
        catch(err){
            logHelper.logError(logger, 'fetch active campaigndetails', 'Could not fetch property ad ', err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not fetch campaign details' });
      }
    });
}
  
/**
Generates the request object for invoke and query calls using hfc
**/
function getRequestSpec(params){

        if(!validate.isValidJson(params)){
            logHelper.logError(logger, 'getRequestSpec', 'Invalid params');
            throw new Error("Invalid params");
        }

        var chaincodeID = config['chaincode']['id'];//util.getUserDefinedProperty(constants['BLOCKCHAIN_CHAINCODE'])['id'];
        if(!validate.isValidString(chaincodeID)){
            logHelper.logError(logger, 'getRequestSpec', 'Invalid chaincodeID');
            throw new Error("Invalid chaincodeID");
        }

        var functionName = params.functionName;
        if(!validate.isValidString(functionName)){
            logHelper.logError(logger, 'getRequestSpec', 'Invalid function name');
            throw new Error("Invalid function name");
        }

        var args = []
        
        if(validate.isValidArray(params.args)){
            args = params.args;
        }

   //     var attributes = ['username', 'role']
        
     //   if(validate.isValidArray(params.attributes)){
       //     attributes = params.attributes;
        

        var spec = {
            chaincodeID: chaincodeID,
            fcn: functionName,
            args: args
          //  attrs: attributes
        }

        return spec;
}


/**
Performs query operation on blockchain
**/
function doQuery(params){
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'doQuery', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'doQuery', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid params' })
            }

            var requestSpec = params.requestSpec;
            if(!validate.isValidJson(requestSpec)){
                logHelper.logError(logger, 'doQuery', 'Invalid requestSpec');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid requestSpec' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'doQuery', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform query. Invalid user' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(user)
            .then(function(member){
                
                var tx = member.query(requestSpec);
                tx.on('submitted', function() {
                    logHelper.logMessage(logger, 'doQuery','Transaction for query submitted');
                });

                tx.on('complete', function(data) {
                    try{
                        logHelper.logMessage(logger, 'doQuery', 'data in data.result ',data.result);
                        var buffer = new Buffer(data.result);
                         logHelper.logMessage(logger, 'doQuery', 'data in buffer.tostring ',buffer.toString());
                        var jsonResp = JSON.parse(buffer.toString());
                        return resolve({statusCode: constants.SUCCESS, body: jsonResp});
                    }
                    catch(err){
                        logHelper.logError(logger,'doQuery','Could not parse query response',err);
                        return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not parse query response ' });
                    }
                });

                tx.on('error', function (err) {
                    logHelper.logError(logger, 'doQuery', 'Could not perform query ',err);
                    return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
                   
                });
            })
            .catch(function(err){
                logHelper.logError(logger, 'doQuery', 'Could not perform query ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
            })

        }
        catch(err){
                logHelper.logError(logger, 'doQuery', 'Could not perform query ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform query ' });
        }
    });
  
}


/**
Performs invoke operation on blockchain
**/
function doInvoke(params){
    return new Promise(function(resolve, reject){
       
        try{
            logHelper.logEntryAndInput(logger, 'doInvoke', params);

            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'doInvoke', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid params' })
            }

            var requestSpec = params.requestSpec;
            if(!validate.isValidJson(requestSpec)){
                logHelper.logError(logger, 'doInvoke', 'Invalid requestSpec');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid requestSpec' })
            }

            var user = params.user;
            if(!validate.isValidString(user)){
                logHelper.logError(logger, 'doInvoke', 'Invalid user');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not perform invoke. Invalid user' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);
            

            chainAsync.getMemberAsync(user)
            .then(function(member){
                
                var tx = member.invoke(requestSpec);
                tx.on('submitted', function(data) {
                    logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke submitted ',requestSpec);
                    return resolve({statusCode: constants.SUCCESS, body: data});
                    
                });

                tx.on('complete', function(data) {
                    logHelper.logMessage(logger, 'doInvoke', 'Transaction for invoke complete ',data);
                    
                });

                tx.on('error', function (err) {
                    logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ',err);
                    return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
                   
                });
            })
            .catch(function(err){
                logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
            })

        }
        catch(err){
                logHelper.logError(logger, 'doInvoke', 'Could not perform invoke ',err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not perform invoke ' });
        }
    });
  
}

/*Performs register on Blockchain CA*/
function doRegister(params) {
    return new Promise(function(resolve, reject){
        
        var username;
        try{
            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'registerUser', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid params' })
            }

            username = params.username;
            if(!validate.isValidString(username)){
                logHelper.logError(logger, 'registerUser', 'Invalid username');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid username' })
            }

            var affiliation = params.affiliation;
            if(!validate.isValidString(affiliation)){
                logHelper.logError(logger, 'registerUser', 'Invalid affiliation');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not register user. Invalid affiliation' })
            }

            var roles = params.roles;
            if(!validate.isValidArray(roles)){
                roles = ['client'];
            }

            var enrollsecret
            var chain = bcNetwork.getChain();
            var reg = chain.getRegistrar();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                var memberAsync = Promise.promisifyAll(member);
                
                    var registrationRequest = {
                        enrollmentID: username,
                        attributes: [
                            {name: 'role', value: affiliation},
                            {name: 'username', value: username}
                        ],
                        affiliation: 'group1',
                        registrar: reg,
                        roles: roles
                        
                    };
                    
                return memberAsync.registerAsync(registrationRequest);
            })
            .then(function(enrollsec){
                logHelper.logMessage(logger, 'registerUser', 'Successfully registered user on blockchain: '+username);
                enrollsecret = enrollsec;
                return resolve({statusCode: constants.SUCCESS, body: {password: enrollsecret}});
                
            })
            .catch(function(err){
                logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
            })
        }
        catch(err){
            logHelper.logError(logger, 'registerUser', 'Could not register user on blockchain: '+username, err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });
   
}

/**
Enroll user with the Blockchain CA
**/
function doLogin(params) {
    return new Promise(function(resolve, reject){

        try{
            logHelper.logMethodEntry(logger, 'doLogin');
            if(!validate.isValidJson(params)){
                logHelper.logError(logger, 'doLogin', 'Invalid params');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid params' })
            }

            var username = params.username;
            if(!validate.isValidString(username)){
                logHelper.logError(logger, 'doLogin', 'Invalid username');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid username' })
            }

            var password = params.password;
            if(!validate.isValidString(password)){
                logHelper.logError(logger, 'doLogin', 'Invalid account');
                return reject({statusCode: constants.INVALID_INPUT, body: 'Could not login user. Invalid password' })
            }

            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                var memberAsync = Promise.promisifyAll(member);
                return memberAsync.enrollAsync(password);
            })
            .then(function(crypto){
                logHelper.logMessage(logger, 'doLogin', 'Successfully logged in user on blockchain: '+username);
                return resolve({statusCode: constants.SUCCESS, body: crypto});
            })
            .catch(function(err){
                logHelper.logError(logger, 'doLogin', 'Could not login user on blockchain: '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not login user' });
            });

        }
        catch(err){
            logHelper.logError(logger, 'doLogin', 'Could not register user on blockchain: '+username, err);
            return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not register user' });
        }
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveRegister(params){
    if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doRegister(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveRegister', "Register Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            return recursiveRegister(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveLogin(params){
    if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doLogin(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveLogin', "Login Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            return recursiveLogin(params);
        });
    });
}


//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveInvoke(params){
    if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doInvoke(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retries Exhausted", err);
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            logHelper.logError(logger, 'recursiveInvoke', "Invoke Retry "+params.retryCounter, err)
            return recursiveInvoke(params);
        });
    });
}

//sometimes there is are issues while connecting to bluemix services at once.
// hence recursive functions are created with at maximum recurrance of 5
function recursiveQuery(params){
   if(!validate.isValid(params.retryCounter)){
        params.retryCounter = 0;
    }
    else{
        params.retryCounter = params.retryCounter + 1;
    }

    return doQuery(params).catch(function(err) {
        if(err.statusCode == constants.INVALID_INPUT || params.retryCounter > retryLimit){
            logHelper.logError(logger, 'recursiveQuery', "Query Retries Exhausted", err)
            return Promise.reject(err);
        }
        return Promise.delay(retryInterval).then(function(){
            logHelper.logError(logger, 'recursiveQuery', "Query Retry "+params.retryCounter, err)
            return recursiveQuery(params);
        });
    });
}

function isUserRegistered(params){
    return new Promise(function(resolve,reject){
        try{
            logHelper.logMethodEntry(logger,'isUserRegistered');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                return resolve({statusCode: constants.SUCCESS, body: member.isRegistered()});
            })
            .catch(function(err){
                logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user registration status' });
            });
        }
        catch(err){
             logHelper.logError(logger, 'isUserRegistered', 'Could not get user registration status '+username, err);
             return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user registration status' });
        }
    })
   
}

function isUserEnrolled(params){
    return new Promise(function(resolve,reject){
        try{
            logHelper.logMethodEntry(logger,'isUserEnrolled');
            var username = params.username;
            var chain = bcNetwork.getChain();
            var chainAsync = Promise.promisifyAll(chain);

            chainAsync.getMemberAsync(username)
            .then(function(member){
                return resolve({statusCode: constants.SUCCESS, body: member.isEnrolled()});
            })
            .catch(function(err){
                logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status '+username, err);
                return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user enrollment status' });
            });
        }
        catch(err){
             logHelper.logError(logger, 'isUserEnrolled', 'Could not get user enrollment status '+username, err);
             return reject({statusCode: constants.INTERNAL_SERVER_ERROR, body: 'Could not get user enrollment status' });
        }
    });
   
}

module.exports = {
    UserRegisteration: UserRegisteration,
    User_login: User_login,
    Create_Campaign:Create_Campaign,
    postbid:postbid,
    fetchCampaignlist:fetchCampaignlist,
    fetchActiveCampaignlist:fetchActiveCampaignlist,
    recursiveRegister: recursiveRegister,
    recursiveLogin: recursiveLogin,
    isUserEnrolled: isUserEnrolled,
    isUserRegistered: isUserRegistered
   };