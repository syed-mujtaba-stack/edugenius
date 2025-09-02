"""
Conversational Agent Implementation

This module provides a conversational AI agent that can maintain context and use tools.
"""
import json
import uuid
from typing import Dict, Any, List, Optional, Callable, Awaitable, Union
from dataclasses import dataclass, field
import logging
from .base_agent import (
    BaseAgent, Message, MessageRole, AgentState, Tool,
    ToolCall, ToolResult, ToolError
)

logger = logging.getLogger(__name__)

class ConversationalAgent(BaseAgent):
    """A conversational AI agent that can maintain context and use tools."""
    
    def __init__(
        self,
        name: str,
        description: str = "A helpful AI assistant",
        system_prompt: str = "You are a helpful AI assistant.",
        max_history: int = 20,
        **kwargs
    ):
        """Initialize the conversational agent.
        
        Args:
            name: Name of the agent
            description: Description of the agent's purpose
            system_prompt: Initial system message to guide the agent's behavior
            max_history: Maximum number of messages to keep in history
        """
        super().__init__(name, description, system_prompt, **kwargs)
        self.max_history = max_history
        self._pending_tool_calls: Dict[str, ToolCall] = {}
    
    async def _generate_response(self) -> Message:
        """Generate a response based on the conversation context."""
        # Check for any pending tool calls that need to be processed
        tool_responses = await self._process_pending_tool_calls()
        if tool_responses:
            # If we have tool responses, return them
            return Message(
                role=MessageRole.ASSISTANT,
                content=json.dumps({"tool_responses": tool_responses})
            )
        
        # Generate a response using the conversation history
        response = await self._generate_text_response()
        
        # Check if the response includes tool calls
        tool_calls = self._extract_tool_calls(response.content)
        if tool_calls:
            self._queue_tool_calls(tool_calls)
            # Return a message indicating tools are being called
            tool_names = ", ".join([t["name"] for t in tool_calls])
            return Message(
                role=MessageRole.ASSISTANT,
                content=f"I'm executing the following tools: {tool_names}"
            )
        
        return response
    
    async def _generate_text_response(self) -> Message:
        """Generate a text response based on the conversation context.
        
        In a real implementation, this would call an LLM API. This is a placeholder
        that demonstrates the expected behavior.
        """
        # This is a simplified implementation. In practice, you would call an LLM API here.
        last_message = self.memory[-1] if self.memory else None
        
        if last_message and last_message.role == MessageRole.USER:
            # Simple echo response for demonstration
            return Message(
                role=MessageRole.ASSISTANT,
                content=f"You said: {last_message.content}"
            )
        
        return Message(
            role=MessageRole.ASSISTANT,
            content="I'm not sure how to respond to that."
        )
    
    def _extract_tool_calls(self, response_text: str) -> List[Dict[str, Any]]:
        """Extract tool calls from the agent's response.
        
        In a real implementation, this would parse the LLM's response to identify
        tool calls. For this example, we'll look for a specific pattern.
        """
        # This is a simplified implementation
        tool_calls = []
        
        # Look for patterns like "TOOL: tool_name {params}"
        if response_text.startswith("TOOL:"):
            try:
                parts = response_text.split(" ", 2)
                if len(parts) >= 3:
                    tool_name = parts[1].strip()
                    tool_params = json.loads(parts[2].strip())
                    tool_calls.append({
                        "name": tool_name,
                        "parameters": tool_params,
                        "id": f"call_{uuid.uuid4().hex}"
                    })
            except (json.JSONDecodeError, IndexError) as e:
                logger.warning(f"Failed to parse tool call: {e}")
        
        return tool_calls
    
    def _queue_tool_calls(self, tool_calls: List[Dict[str, Any]]) -> None:
        """Queue tool calls for execution."""
        for tool_call in tool_calls:
            call_id = tool_call["id"]
            tool_name = tool_call["name"]
            parameters = tool_call.get("parameters", {})
            
            if tool_name not in self.tools:
                logger.warning(f"Unknown tool: {tool_name}")
                continue
                
            self._pending_tool_calls[call_id] = ToolCall(
                id=call_id,
                tool_name=tool_name,
                parameters=parameters
            )
    
    async def _process_pending_tool_calls(self) -> List[Dict[str, Any]]:
        """Process any pending tool calls and return the results."""
        if not self._pending_tool_calls:
            return []
        
        results = []
        
        for call_id, tool_call in list(self._pending_tool_calls.items()):
            tool = self.tools.get(tool_call.tool_name)
            if not tool:
                logger.warning(f"Tool not found: {tool_call.tool_name}")
                results.append({
                    "call_id": call_id,
                    "status": "error",
                    "error": f"Tool not found: {tool_call.tool_name}"
                })
                continue
            
            try:
                # Execute the tool asynchronously
                result = await tool.execute(**tool_call.parameters)
                results.append({
                    "call_id": call_id,
                    "status": "success",
                    "result": result
                })
            except Exception as e:
                logger.error(f"Error executing tool {tool_call.tool_name}: {e}", exc_info=True)
                results.append({
                    "call_id": call_id,
                    "status": "error",
                    "error": str(e)
                })
            
            # Remove the processed tool call
            self._pending_tool_calls.pop(call_id, None)
        
        return results
    
    def _truncate_history(self) -> None:
        """Truncate the conversation history if it exceeds max_history."""
        if len(self.memory) > self.max_history:
            # Keep the system prompt and the most recent messages
            system_messages = [msg for msg in self.memory if msg.role == MessageRole.SYSTEM]
            recent_messages = self.memory[-self.max_history + len(system_messages):]
            self.memory = system_messages + recent_messages

