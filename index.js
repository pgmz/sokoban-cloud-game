const ApiBuilder = require('claudia-api-builder'),
AWS = require('aws-sdk');
var api = new ApiBuilder(),
dynamoDb = new AWS.DynamoDB.DocumentClient();

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

  api.get('/start/new', function(request){

    var new_board = {"Game":false,"Board":{"Player":{"Sprite":"Right","PositionX":3,"PositionY":3},"Boxes":[{"Sprite":"0","PositionX":1,"PositionY":1},{"Sprite":"1","PositionX":5,"PositionY":5}],"Marker":[{"Sprite":"0","PositionX":0,"PositionY":0},{"Sprite":"0","PositionX":5,"PositionY":6}]}}

    var params = {
      TableName: "serverless-test",
      Item : {
        testId: request.context.authorizer.claims['cognito:username']+"-board",
        name: JSON.stringify(new_board)
      }
     };

     return dynamoDb.put(params).promise(); // returns dynamo result 
},
{ cognitoAuthorizer: 'cognitoAuth' })

module.exports = api;
