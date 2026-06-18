from strands import Agent
from strands.models import BedrockModel

from energy_advisor_tools import (
    get_high_consumption_devices,
    get_bill_prediction,
    get_energy_summary,
    recommend_savings
)

_energy_agent = None


def get_energy_agent():

    global _energy_agent

    if _energy_agent is None:

        model = BedrockModel(
            model_id="amazon.nova-lite-v1:0"
        )

        _energy_agent = Agent(
            model=model,
            tools=[
                get_high_consumption_devices,
                get_bill_prediction,
                get_energy_summary,
                recommend_savings
            ]
        )

    return _energy_agent