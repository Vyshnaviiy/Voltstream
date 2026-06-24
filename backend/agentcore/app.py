from bedrock_agentcore.runtime import BedrockAgentCoreApp

from coordinator import route_request
import re

app = BedrockAgentCoreApp()


def clean_response(text):

    text = re.sub(
        r"<thinking>.*?</thinking>",
        "",
        str(text),
        flags=re.DOTALL
    )

    #return text.strip()
    text = re.sub(
        r"</?response>",
        "",
        text,
        flags=re.DOTALL
    )

    return text.strip()


@app.entrypoint
def invoke(payload):

    prompt = payload.get(
        "prompt",
        "Hello"
    )

    result = route_request(prompt)

    return {
        "agent": result["agent"],
        "result": clean_response(
            result["response"]
        )
    }


if __name__ == "__main__":

    app.run()