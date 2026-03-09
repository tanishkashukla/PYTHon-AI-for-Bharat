import os, json, boto3, math, hashlib, time
from botocore.exceptions import ClientError
from decimal import Decimal

bedrock = boto3.client("bedrock-runtime", region_name="us-east-1")
ddb = boto3.resource("dynamodb")

DDB_TABLE = os.environ["DDB_TABLE"]
CACHE_TABLE = os.environ["CACHE_TABLE"]
TITAN_MODEL_ID = os.environ["TITAN_MODEL_ID"]
CLAUDE_MODEL_ID = os.environ["CLAUDE_MODEL_ID"]
FALLBACK_MODEL_ID = os.environ["FALLBACK_MODEL_ID"]
ENABLE_BEDROCK = os.environ.get("ENABLE_BEDROCK", "false").lower() == "true"

emb_table = ddb.Table(DDB_TABLE)
cache_table = ddb.Table(CACHE_TABLE)

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def hash_query(query: str) -> str:
    return hashlib.sha256(query.strip().lower().encode("utf-8")).hexdigest()

def get_cached_response(query: str):
    query_hash = hash_query(query)
    resp = cache_table.get_item(Key={"query_hash": query_hash})
    return resp.get("Item")

def convert_floats(obj):
    if isinstance(obj, float):
        return Decimal(str(obj))
    elif isinstance(obj, dict):
        return {k: convert_floats(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_floats(v) for v in obj]
    return obj

def make_json_safe(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    elif isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_safe(v) for v in obj]
    return obj

def put_cached_response(query: str, response_obj: dict):
    query_hash = hash_query(query)
    safe_response = convert_floats(response_obj)

    cache_table.put_item(Item={
        "query_hash": query_hash,
        "query": query,
        "response": safe_response,
        "created_at": int(time.time())
    })

def titan_embed(text: str) -> list[float]:
    resp = bedrock.invoke_model(
        modelId=TITAN_MODEL_ID,
        contentType="application/json",
        accept="application/json",
        body=json.dumps({"inputText": text})
    )
    body = json.loads(resp["body"].read())
    return body["embedding"]

def cosine(a, b) -> float:
    dot = 0.0
    na = 0.0
    nb = 0.0
    for x, y in zip(a, b):
        dot += x * y
        na += x * x
        nb += y * y
    if na == 0 or nb == 0:
        return 0.0
    return dot / (math.sqrt(na) * math.sqrt(nb))

def build_context(contexts: list[dict]) -> str:
    return "\n\n".join(
        [f"[{c['section']} | {c['category']}]\n{c['text']}" for c in contexts]
    )

def parse_json_or_wrap(text: str, article_fallback: str = "") -> dict:
    try:
        return json.loads(text)
    except Exception:
        return {
            "rights": [],
            "steps": [text],
            "authority": {"name": "", "phone": "", "website": ""},
            "disclaimer": "This is legal awareness only, not legal advice.",
            "article_cited": article_fallback
        }

def call_claude(user_query: str, contexts: list[dict]) -> dict:
    ctx = build_context(contexts)

    system_prompt = (
        "You are KnowYourRightsAI, an AI legal awareness assistant designed to help Indian citizens understand their legal rights in simple and clear language. "
        "Your purpose is to spread legal awareness and provide educational information about laws, rights, and procedures in India. "
        "You must NOT provide personalized legal advice, legal strategies, or opinions. "
        "Explain legal rights in a simple, structured, and easy-to-understand way so that non-lawyers can understand them. "
        "Always rely ONLY on the provided legal context and do not generate information outside that context. "
        "If the context does not contain enough information to answer the question, clearly state that the available legal context is insufficient. "
        "Do not fabricate laws, legal articles, or authorities. "
        "Ensure the response is concise, factual, and strictly related to Indian legal awareness. "
        "Return ONLY valid JSON in this exact schema: "
        '{ "rights": [], "steps": [], "authority": {"name":"","phone":"","website":""}, '
        '"disclaimer":"This is legal awareness only, not legal advice.", '
        '"article_cited":"" }'
    )

    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 650,
        "temperature": 0.2,
        "system": system_prompt,
        "messages": [{
            "role": "user",
            "content": f"Context:\n{ctx}\n\nQuestion:\n{user_query}"
        }]
    }

    resp = bedrock.invoke_model(
        modelId=CLAUDE_MODEL_ID,
        contentType="application/json",
        accept="application/json",
        body=json.dumps(make_json_safe(body))
    )
    out = json.loads(resp["body"].read())
    return json.loads(out["content"][0]["text"])

