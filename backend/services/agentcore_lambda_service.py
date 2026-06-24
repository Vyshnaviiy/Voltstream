import boto3
import json

lambda_client = boto3.client(
    "lambda",
    region_name="us-east-1"
)

FUNCTION_NAME = "voltstream-agentcore-proxy"


def invoke_agentcore(prompt):

    response = lambda_client.invoke(
        FunctionName=FUNCTION_NAME,
        InvocationType="RequestResponse",
        Payload=json.dumps(
            {
                "prompt": prompt
            }
        )
    )

    payload = json.loads(
        response["Payload"].read()
    )

    body = json.loads(
        payload.get(
            "body",
            "{}"
        )
    )

    # Remove unwanted XML tags
    response_text = body.get(
        "response",
        ""
    )

    response_text = (
        response_text
        .replace("<response>", "")
        .replace("</response>", "")
    )

    return {
        "statusCode": payload.get(
            "statusCode"
        ),
        "response": response_text,
        "sessionId": body.get(
            "sessionId"
        ),
        "requestId": body.get(
            "requestId"
        )
    }