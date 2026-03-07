# PYTHon-AI-for-Bharat

## Tech Stack

### Backend
<p>
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
</p>

### AWS Services
<p>
<img src="https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white"/>
<img src="https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"/>
<img src="https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white"/>
<img src="https://img.shields.io/badge/AWS_Amplify-FF9900?style=for-the-badge&logo=awsamplify&logoColor=white"/>
</p>

### Frontend
<img src="https://skillicons.dev/icons?i=react,html,css,js" />

### Tools
<img src="https://skillicons.dev/icons?i=git,vscode,docker" />

## 🏗 System Architecture

```mermaid
flowchart TD

A[Frontend<br>React / Simple UI] --> B[API Gateway<br>POST /ask]

B --> C[ask_legal Lambda<br>Python Backend]

C --> D[Generate Embedding<br>Titan Embeddings]

D --> E[Vector Search<br>DynamoDB Cosine Similarity]

E --> F[Claude 3 Haiku<br>Answer Generation]

F --> G[JSON Response Returned<br>to Frontend]
```