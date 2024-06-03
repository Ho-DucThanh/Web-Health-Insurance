const DynamoDBClient = require("aws-sdk/client-dynamodb");
const DynamoDBDocumentClient = require("aws-sdk/lib-dynamodb");

const dbClient = new DynamoDBClient({
  region: "us-east-1",
  Credential: {
    accessKeyId: "",
    secretAccessKey: "",
  }
});
