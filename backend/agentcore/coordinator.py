from strands import Agent
from strands.models import BedrockModel

from device_agent import get_agent
from energy_advisor_agent import get_energy_agent

_coordinator = None


def get_coordinator():

    global _coordinator

    if _coordinator is None:

        model = BedrockModel(
            model_id="amazon.nova-lite-v1:0"
        )

        _coordinator = Agent(
            model=model
        )

    return _coordinator


def route_request(prompt):

    coordinator = get_coordinator()

    decision = coordinator(
        f"""
        You are the VoltStream Coordinator Agent.

        Your job is to route user requests.

        Available agents:

        DEVICE:
        - Turn devices on/off
        - Device status
        - Device control
        - Appliance management

        ENERGY:
        - Energy consumption analysis
        - Electricity bill questions
        - Power usage recommendations
        - Energy saving advice
        - High power consuming devices

        Respond with ONLY one word:

        DEVICE

        or

        ENERGY

        User Request:
        {prompt}
        """
    )

    decision = str(decision).strip().upper()

    print(f"COORDINATOR DECISION: {decision}")

    if "DEVICE" in decision:

        print("ROUTING TO DEVICE AGENT")

        return get_agent()(
            f"""
            User Request:
            {prompt}
            """
        )

    print("ROUTING TO ENERGY ADVISOR")

    return get_energy_agent()(
        f"""
        User Request:
        {prompt}
        """
    )