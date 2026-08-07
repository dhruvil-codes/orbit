"""
Orbit LangGraph Workflow Graph Compiler
Compiles and runs the Discover -> Understand -> Evaluate graph.
"""
from langgraph.graph import StateGraph, END
from app.graph.state import OrbitGraphState
from app.graph.nodes import discover_node, understand_node, evaluate_node

def build_orbit_graph():
    """Builds and compiles the official Orbit Day 3 LangGraph pipeline."""
    workflow = StateGraph(OrbitGraphState)

    # Add workflow nodes
    workflow.add_node("discover", discover_node)
    workflow.add_node("understand", understand_node)
    workflow.add_node("evaluate", evaluate_node)

    # Set workflow edges: Discover -> Understand -> Evaluate -> END
    workflow.set_entry_point("discover")
    workflow.add_edge("discover", "understand")
    workflow.add_edge("understand", "evaluate")
    workflow.add_edge("evaluate", END)

    return workflow.compile()

orbit_graph = build_orbit_graph()

async def run_orbit_graph(initial_state: OrbitGraphState) -> OrbitGraphState:
    """Executes the compiled LangGraph workflow asynchronously."""
    return await orbit_graph.ainvoke(initial_state)

