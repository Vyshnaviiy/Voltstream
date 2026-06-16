
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import mock_data
from datetime import datetime
from mangum import Mangum

from services.rag_service import (
    index_pdf,
    retrieve_chunks
)

from services.bedrock_service import (
    generate_response
)
from services.agent_service import (
    run_agent
)

# =========================
# FASTAPI APP
# =========================
app = FastAPI(
    title="VoltStream API",
    version="1.0.0"
)

# Index PDF when backend starts
index_pdf()


# =========================
# ROOT ROUTE
# =========================
@app.get("/")
async def root():

    return {
        "message": "VoltStream Backend Running"
    }


# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3003",
        "http://voltstream-frontend-v.s3-website-ap-south-2.amazonaws.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# MODELS
# =========================
class Device(BaseModel):

    id: int
    name: str
    status: str
    power_consumption: Optional[float] = None


class DeviceUpdate(BaseModel):

    status: str


class ChatRequest(BaseModel):

    message: str
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):

    response: str
    timestamp: datetime


# =========================
# DASHBOARD APIs
# =========================
@app.get("/api/v1/dashboard/live")
async def get_live_dashboard():

    return mock_data.live_data


@app.get("/api/v1/analytics/history")
async def get_analytics_history(
    period: Optional[str] = None
):

    if period:

        selected = period.lower()

        if selected not in mock_data.analytics_data:

            raise HTTPException(
                status_code=400,
                detail="Invalid analytics period"
            )

        return mock_data.analytics_data[selected]

    return mock_data.analytics_data


@app.get("/api/v1/devices")
async def get_devices():

    return mock_data.devices


@app.patch("/api/v1/devices/{device_id}")
async def update_device(
    device_id: int,
    update: DeviceUpdate
):

    for device in mock_data.devices:

        if device["id"] == device_id:

            device["status"] = update.status

            return {
                "message": "Device updated",
                "device": device
            }

    raise HTTPException(
        status_code=404,
        detail="Device not found"
    )


@app.get("/api/v1/billing/summary")
async def get_billing_summary():

    return mock_data.billing_summary


# =========================
# GENERAL CHAT ENDPOINT
# =========================
@app.post("/api/v1/chat")
async def chat_with_ai(
    request: ChatRequest
):

    try:

        response_text = generate_response(
            request.message
        )

        return ChatResponse(
            response=response_text,
            timestamp=datetime.now()
        )

    except Exception as e:

        return ChatResponse(
            response=f"Error: {str(e)}",
            timestamp=datetime.now()
        )


# =========================
# RAG QA ENDPOINT
# =========================
@app.post("/api/v1/qa")
async def qa_endpoint(
    request: ChatRequest
):

    try:

        message = request.message

        # Retrieve relevant chunks
        relevant_chunks = retrieve_chunks(
            message
        )

        # Combine chunks into context
        context = "\n".join(relevant_chunks)

        # Build RAG prompt
        prompt = f"""
        You are a VoltStream Knowledge Assistant.

        Rules:
        1. Use ONLY the provided context.
        2. Keep answers under 100 words.
        3. Do not explain unnecessarily.
        4. If the answer is not in the context, respond exactly:
        "I don't have any information about that in the provided documents."

        Context:
        {context}

        Question:
        {message}

        Answer:
        """


        # Generate response
        response_text = generate_response(
            prompt
        )

        return ChatResponse(
            response=response_text,
            timestamp=datetime.now()
        )

    except Exception as e:

        return ChatResponse(
            response=f"Error: {str(e)}",
            timestamp=datetime.now()
        )

@app.post("/api/v1/agent")
async def agent_endpoint(
    request: ChatRequest
):

    result = run_agent(
        request.message
    )

    return result


# =========================
# RUN APP
# =========================
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8001,
        reload=False
    )


# =========================
# AWS LAMBDA HANDLER
# =========================
handler = Mangum(app)

