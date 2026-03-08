# PYTHon-AI-for-Bharat
# ⚖️ Legal AI Assistant for Bharat
### AI-Powered Legal Awareness System

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)
![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)
![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-FF9900?style=for-the-badge&logo=awsamplify&logoColor=white)
![Amazon Bedrock](https://img.shields.io/badge/Amazon_Bedrock-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Claude](https://img.shields.io/badge/Claude-3_Haiku-blue?style=for-the-badge)
![Titan](https://img.shields.io/badge/Titan-Embeddings-orange?style=for-the-badge)

---

# 📌 Overview

**Legal AI Assistant for Bharat** is an AI-powered legal awareness platform designed to make legal information accessible and understandable for citizens.

The system uses **Retrieval-Augmented Generation (RAG)** to retrieve relevant legal sections from a curated knowledge base and explain them in simple language using AI.

Instead of directly asking a language model to generate answers, the system **retrieves verified legal context first**, making responses **more reliable, transparent, and trustworthy**.

The backend is built on **AWS serverless architecture**, ensuring scalability, cost efficiency, and reliability.

---

# 🚀 Problem Statement

Legal knowledge is often difficult for ordinary citizens to understand due to:

- Complex legal language
- Scattered legal documentation
- Lack of contextual explanations
- Poor accessibility for non-experts

Most people cannot easily determine:

- their rights
- legal procedures
- the authorities responsible for action

This project aims to **bridge the gap between legal knowledge and citizens using AI**.

---

# 💡 Solution

Our system implements a **Retrieval-Augmented Generation (RAG) architecture**.

Instead of generating answers blindly, the system:

1. Retrieves the most relevant legal sections
2. Uses AI to explain those sections in simple language
3. Provides structured responses with rights, steps, and authorities

This ensures:

- reduced hallucination
- higher trust
- explainable AI outputs

---

# 🏗 System Architecture

The system uses a **serverless AWS architecture** combined with semantic search and AI reasoning.

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

# 🛠 Tech Stack

## Backend

<img src="https://skillicons.dev/icons?i=python,aws" />

- Python
- AWS Lambda
- Serverless architecture

---

## AI & Machine Learning

- **Amazon Titan Text Embeddings**
- **Anthropic Claude 3 Haiku**
- **Amazon Nova (Fallback Model)**
- Retrieval-Augmented Generation (RAG)
- Vector similarity search

---

## AWS Infrastructure

| Service | Role |
|------|------|
| Amazon S3 | Stores legal dataset |
| AWS Lambda | Serverless backend processing |
| Amazon Bedrock | AI model access |
| DynamoDB | Vector storage and cache |
| API Gateway | REST API endpoint |
| AWS Amplify | Frontend deployment |
| CloudWatch | Logging and monitoring |

---

# ⚙ Backend Summary

Our backend is a **retrieval-augmented legal awareness system built on AWS**.

When a user asks a legal question:

1. The system retrieves the most relevant legal sections from a curated dataset.
2. Only then does the AI explain those sections in simple language.

This **retrieval-first design reduces hallucinations and improves trust**.

The backend uses:

- Amazon Bedrock for embeddings and LLM inference
- AWS Lambda for serverless compute
- Amazon S3 for storing legal knowledge
- DynamoDB for vector search and caching
- API Gateway for exposing the `/ask` API

---

# 🤖 Models Used

### Primary Model
**Anthropic Claude 3 Haiku**

Used as the main explanation model to convert retrieved legal text into:

- plain language explanations
- rights and responsibilities
- actionable steps

---

### Fallback Model
**Amazon Nova**

If Claude fails or is unavailable, the system automatically switches to Nova to maintain reliability.

---

### Embedding Model
**Amazon Titan Text Embeddings**

Used to convert:

- legal chunks
- user queries

into vector representations for semantic search.

---

# ⚡ Backend Workflow

## 1. Legal Knowledge Base

A structured dataset (`processed_chunks.json`) contains curated Indian legal sections including:

- cybercrime
- fraud
- consumer rights
- women’s safety
- public safety

---

## 2. One-Time Embedding Generation

An `embed_loader` Lambda function runs once to:

- read legal chunks from S3
- generate embeddings using Titan
- store vectors in DynamoDB

This avoids repeated embedding computation.

---

## 3. Query Processing

When a user sends a request to `/ask`:

1. Backend checks query cache
2. If cached → response returned instantly
3. If not cached → query embedding generated
4. Cosine similarity search performed
5. Top legal sections retrieved

---

## 4. AI Explanation

Retrieved legal context is sent to the LLM with strict instructions:

- use only retrieved legal text
- do not invent information
- produce structured JSON output

Response includes:

- rights
- action steps
- authorities
- legal article references
- disclaimer

---

## 5. Query Caching

After generating a response, the backend stores it in DynamoDB.

If the same query appears again:

- no model call is needed
- response is served instantly

---

# ✨ Key Backend Features

### Retrieval-first design
The system retrieves legal sources before using AI.

### One-time embeddings
Legal chunks are embedded once and reused.

### Semantic search
Embedding-based similarity allows meaning-based search.

Example:

fraud  
scam  
cheating  
OTP misuse  

can match even if words differ.

---

### Query caching
Improves speed and reduces model cost.

### Fallback reliability
Automatic switch from Claude to Nova ensures uptime.

### Structured JSON output
Clean responses for frontend rendering.

### Source transparency
Responses can expose:

- cited article
- legal source
- retrieval score

---

# 🧠 Why AI is Needed

Legal text is difficult for citizens to interpret.

The AI layer helps:

- understand natural language questions
- map them to correct legal sections
- simplify complex legal language
- provide practical guidance

Without AI, users would see raw legal documents.

With AI, they receive **clear, actionable explanations**.

---

# 📂 Project Structure

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

# ☁ Deployment Steps

1. Upload legal dataset to **Amazon S3**
2. Run **embed_loader Lambda** to generate embeddings
3. Deploy **ask_legal Lambda**
4. Configure **API Gateway /ask endpoint**
5. Deploy frontend with **AWS Amplify**

---

# 🔮 Future Improvements

- multilingual legal assistance
- conversational AI interface
- expanded legal dataset
- real-time legal updates
- improved citation transparency

---

# 👩‍💻 Contributors

Team **PYTHon – AI for Bharat**

- Tanishka Shukla
- Team Members

---

# 📜 License

This project was developed for the **AI for Bharat Hackathon**.
