from strands import Agent
from strands.models import BedrockModel

from agentcore.agent_tools import (
    toggle_device,
    get_device_status,
    list_all_devices,
    toggle_multiple_devices
)

_agent = None


def get_agent():

    global _agent

    if _agent is None:

        model = BedrockModel(
            model_id="amazon.nova-lite-v1:0"
        )

        _agent = Agent(
            model=model,
            tools=[
                toggle_device,
                get_device_status,
                list_all_devices,
                toggle_multiple_devices
            ]
        )

    return _agent