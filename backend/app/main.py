"""
Orbit FastAPI Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Orbit AI Partnership Agent API",
    version="0.1.0",
    description="Autonomous AI Partnership Development Representative (AI PDR)"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Orbit AI Backend API",
        "version": "0.1.0"
    }
