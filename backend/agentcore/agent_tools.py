import requests
from strands.tools import tool

from mock_data import devices


@tool
def get_device_status(device_name: str):
    """
    Get the current status of a device.
    """

    for device in devices:

        if device["name"].lower() == device_name.lower():

            return {
                "name": device["name"],
                "status": device["status"]
            }

    return {
        "error": "Device not found"
    }

@tool
def toggle_device(
    device_name: str,
    state: str
):
    """
    Turn ONE device ON or OFF.
    Use only when the user refers to a single device.
    """

    for device in devices:

        if device["name"].lower() == device_name.lower():

            requests.patch(
                f"http://127.0.0.1:8000/api/v1/devices/{device['id']}",
                json={
                    "status": state.upper()
                }
            )

            return {
                "message":
                f"{device['name']} turned {state.upper()}"
            }

    return {
        "error": "Device not found"
    }

@tool
def toggle_multiple_devices(
    device_names: list[str],
    state: str
):
    """
    Turn multiple devices ON or OFF.
    """

    results = []

    for name in device_names:

        found = False

        for device in devices:

            if device["name"].lower() == name.lower():

                requests.patch(
                    f"http://127.0.0.1:8000/api/v1/devices/{device['id']}",
                    json={
                        "status": state.upper()
                    }
                )

                results.append(
                    f"{device['name']} turned {state.upper()}"
                )

                found = True
                break

        if not found:

            results.append(
                f"{name} not found"
            )

    return results


@tool
def list_all_devices():
    """
    List all devices and their current status.
    """

    device_list = []

    for device in devices:

        device_list.append(
            {
                "name": device["name"],
                "status": device["status"]
            }
        )

    return device_list