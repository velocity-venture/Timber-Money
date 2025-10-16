#!/usr/bin/env python3
# verify_textract.py
import os
import boto3

REGION = os.getenv("AWS_REGION", "us-east-1")
TEST_PATH = "/home/runner/workspace/sample_receipt.png"  # change if your file is elsewhere

def main():
    if not os.path.exists(TEST_PATH):
        print("Missing test file:", TEST_PATH)
        return
    try:
        client = boto3.client("textract", region_name=REGION)
        with open(TEST_PATH, "rb") as f:
            resp = client.detect_document_text(Document={"Bytes": f.read()})
        blocks = resp.get("Blocks", [])
        lines = [b.get("Text", "") for b in blocks if b.get("BlockType") == "LINE"]
        print("SUCCESS: Textract returned", len(lines), "lines")
        print("\nExtracted text:")
        print("-" * 40)
        for line in lines:
            print(line)
        print("-" * 40)
    except Exception as e:
        print("ERROR:", e)

if __name__ == "__main__":
    main()
