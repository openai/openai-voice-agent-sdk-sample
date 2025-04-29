import json

from agents import Agent, WebSearchTool, function_tool
from agents.tool import UserLocation

import app.mock_api as mock_api
from app.utils import update_task_function

STYLE_INSTRUCTIONS = "Use a conversational tone and write in a chat style without formal formatting or lists and do not use any emojis."


@function_tool
def get_past_orders():
    return json.dumps(mock_api.get_past_orders())


@function_tool
def submit_refund_request(order_number: str):
    """Confirm with the user first"""
    return mock_api.submit_refund_request(order_number)


@function_tool
def update_task(task_id: int, title: str, status: str, message: str):
    return update_task_function(task_id, title, status, message)


customer_support_agent = Agent(
    name="Customer Support Agent",
    instructions=f"You are a customer support assistant. {STYLE_INSTRUCTIONS}",
    model="gpt-4o-mini",
    tools=[get_past_orders, submit_refund_request],
)

stylist_agent = Agent(
    name="Stylist Agent",
    model="gpt-4o-mini",
    instructions=f"You are a stylist assistant. {STYLE_INSTRUCTIONS}",
    tools=[WebSearchTool(user_location=UserLocation(type="approximate", city="Tokyo"))],
    handoffs=[customer_support_agent],
)

triage_agent = Agent(
    name="Triage Agent",
    model="gpt-4o-mini",
    instructions=f"Route the user to the appropriate agent based on their request. {STYLE_INSTRUCTIONS}",
    handoffs=[stylist_agent, customer_support_agent],
)

task_agent = Agent(
    name="Task Agent",
    model="gpt-4o-mini",
    instructions=f"You are a friendly assistant.",
    tools=[update_task],
)

starting_agent = task_agent
