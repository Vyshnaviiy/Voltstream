from coordinator import route_request
import re


def clean_response(text):

    text = re.sub(
        r"<thinking>.*?</thinking>",
        "",
        str(text),
        flags=re.DOTALL
    )

    return text.strip()


def run_agent(user_input):

    try:

        result = route_request(user_input)

        return {
            "trace": [
                "Agent received request",
                "Coordinator selected agent",
                "Agent executed",
                "Response generated"
            ],
            "agent": result["agent"],
            "response": clean_response(
                result["response"]
            )
        }

    except Exception as e:

        return {
            "trace": [
                "Agent execution failed"
            ],
            "agent": "Unknown",
            "response": str(e)
        }