# =====================================
# PHASE 4 — CHUNK BUILDER
# Converts laws.txt → processed_chunks.json
# =====================================

import json
import re

print("\n🔧 Starting Chunk Builder...\n")

# ---------------------------
# LOAD RAW DATA
# ---------------------------
with open("data/raw/laws.txt", "r", encoding="utf-8") as f:
    text = f.read()

# ---------------------------
# SPLIT INTO DOCUMENTS
# ---------------------------
sections = text.split("--------------------------------------------------")

docs = [doc.strip() for doc in sections if doc.strip() != ""]

chunks = []

# ---------------------------
# EXTRACT STRUCTURED DATA
# ---------------------------
for doc in docs:

    section_match = re.search(r"SECTION:\s*(.*)", doc)
    category_match = re.search(r"CATEGORY:\s*(.*)", doc)

    if not section_match or not category_match:
        continue

    section = section_match.group(1).strip()
    category = category_match.group(1).strip()

    # remove metadata lines from text
    content = re.sub(r"SECTION:.*", "", doc)
    content = re.sub(r"CATEGORY:.*", "", content).strip()

    chunk = {
        "section": section,
        "category": category,
        "text": content
    }

    chunks.append(chunk)

# ---------------------------
# SAVE JSON FILE
# ---------------------------
output_path = "data/processed_chunks.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(chunks, f, indent=4, ensure_ascii=False)

print("✅ Chunk file created successfully!")
print(f"Total chunks created: {len(chunks)}")
print(f"Saved at: {output_path}\n")