# Example tool implementations
class CalculatorTool(Tool):
    """A simple calculator tool that can perform basic arithmetic."""
    
    @property
    def name(self) -> str:
        return "calculator"
    
    @property
    def description(self) -> str:
        return "Perform basic arithmetic calculations"
    
    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "The arithmetic expression to evaluate"
                }
            },
            "required": ["expression"]
        }
    
    async def execute(self, expression: str) -> float:
        """Evaluate an arithmetic expression."""
        try:
            # Use eval with a restricted scope for demonstration
            # In production, use a safer evaluation method
            allowed_operators = {
                '__builtins__': {},
                'sqrt': __import__('math').sqrt,
                'sin': __import__('math').sin,
                'cos': __import__('math').cos,
                'tan': __import__('math').tan,
                'pi': __import__('math').pi,
                'e': __import__('math').e
            }
            result = eval(expression, {'__builtins__': {}}, allowed_operators)
            return float(result)
        except Exception as e:
            raise ToolError(f"Error evaluating expression: {e}")

class WebSearchTool(Tool):
    """A tool for performing web searches."""
    
    @property
    def name(self) -> str:
        return "web_search"
    
    @property
    def description(self) -> str:
        return "Search the web for information"
    
    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query"
                },
                "max_results": {
                    "type": "integer",
                    "description": "Maximum number of results to return",
                    "default": 5
                }
            },
            "required": ["query"]
        }
    
    async def execute(self, query: str, max_results: int = 5) -> List[Dict[str, str]]:
        """Perform a web search."""
        # This is a placeholder implementation
        # In a real implementation, this would call a search API
        return [
            {
                "title": f"Result for '{query}'",
                "url": f"https://example.com/search?q={query.replace(' ', '+')}",
                "snippet": f"This is a sample search result for '{query}'. In a real implementation, this would contain actual search results."
            }
            for _ in range(min(max_results, 3))
        ]

# Example usage
if __name__ == "__main__":
    import asyncio
    
    async def main():
        # Create an agent with some tools
        agent = ConversationalAgent(
            name="Assistant",
            description="A helpful AI assistant that can perform calculations and search the web",
            system_prompt="You are a helpful assistant. You can perform calculations and search the web."
        )
        
        # Add some tools
        agent.add_tool(CalculatorTool())
        agent.add_tool(WebSearchTool())
        
        # Test the agent
        messages = [
            ("user", "What's 42 * 3.14?"),
            ("user", "Search for information about AI"),
            ("user", "What can you do?")
        ]
        
        for role, content in messages:
            print(f"\n{role.upper()}: {content}")
            response = await agent.process_message(Message(
                role=MessageRole.USER if role == "user" else MessageRole.ASSISTANT,
                content=content
            ))
            print(f"ASSISTANT: {response.content}")
    
    # Run the example
    asyncio.run(main())
