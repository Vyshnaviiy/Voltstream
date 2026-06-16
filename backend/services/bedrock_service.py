import boto3

client = boto3.client(
    "bedrock-runtime",
    region_name="us-east-1"
)

MODEL_ID = "amazon.nova-lite-v1:0"

def generate_response(prompt):

    message = f"""
    You are a General AI Assistant.
    Rules: 
    - repsond in a concise and clear manner. within 50 to 100 words.
    Context:
    {prompt}
    """

    response = client.converse(
        modelId=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "text": message
                    }
                ]
            }
        ],
        inferenceConfig={
            "maxTokens": 150,
            "temperature": 0.3
        }
    )

    output = response["output"]["message"]["content"][0]["text"]

    return output