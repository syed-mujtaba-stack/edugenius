"""
Base Test Generator

This module provides the base class for generating test cases.
"""
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Tuple, Optional, TypeVar, Generic, Type
import random
import string
import json
from dataclasses import dataclass

T = TypeVar('T')

@dataclass
class TestCase:
    """A single test case with input and expected output."""
    input_data: Any
    expected_output: Any
    description: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert test case to a dictionary."""
        return {
            "description": self.description,
            "input": self.input_data,
            "expected": self.expected_output
        }

class TestGenerator(ABC, Generic[T]):
    """Base class for generating test cases."""
    
    def __init__(self, min_cases: int = 5, max_cases: int = 10):
        """Initialize the test generator.
        
        Args:
            min_cases: Minimum number of test cases to generate
            max_cases: Maximum number of test cases to generate
        """
        self.min_cases = min_cases
        self.max_cases = max_cases
    
    @abstractmethod
    def generate_test_cases(self) -> List[TestCase]:
        """Generate a list of test cases."""
        pass
    
    def generate_random_integer(self, min_val: int = -100, max_val: int = 100) -> int:
        """Generate a random integer within the specified range."""
        return random.randint(min_val, max_val)
    
    def generate_random_float(self, min_val: float = -100.0, max_val: float = 100.0, 
                            decimals: int = 2) -> float:
        """Generate a random float within the specified range."""
        return round(random.uniform(min_val, max_val), decimals)
    
    def generate_random_string(self, min_length: int = 3, max_length: int = 10) -> str:
        """Generate a random string of letters and digits."""
        length = random.randint(min_length, max_length)
        chars = string.ascii_letters + string.digits
        return ''.join(random.choice(chars) for _ in range(length))
    
    def generate_random_list(self, min_length: int = 0, max_length: int = 10, 
                           min_val: int = -100, max_val: int = 100) -> List[int]:
        """Generate a random list of integers."""
        length = random.randint(min_length, max_length)
        return [self.generate_random_integer(min_val, max_val) for _ in range(length)]
    
    def generate_sorted_list(self, min_length: int = 0, max_length: int = 10, 
                           min_val: int = -100, max_val: int = 100, 
                           descending: bool = False) -> List[int]:
        """Generate a sorted list of integers."""
        lst = self.generate_random_list(min_length, max_length, min_val, max_val)
        return sorted(lst, reverse=descending)
    
    def save_to_file(self, test_cases: List[TestCase], filename: str) -> None:
        """Save test cases to a JSON file."""
        with open(filename, 'w') as f:
            json.dump([tc.to_dict() for tc in test_cases], f, indent=2)

class DataStructureTestGenerator(TestGenerator[T]):
    """Base class for data structure test generators."""
    
    def __init__(self, min_cases: int = 5, max_cases: int = 10):
        super().__init__(min_cases, max_cases)
    
    @abstractmethod
    def generate_operation_sequence(self) -> List[Tuple[str, Any, Any]]:
        """Generate a sequence of operations to test the data structure.
        
        Returns:
            A list of tuples (operation_name, args, expected_result)
        """
        pass
    
    def generate_test_cases(self) -> List[TestCase]:
        """Generate test cases based on operation sequences."""
        test_cases = []
        num_cases = random.randint(self.min_cases, self.max_cases)
        
        for _ in range(num_cases):
            operations = self.generate_operation_sequence()
            test_input = [{"operation": op, "args": args} for op, args, _ in operations]
            expected_output = [result for _, _, result in operations]
            
            test_cases.append(TestCase(
                input_data=test_input,
                expected_output=expected_output,
                description=f"Test case with {len(operations)} operations"
            ))
        
        return test_cases
