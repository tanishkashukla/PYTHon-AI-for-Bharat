# PYTHon-AI-for-Bharat
# Legal AI Assistant for Bharat

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![Amazon DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-FF9900?style=for-the-badge&logo=awsamplify&logoColor=white)
![Amazon Bedrock](https://img.shields.io/badge/Amazon_Bedrock-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-3_Haiku-blue?style=for-the-badge)
![Amazon Titan](https://img.shields.io/badge/Titan-Embeddings-orange?style=for-the-badge)

---

# Overview

Legal AI Assistant for Bharat is an AI-powered legal awareness system designed to help citizens understand their rights and legal procedures in simple language.

The system uses Retrieval-Augmented Generation (RAG) to retrieve relevant legal information from a curated knowledge base and then uses AI models to explain the retrieved legal text in clear and understandable terms.

The backend is built on AWS serverless infrastructure to ensure scalability, reliability, and cost efficiency.

Instead of allowing the language model to generate answers freely, the system first retrieves verified legal context before asking the model to explain it. This approach reduces hallucinations and increases trust in the generated responses.

---

# Problem Statement

Legal information is often difficult for ordinary citizens to access and understand due to complex language and fragmented documentation.

Most people struggle to determine:

- their legal rights  
- correct legal procedures  
- which authorities to contact  
- what actions to take during legal situations  

Traditional search systems return raw legal text which is difficult for non-experts to interpret.

---

# Solution

This project introduces an AI-assisted legal awareness system that combines semantic search and language models.

The system works by:

1. Retrieving the most relevant legal sections from a curated dataset
2. Using AI models to interpret the retrieved information
3. Producing clear and structured explanations for the user

This retrieval-first architecture ensures that the AI responses remain grounded in actual legal text.

---

# System Architecture

The system uses a serverless AWS architecture to process legal queries.

```mermaid
flowchart TD

User[User Query] --> APIGW[API Gateway /ask]

APIGW --> Lambda[ask_legal Lambda]

Lambda --> CacheCheck{Check Query Cache}

CacheCheck -->|Cache Hit| ReturnFast[Return Cached Response]

CacheCheck -->|Cache Miss| Embed[Titan Embedding]

Embed --> VectorSearch[DynamoDB Vector Search]

VectorSearch --> TopChunks[Retrieve Top Legal Chunks]

TopChunks --> Claude[Claude 3 Haiku]

Claude -->|If Failure| Nova[Amazon Nova Fallback]

Claude --> Response[Generate Structured Response]

Nova --> Response

Response --> CacheStore[Store Response in Cache]

CacheStore --> ReturnUser[Return JSON Response to User]

ReturnFast --> ReturnUser
```

---

# Tech Stack

## Backend

<img src="https://img.shields.io/badge/Python_Backend-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/AWS_Lambda-Serverless_Runtime-FF9900?style=for-the-badge&logo=awslambda&logoColor=white"/>
<img src="https://img.shields.io/badge/Serverless-Architecture-FF4F8B?style=for-the-badge&logo=serverless&logoColor=white"/>

The backend is implemented in Python and runs as a serverless architecture using AWS Lambda.

---

## Cloud Infrastructure

<img src="https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon_DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon_API_Gateway-FF4F8B?style=for-the-badge&logo=amazonapigateway&logoColor=white"/>
<img src="https://img.shields.io/badge/AWS_Amplify-FF9900?style=for-the-badge&logo=awsamplify&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon_CloudWatch-FF9900?style=for-the-badge&logo=amazoncloudwatch&logoColor=white"/>

| Service | Role |
|------|------|
| Amazon S3 | Stores legal dataset |
| AWS Lambda | Executes backend logic |
| DynamoDB | Stores embeddings and query cache |
| API Gateway | Exposes the /ask API |
| AWS Amplify | Hosts frontend |
| CloudWatch | Logging and monitoring |

---

## AI and Machine Learning

<img src="https://img.shields.io/badge/Amazon_Bedrock-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon_Titan_Text_Embeddings-orange?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Claude_3_Haiku-Anthropic-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Amazon_Nova-Fallback_Model-green?style=for-the-badge"/>

The AI layer uses Amazon Bedrock to access foundation models.

Primary models used:

Anthropic Claude 3 Haiku  
Used for explaining retrieved legal sections in plain language.

Amazon Nova  
Used as a fallback generation model to maintain system reliability.

Amazon Titan Text Embeddings  
Used for converting legal chunks and user queries into vector embeddings.

---

# Backend Summary

Our backend is a retrieval-augmented legal awareness system built on AWS.

When a user asks a legal question, the system first retrieves the most relevant legal sections from a curated legal knowledge base. Only after retrieval does the system use an LLM to explain those sections in simple language.

This retrieval-first design reduces hallucinations and ensures the response remains grounded in legal sources.

---

# Backend Workflow

## Legal Knowledge Base

The system uses a structured dataset called processed_chunks.json that contains curated legal information such as:

- cybercrime
- fraud
- consumer protection
- women's safety
- public safety laws

---

## One-Time Embedding Generation

A Lambda function called embed_loader generates embeddings for the legal dataset.

The function:

- reads legal chunks from Amazon S3
- generates embeddings using Amazon Titan
- stores embeddings in DynamoDB

This process runs only once to reduce repeated computation and cost.

---

## Query Processing

When a user submits a question:

1. The backend checks whether the query already exists in cache.
2. If cached, the stored answer is returned immediately.
3. If not cached, the query is converted into an embedding.
4. Vector similarity search is performed against stored embeddings.
5. The most relevant legal sections are retrieved.

---

## AI Explanation

The retrieved legal context is passed to the language model with strict instructions:

- use only the provided legal context
- do not invent external information
- generate structured JSON output

The response includes:

- rights
- recommended actions
- authority information
- legal article references
- disclaimer

---

## Query Caching

After generating a response, the backend stores it in DynamoDB.

Future identical queries are served directly from cache without calling the model again, improving speed and reducing cost.

---

# Key Backend Features

Retrieval-first architecture  
Legal sections are retrieved before AI generation.

One-time embeddings  
Legal dataset embeddings are generated once and reused.

Semantic search  
Embedding-based similarity enables meaning-based search rather than keyword matching.

Query caching  
Improves response speed and reduces model usage.

Fallback model reliability  
Automatically switches to Amazon Nova if Claude is unavailable.

Structured JSON output  
Ensures consistent responses for frontend rendering.

Source transparency  
Responses can expose retrieved legal sources and article references.

---

# Project Structure

```
legal-ai-assistant/
│
├── backend/
│   ├── embed_loader/
│   │   └── lambda_function.py
│   ├── ask_legal/
│   │   └── lambda_function.py
│   └── requirements.txt
│
├── data/
│   └── processed_chunks.json
│
├── frontend/
│
├── docs/
│   ├── architecture.png
│   └── demo_script.md
│
├── README.md
└── deploy_steps.md
```

---

# Deployment Steps

1. Upload legal dataset to Amazon S3  
2. Run embed_loader Lambda to generate embeddings  
3. Deploy ask_legal Lambda function  
4. Configure API Gateway /ask endpoint  
5. Deploy frontend using AWS Amplify  

---

# Future Improvements

- multilingual legal support  
- conversational legal assistant  
- larger legal knowledge base  
- real-time legal updates  
- improved citation transparency  

---

# Contributors

Team PYTHon – AI for Bharat Hackathon

Tanishka Shukla  
Team Members

---

# License

This project was developed for educational and hackathon purposes.
