from strands import Agent
from strands.models import BedrockModel

from services.agent_tools import (
    toggle_device,
    get_device_status,
    list_all_devices,
    toggle_multiple_devices
)

# Connect Strands to Amazon Bedrock
model = BedrockModel(
    model_id="amazon.nova-lite-v1:0"
)

# Create Agent
agent = Agent(
    model=model,
    tools=[
        toggle_device,
        get_device_status,
        list_all_devices,
        toggle_multiple_devices
    ]
)


def run_agent(user_input):

    try:

        response = agent(
            f"""
            You are VoltStream Device Agent.

            Rules:
            - Return plain text only.
            - No markdown.
            - No bullet points.
            - No emojis.
            - Keep responses under 1 sentence.
            - For device actions, simply confirm the result.

            User Request:
            {user_input}
            """
        )

        return {
            "trace": [
                "Agent received request",
                "Agent analyzed intent",
                "Agent selected tool",
                "Tool executed",
                "Response generated"
            ],
            "response": str(response)
        }

    except Exception as e:

        return {
            "trace": [
                "Agent execution failed"
            ],
            "response": str(e)
        }