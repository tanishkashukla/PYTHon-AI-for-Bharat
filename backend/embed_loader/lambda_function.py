import os, json, boto3
from decimal import Decimal

s3 = boto3.client("s3")
ddb = boto3.resource("dynamodb")
bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")

DATA_BUCKET = os.environ["DATA_BUCKET"]
DATA_KEY = os.environ["DATA_KEY"]
DDB_TABLE = os.environ["DDB_TABLE"]
JOB_TABLE = os.environ["JOB_TABLE"]
TITAN_MODEL_ID = os.environ["TITAN_MODEL_ID"]
ENABLE_EMBEDDINGS = os.environ.get("ENABLE_EMBEDDINGS", "false").lower() == "true"

emb_table = ddb.Table(DDB_TABLE)
job_table = ddb.Table(JOB_TABLE)

def titan_embed(text: str) -> list[float]:
    resp = bedrock.invoke_model(
        modelId=TITAN_MODEL_ID,
        contentType="application/json",
        accept="application/json",
        body=json.dumps({"inputText": text})
    )
    body = json.loads(resp["body"].read())
    return body["embedding"]

def to_decimal_list(vec: list[float]) -> list:
    return [Decimal(str(x)) for x in vec]

def already_done(job_id: str) -> bool:
    r = job_table.get_item(Key={"job_id": job_id})
    return "Item" in r

def mark_done(job_id: str, processed: int):
    job_table.put_item(Item={"job_id": job_id, "status": "DONE", "processed": processed})

def lambda_handler(event, context):
    if not ENABLE_EMBEDDINGS:
        return {
            "statusCode": 503,
            "body": json.dumps({
                "error": "Embeddings disabled. Set ENABLE_EMBEDDINGS=true after billing/model access is ready."
            })
        }

    job_id = "embed_processed_chunks_v1"
    if already_done(job_id):
        return {
            "statusCode": 200,
            "body": json.dumps({
                "message": "Already embedded earlier (job locked).",
                "job_id": job_id
            })
        }

    obj = s3.get_object(Bucket=DATA_BUCKET, Key=DATA_KEY)
    chunks = json.loads(obj["Body"].read())

    processed = 0
    for idx, c in enumerate(chunks):
        text = (c.get("text") or "").strip()
        if not text:
            continue

        chunk_id = (c.get("section") or f"chunk_{idx}").strip()
        vec = titan_embed(text)

        emb_table.put_item(Item={
            "chunk_id": chunk_id,
            "section": c.get("section", ""),
            "category": c.get("category", ""),
            "text": text,
            "vector": to_decimal_list(vec)
        })
        processed += 1

    mark_done(job_id, processed)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "processed": processed,
            "job_id": job_id
        })
    }
