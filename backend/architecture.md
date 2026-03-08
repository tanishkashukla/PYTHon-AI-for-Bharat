# KnowYourRightsAI - AWS Serverless Backend Architecture

## 1. Architecture Overview

The backend is built using a fully serverless architecture on AWS, ensuring high scalability, low cost, and minimal maintenance.

### Flow:
1. **API Gateway**: Receives the `POST /chat` request from the frontend.
2. **Lambda (Chat Handler)**:
   - Validates input.
   - Uses **Amazon Translate** to convert Hindi queries to English.
   - Categorizes the query using keyword mapping or a small LLM call.
   - Fetches the relevant legal context (JSON chunk) from **Amazon S3**.
   - Calls **Amazon Bedrock (Claude 3 Haiku)** with a strict system prompt and the context.
   - Uses **Amazon Polly** to generate an MP3 of the response.
   - Stores the session interaction in **DynamoDB**.
3. **S3**: Stores the legal knowledge base in small, categorized JSON chunks.
4. **DynamoDB**: Stores conversation history for session management.

---

## 2. IAM Role Requirements

The Lambda function requires a role with the following managed policies:
- `AmazonS3ReadOnlyAccess`
- `AmazonDynamoDBFullAccess`
- `TranslateReadOnly`
- `AmazonPollyFullAccess`
- `AmazonBedrockFullAccess`

---

## 3. DynamoDB Schema

**Table Name**: `KnowYourRightsSessions`
- **Partition Key**: `session_id` (String)
- **Sort Key**: `timestamp` (Number)
- **Attributes**:
  - `role`: "user" | "assistant"
  - `message`: String
  - `structured_response`: Map (JSON)

---

## 4. Deployment Steps

1. **S3 Setup**:
   - Create a bucket `know-your-rights-chunks`.
   - Upload the JSON files from the `chunks/` folder.
2. **DynamoDB Setup**:
   - Create the `KnowYourRightsSessions` table.
3. **Lambda Setup**:
   - Create a Node.js 20.x Lambda.
   - Set environment variables:
     - `CHUNKS_BUCKET`: Name of your S3 bucket.
     - `SESSIONS_TABLE`: Name of your DynamoDB table.
4. **API Gateway**:
   - Create a REST API.
   - Create a `POST /chat` resource.
   - Enable CORS.
   - Integrate with the Lambda function.

---

## 5. Security Best Practices

- **CORS**: Restrict `Access-Control-Allow-Origin` to your frontend domain.
- **Input Validation**: Use a library like `ajv` or `zod` to validate the incoming JSON.
- **Throttling**: Enable API Gateway throttling to prevent DDoS.
- **Least Privilege**: Ensure the IAM role only has access to specific S3 buckets and DynamoDB tables.
