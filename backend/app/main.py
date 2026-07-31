"""
Orbit FastAPI Application Entry Point
"""
from fastapi import FastAPI

app = FastAPI(title="Orbit AI Partnership Agent API", version="0.1.0")

@app.get("/")
def read_root():
    return {"message": "Orbit Backend API is running."}
