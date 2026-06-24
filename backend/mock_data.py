live_data = {
    "grid_draw": 420,
    "solar_generation": 600,
    "net_usage": -180,
    "connection_status": "online",
    "last_updated": "2024-01-15T10:30:00Z"
}

analytics_data = {
    "daily": [
        {"label": "Mon", "usage": 30, "generation": 45},
        {"label": "Tue", "usage": 45, "generation": 52},
        {"label": "Wed", "usage": 28, "generation": 38},
        {"label": "Thu", "usage": 52, "generation": 61},
        {"label": "Fri", "usage": 41, "generation": 49},
        {"label": "Sat", "usage": 35, "generation": 42},
        {"label": "Sun", "usage": 29, "generation": 35}
    ],
    "weekly": [
        {"label": "Week 1", "usage": 230, "generation": 280},
        {"label": "Week 2", "usage": 280, "generation": 320},
        {"label": "Week 3", "usage": 195, "generation": 240},
        {"label": "Week 4", "usage": 310, "generation": 380}
    ],
    "monthly": [
        {"label": "Jan", "usage": 1200, "generation": 1450},
        {"label": "Feb", "usage": 1350, "generation": 1620},
        {"label": "Mar", "usage": 1180, "generation": 1400},
        {"label": "Apr", "usage": 1420, "generation": 1680},
        {"label": "May", "usage": 1280, "generation": 1520},
        {"label": "Jun", "usage": 1150, "generation": 1380}
    ]
}

devices = [
    {
        "id": 1,
        "name": "Air Conditioner",
        "status": "OFF",
        "power_consumption": 2800,
        "icon": "fan"
    },
    {
        "id": 2,
        "name": "Washing Machine",
        "status": "ON",
        "power_consumption": 850,
        "icon": "washing-machine"
    },
    {
        "id": 3,
        "name": "Refrigerator",
        "status": "ON",
        "power_consumption": 120,
        "icon": "fridge"
    },
    {
        "id": 4,
        "name": "Smart TV",
        "status": "OFF",
        "power_consumption": 200,
        "icon": "tv"
    },
    {
        "id": 5,
        "name": "Electric Vehicle Charger",
        "status": "ON",
        "power_consumption": 3200,
        "icon": "car"
    },
    {
        "id": 6,
        "name": "Water Heater",
        "status": "OFF",
        "power_consumption": 4500,
        "icon": "droplets"
    }
]

billing_summary = {
    "current_balance": 2400.50,
    "projected_bill": 3100.75,
    "budget_limit": 2500.00,
    "usage_percentage": 85,
    "invoices": [
        {"date": "2024-01-01", "amount": 2450.00, "status": "paid"},
        {"date": "2024-02-01", "amount": 2680.00, "status": "paid"},
        {"date": "2024-03-01", "amount": 2320.00, "status": "paid"},
        {"date": "2024-04-01", "amount": 2890.00, "status": "pending"}
    ]
}