const ApiBuilder = require('claudia-api-builder'),
AWS = require('aws-sdk');
var api = new ApiBuilder(),
dynamoDb = new AWS.DynamoDB.DocumentClient();
const gameLogic = require('./game-logic');

api.registerAuthorizer('cognitoAuth', {
    providerARNs: ['arn:aws:cognito-idp:us-east-1:914985308346:userpool/us-east-1_Xxsmk7ZLQ']
  });

api.get('/start', function(request){

    //Create a new board for this player! by it's me...
    var params = {
      TableName: "serverless-test",
      Key : {
        testId: request.context.authorizer.claims['cognito:username']+"-board"
      }
     };
  
    return dynamoDb.get(params).promise().then(response => {
        return JSON.parse(response.Item.name);
    },
    function(err){
      //If unsuccessful, return why it failed
      var res_body = {
        "fileName" : payload["fileName"],
        "Error" : {
           "Error" : err["code"],
           "Description" : err["message"]
        }
      };
  
      return res_body;
  
    })
  
  },
  { cognitoAuthorizer: 'cognitoAuth' });

  api.get('/start/new/{level}', function(request){

    //get the desired level
    var getparams = {
      TableName: "sokoban-level",
      Key : {
        level: request.pathParams.level
      }
     };

     return dynamoDb.get(getparams).promise().then(response => {

      var params = {
        TableName: "serverless-test",
        Item : {
          testId: request.context.authorizer.claims['cognito:username']+"-board",
          name: JSON.stringify({"Game" : false, "Board" : JSON.parse(response.Item.board).Board, "Movements" : 0, "Points" : 0})
        }
       };
        return dynamoDb.put(params).promise().then(function(response){
          return params.name;
        }); // returns dynamo result 
     }); // returns dynamo result 
},
{ cognitoAuthorizer: 'cognitoAuth' })


api.post('/clear', function(request){

  //Create a new board for this player! by it's me...
  var params = {
    TableName: "serverless-test",
    Key : {
      testId: request.context.authorizer.claims['cognito:username']+"-board"
      }
   };

  return dynamoDb.delete(params).promise().then(response => {
      return response;
  })

},
{ cognitoAuthorizer: 'cognitoAuth' });

api.get('/move/{action}', function (request) {

  var action = request.pathParams.action;
  //Let me get your state...
  var params = {
    TableName: "serverless-test",
    Key : {
      testId: request.context.authorizer.claims['cognito:username']+"-board"
    }
   };

  return dynamoDb.get(params).promise().then(response => {
    //TODO validations
    var new_board = gameLogic.updateGame(JSON.parse(response.Item.name), action);

    var paramsChanged = {
      TableName: "serverless-test",
      Item : {
        testId: request.context.authorizer.claims['cognito:username']+"-board",
        name: JSON.stringify(new_board)
      }
    };

    return dynamoDb.put(paramsChanged).promise().then(response => {
      return new_board;
    });
  },
  err => {
    return err + "Un error";
  })

},
{ cognitoAuthorizer: 'cognitoAuth' });

api.post('/score', function (request) {

  var params = {
    TableName: "sokoban-leaderboard",
    Item : {
      username: request.context.authorizer.claims['cognito:username'],
      level: request.body.Level,
      score : request.body.Score
    }
  };

  return dynamoDb.put(params).promise().then(response => {
    return response;
  });
},
{ cognitoAuthorizer: 'cognitoAuth' });

module.exports = api;