def call_nova_fallback(user_query: str, contexts: list[dict]) -> dict:
    ctx = build_context(contexts)

    payload = {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "text": (
                            "You are KnowYourRightsAI, a legal awareness assistant for Indian citizens. "
                            "Use ONLY the legal context below. Do NOT give legal advice. "
                            "Return ONLY valid JSON with keys: rights, steps, authority, disclaimer, article_cited.\n\n"
                            f"Context:\n{ctx}\n\nQuestion:\n{user_query}"
                        )
                    }
                ]
            }
        ],
        "inferenceConfig": {
            "maxTokens": 650,
            "temperature": 0.2
        }
    }

    resp = bedrock.invoke_model(
        modelId=FALLBACK_MODEL_ID,
        contentType="application/json",
        accept="application/json",
        body=json.dumps(make_json_safe(payload))
    )
    out = json.loads(resp["body"].read())

    text = ""
    if "output" in out and "message" in out["output"]:
        parts = out["output"]["message"].get("content", [])
        if parts and "text" in parts[0]:
            text = parts[0]["text"]
    elif "results" in out:
        text = out["results"][0]["outputText"]
    else:
        text = json.dumps(make_json_safe(out))

    article = contexts[0]["section"] if contexts else ""
    return parse_json_or_wrap(text, article)

def retrieve_top_contexts(query: str, k: int = 3) -> tuple[list[dict], float]:
    qvec = titan_embed(query)
    items = emb_table.scan().get("Items", [])

    scored = []
    for it in items:
        vec = [float(x) for x in it["vector"]]
        scored.append((cosine(qvec, vec), it))

    scored.sort(key=lambda x: x[0], reverse=True)
    top = [it for s, it in scored[:k]]
    best_score = scored[0][0] if scored else 0.0
    return top, best_score

def lambda_handler(event, context):
    try:
        if "body" in event:
            body = event["body"]
            if isinstance(body, str):
                body = json.loads(body)
        else:
            body = event

        q = (body.get("query") or "").strip()
        if not q:
            return {
                "statusCode": 400,
                "headers": CORS_HEADERS,
                "body": json.dumps({"error": "query is required"})
            }

        # 1) Cache check
        cached = get_cached_response(q)
        if cached and "response" in cached:
            cached_resp = cached["response"]
            cached_resp["model_used"] = "cache"
            cached_resp["cache_hit"] = True
            cached_resp = make_json_safe(cached_resp)
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps(cached_resp)
            }

        if not ENABLE_BEDROCK:
            return {
                "statusCode": 503,
                "headers": CORS_HEADERS,
                "body": json.dumps({
                    "error": "Bedrock disabled. Set ENABLE_BEDROCK=true after billing/model access is ready."
                })
            }

        # 2) Retrieval
        top, best_score = retrieve_top_contexts(q, k=3)

        if best_score >= 0.75:
            top = top[:1]
        elif best_score >= 0.4:
            top = top[:2]
        else:
            top = top[:3]

        sources = [
            {"section": c["section"], "category": c["category"]}
            for c in top
        ]

        if not top or best_score < 0.15:
            response_obj = {
                "rights": [],
                "steps": [],
                "authority": {"name": "", "phone": "", "website": ""},
                "disclaimer": "No relevant legal information found in provided sources. This is legal awareness only, not legal advice.",
                "article_cited": "",
                "model_used": "none",
                "cache_hit": False,
                "retrieval_score": best_score
            }
            put_cached_response(q, response_obj)
            return {
                "statusCode": 200,
                "headers": CORS_HEADERS,
                "body": json.dumps(make_json_safe(response_obj))
            }

        # 3) Try Claude first, then Nova fallback
        response_obj = None

        try:
            response_obj = call_claude(q, top)
            response_obj["model_used"] = "claude"
            response_obj["cache_hit"] = False
            response_obj["retrieval_score"] = best_score
            response_obj["sources_used"] = sources

        except ClientError as e:
            try:
                response_obj = call_nova_fallback(q, top)
                response_obj["model_used"] = "nova_fallback"
                response_obj["cache_hit"] = False
                response_obj["fallback_reason"] = str(e)
                response_obj["retrieval_score"] = best_score
                response_obj["sources_used"] = sources
            except Exception as fallback_error:
                return {
                    "statusCode": 500,
                    "headers": CORS_HEADERS,
                    "body": json.dumps({
                        "error": "Both primary and fallback models failed",
                        "details": str(fallback_error)
                    })
                }

        # 4) Cache store
        put_cached_response(q, response_obj)

        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps(make_json_safe(response_obj))
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "error": "Internal server error",
                "details": str(e)
            })
        }

