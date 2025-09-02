"""
Base Agent Implementation

This module provides the base classes for creating AI agents.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Callable, TypeVar, Generic, Type
from dataclasses import dataclass, field
from enum import Enum, auto
import json
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AgentState(Enum):
    """Possible states of an AI agent."""
    IDLE = auto()
    THINKING = auto()
    EXECUTING = auto()
    WAITING = auto()
    ERROR = auto()

class MessageRole(Enum):
    """Roles for message senders in the conversation."""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"

@dataclass
class Message:
    """A message in the conversation."""
    role: MessageRole
    content: str
    name: Optional[str] = None
    tool_call_id: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert message to dictionary format."""
        result = {
            "role": self.role.value,
            "content": self.content
        }
        if self.name:
            result["name"] = self.name
        if self.tool_call_id:
            result["tool_call_id"] = self.tool_call_id
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Message':
        """Create a message from a dictionary."""
        return cls(
            role=MessageRole(data["role"]),
            content=data["content"],
            name=data.get("name"),
            tool_call_id=data.get("tool_call_id")
        )

class Tool(ABC):
    """Base class for tools that agents can use."""
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Return the name of the tool."""
        pass
    
    @property
    def description(self) -> str:
        """Return a description of what the tool does."""
        return ""
    
    @property
    def parameters(self) -> Dict[str, Any]:
        """Define the parameters the tool accepts in JSON Schema format."""
        return {
            "type": "object",
            "properties": {},
            "required": []
        }
    
    @abstractmethod
    async def execute(self, **kwargs) -> Any:
        """Execute the tool with the given parameters."""
        pass

T = TypeVar('T', bound='BaseAgent')

class BaseAgent(ABC, Generic[T]):
    """Base class for all AI agents."""
    
    def __init__(
        self,
        name: str,
        description: str = "",
        system_prompt: str = "You are a helpful AI assistant.",
        **kwargs
    ):
        """Initialize the agent.
        
        Args:
            name: Name of the agent
            description: Description of the agent's purpose
            system_prompt: Initial system message to guide the agent's behavior
        """
        self.name = name
        self.description = description
        self.state = AgentState.IDLE
        self.memory: List[Message] = []
        self.tools: Dict[str, Tool] = {}
        self._register_tools()
        
        # Add system prompt if provided
        if system_prompt:
            self.memory.append(Message(role=MessageRole.SYSTEM, content=system_prompt))
    
    def _register_tools(self) -> None:
        """Register any tools this agent should have access to."""
        pass
    
    def add_tool(self, tool: Tool) -> None:
        """Add a tool to the agent's toolset."""
        if tool.name in self.tools:
            logger.warning(f"Tool with name '{tool.name}' already exists. Overwriting.")
        self.tools[tool.name] = tool
    
    def remove_tool(self, tool_name: str) -> bool:
        """Remove a tool from the agent's toolset."""
        if tool_name in self.tools:
            del self.tools[tool_name]
            return True
        return False
    
    def get_tool(self, tool_name: str) -> Optional[Tool]:
        """Get a tool by name."""
        return self.tools.get(tool_name)
    
    def get_available_tools(self) -> List[Dict[str, Any]]:
        """Get a list of available tools and their schemas."""
        return [
            {
                "name": tool.name,
                "description": tool.description,
                "parameters": tool.parameters
            }
            for tool in self.tools.values()
        ]
    
    async def process_message(self, message: Message) -> Message:
        """Process an incoming message and generate a response."""
        self.state = AgentState.THINKING
        self.memory.append(message)
        
        try:
            response = await self._generate_response()
            self.memory.append(response)
            self.state = AgentState.IDLE
            return response
        except Exception as e:
            self.state = AgentState.ERROR
            logger.error(f"Error processing message: {e}", exc_info=True)
            return Message(
                role=MessageRole.ASSISTANT,
                content=f"I encountered an error: {str(e)}"
            )
    
    @abstractmethod
    async def _generate_response(self) -> Message:
        """Generate a response based on the current conversation context.
        
        This method should be implemented by subclasses to define the agent's
        specific behavior for generating responses.
        """
        pass
    
    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """Get the conversation history in a serializable format."""
        return [msg.to_dict() for msg in self.memory]
    
    def clear_memory(self) -> None:
        """Clear the agent's conversation memory."""
        self.memory = []
    
    def __str__(self) -> str:
        """Return a string representation of the agent."""
        return f"{self.__class__.__name__}(name='{self.name}', state={self.state.name})"
