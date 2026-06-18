from strands import tool

from mock_data import (
    devices,
    billing_summary,
    live_data
)


@tool
def get_high_consumption_devices():
    """
    Returns top power consuming devices.
    """

    sorted_devices = sorted(
        devices,
        key=lambda x: x["power_consumption"],
        reverse=True
    )

    return sorted_devices[:3]


@tool
def get_bill_prediction():
    """
    Returns billing information.
    """

    return billing_summary


@tool
def get_energy_summary():
    """
    Returns current energy usage summary.
    """

    return live_data


@tool
def recommend_savings():
    """
    Returns energy saving recommendations.
    """

    return [
        "Reduce Water Heater usage",
        "Charge EV during off-peak hours",
        "Limit Air Conditioner runtime",
        "Turn off idle devices",
        "Monitor high consumption appliances"
    ]