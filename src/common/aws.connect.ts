import { fromEnv } from "@aws-sdk/credential-providers"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { S3Client } from "@aws-sdk/client-s3"

const awsConfig = {
    region: process.env.AWS_DEFAULT_REGION,
    credentials: fromEnv()
}
const client = new DynamoDBClient(awsConfig)

export const dynamoClient = DynamoDBDocumentClient.from(client)
export const s3Client = new S3Client(awsConfig)
