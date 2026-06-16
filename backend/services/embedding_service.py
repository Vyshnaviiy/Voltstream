import boto3
import json

client = boto3.client(
    "bedrock-runtime",
    region_name="us-east-1"
)

EMBED_MODEL = "amazon.titan-embed-text-v2:0"

def generate_embedding(text):

    body = json.dumps({
        "inputText": text
    })

    response = client.invoke_model(
        modelId=EMBED_MODEL,
        body=body
    )

    result = json.loads(
        response["body"].read()
    )

    return result["embedding"]