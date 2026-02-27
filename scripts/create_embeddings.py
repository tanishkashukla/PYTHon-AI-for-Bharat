# ============================================
# PHASE 5 — CREATE EMBEDDINGS (AWS BEDROCK)
# ============================================

import boto3
import json
import time

print("\n🧠 Starting embedding generation...\n")

# --------------------------------------------
# 1. Create Bedrock Runtime Client
# --------------------------------------------
bedrock = boto3.client(
    service_name="bedrock-runtime",
    region_name="us-east-1"   # IMPORTANT: Bedrock region
)

# --------------------------------------------
# 2. Load processed chunks
# --------------------------------------------
with open("data/processed_chunks.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"✅ Loaded {len(data)} chunks\n")

# --------------------------------------------
# 3. Generate embeddings
# --------------------------------------------
for i, chunk in enumerate(data):

    print(f"Processing {i+1}/{len(data)} → {chunk['section']}")

    response = bedrock.invoke_model(
        modelId="amazon.titan-embed-text-v1",
        body=json.dumps({
            "inputText": chunk["text"]
        })
    )

    # Read response
    result = json.loads(response["body"].read())

    # Save embedding into chunk
    chunk["embedding"] = result["embedding"]

    # ⭐ VERY IMPORTANT: Prevent AWS throttling
    time.sleep(2)

# --------------------------------------------
# 4. Save embedded dataset
# --------------------------------------------
with open("data/embedded_chunks.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("\n✅ Embeddings created successfully!")
print("📁 Saved file → data/embedded_chunks.json\n")