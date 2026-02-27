# =====================================
# LEGAL AI PROJECT — FINAL EDA SCRIPT
# =====================================

import re

print("\n🔎 Starting Exploratory Data Analysis...\n")

# ---------------------------
# LOAD DATA
# ---------------------------
with open("data/raw/laws.txt", "r", encoding="utf-8") as f:
    text = f.read()

print("✅ Dataset Loaded")

# ---------------------------
# BASIC INFO
# ---------------------------
print("\n📊 BASIC INFO")
print("----------------------")
print("Total characters:", len(text))
print("Total words:", len(text.split()))

# ---------------------------
# SPLIT DOCUMENTS
# ---------------------------
sections = text.split("--------------------------------------------------")

# remove empty chunks
docs = [doc.strip() for doc in sections if doc.strip() != ""]

print("\n📚 TOTAL LAW SECTIONS:", len(docs))

# ---------------------------
# SECTION NAMES
# ---------------------------
section_names = re.findall(r"SECTION:\s*(.*)", text)

print("\n🧾 Sections:")
for name in section_names:
    print("•", name)

# ---------------------------
# CATEGORIES
# ---------------------------
categories = set(re.findall(r"CATEGORY:\s*(.*)", text))

print("\n🏷 Categories:")
for cat in categories:
    print("•", cat)

# ---------------------------
# DOCUMENT LENGTH CHECK
# ---------------------------
print("\n📏 DOCUMENT LENGTH ANALYSIS")
print("----------------------")

for i, doc in enumerate(docs):
    length = len(doc)

    if length < 200:
        status = "⚠ Too Short"
    elif length > 2000:
        status = "⚠ Too Long"
    else:
        status = "✅ Good"

    print(f"Doc {i+1}: {length} characters → {status}")

# ---------------------------
# STRUCTURE VALIDATION
# ---------------------------
print("\n🧪 STRUCTURE VALIDATION")
print("----------------------")

errors = False

for i, doc in enumerate(docs):
    if "SECTION:" not in doc:
        print(f"⚠ Missing SECTION in Doc {i+1}")
        errors = True

    if "CATEGORY:" not in doc:
        print(f"⚠ Missing CATEGORY in Doc {i+1}")
        errors = True

if not errors:
    print("✅ All documents correctly structured")

print("\n✅ EDA COMPLETED SUCCESSFULLY\n")