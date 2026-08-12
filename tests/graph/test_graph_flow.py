"""
Deterministic LangGraph Workflow Test Suite
Business Flow: Discover -> Understand -> Evaluate -> Communicate -> Negotiate -> Schedule
"""
import pytest
from app.graph.graph import orbit_graph
from app.graph.router import route_after_evaluation

def test_orbit_graph_compilation():
    assert orbit_graph["status"] == "compiled"
    assert "evaluate_node" in orbit_graph["workflow"]

def test_route_after_evaluation_threshold():
    state_high = {"compatibility_score": 85.0}
    state_low = {"compatibility_score": 50.0}

    assert route_after_evaluation(state_high) == "communicate_node"
    assert route_after_evaluation(state_low) == "end"
