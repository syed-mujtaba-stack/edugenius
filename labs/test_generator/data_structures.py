"""
Data Structure Test Generators

This module provides test generators for common data structures.
"""
import random
from typing import List, Dict, Any, Tuple, Optional, TypeVar, Generic, Type
from .base import TestGenerator, TestCase, DataStructureTestGenerator

class LinkedListTestGenerator(DataStructureTestGenerator):
    """Test generator for linked list operations."""
    
    def __init__(self, min_cases: int = 5, max_cases: int = 10):
        super().__init__(min_cases, max_cases)
    
    def generate_operation_sequence(self) -> List[Tuple[str, tuple, Any]]:
        """Generate a sequence of linked list operations."""
        operations = []
        linked_list = []  # Simulate linked list behavior with a list
        
        # Start with some initial values
        num_initial = random.randint(3, 7)
        initial_values = [random.randint(1, 100) for _ in range(num_initial)]
        
        for val in initial_values:
            operations.append(("append", (val,), None))
            linked_list.append(val)
        
        # Generate random operations
        num_operations = random.randint(5, 15)
        for _ in range(num_operations):
            op = random.choice(["append", "prepend", "delete", "search", "get"])
            
            if op == "append":
                val = random.randint(1, 100)
                operations.append(("append", (val,), None))
                linked_list.append(val)
                
            elif op == "prepend":
                val = random.randint(1, 100)
                operations.append(("prepend", (val,), None))
                linked_list.insert(0, val)
                
            elif op == "delete" and linked_list:
                if random.random() < 0.5:  # Delete by value
                    val = random.choice(linked_list) if random.random() < 0.7 else random.randint(100, 200)
                    operations.append(("delete", (val,), val in linked_list))
                    if val in linked_list:
                        linked_list.remove(val)
                else:  # Delete at index
                    idx = random.randint(0, len(linked_list) - 1)
                    val = linked_list[idx]
                    operations.append(("delete_at", (idx,), val))
                    del linked_list[idx]
                    
            elif op == "search" and linked_list:
                val = random.choice(linked_list) if random.random() < 0.7 else random.randint(100, 200)
                operations.append(("search", (val,), val in linked_list))
                
            elif op == "get" and linked_list:
                idx = random.randint(0, len(linked_list) - 1)
                operations.append(("get", (idx,), linked_list[idx]))
        
        return operations

class StackTestGenerator(DataStructureTestGenerator):
    """Test generator for stack operations."""
    
    def generate_operation_sequence(self) -> List[Tuple[str, tuple, Any]]:
        """Generate a sequence of stack operations."""
        operations = []
        stack = []
        
        num_operations = random.randint(5, 15)
        for _ in range(num_operations):
            op = random.choices(
                ["push", "pop", "peek", "is_empty"],
                weights=[0.5, 0.3, 0.1, 0.1]
            )[0]
            
            if op == "push" or (op == "pop" and not stack):
                val = random.randint(1, 100)
                operations.append(("push", (val,), None))
                stack.append(val)
                
            elif op == "pop":
                val = stack.pop()
                operations.append(("pop", (), val))
                
            elif op == "peek":
                val = stack[-1] if stack else None
                operations.append(("peek", (), val))
                
            elif op == "is_empty":
                operations.append(("is_empty", (), len(stack) == 0))
        
        return operations

class QueueTestGenerator(DataStructureTestGenerator):
    """Test generator for queue operations."""
    
    def generate_operation_sequence(self) -> List[Tuple[str, tuple, Any]]:
        """Generate a sequence of queue operations."""
        operations = []
        queue = []
        
        num_operations = random.randint(5, 15)
        for _ in range(num_operations):
            op = random.choices(
                ["enqueue", "dequeue", "front", "is_empty"],
                weights=[0.5, 0.3, 0.1, 0.1]
            )[0]
            
            if op == "enqueue" or (op == "dequeue" and not queue):
                val = random.randint(1, 100)
                operations.append(("enqueue", (val,), None))
                queue.append(val)
                
            elif op == "dequeue":
                val = queue.pop(0)
                operations.append(("dequeue", (), val))
                
            elif op == "front":
                val = queue[0] if queue else None
                operations.append(("front", (), val))
                
            elif op == "is_empty":
                operations.append(("is_empty", (), len(queue) == 0))
        
        return operations

class BinarySearchTreeTestGenerator(DataStructureTestGenerator):
    """Test generator for binary search tree operations."""
    
    def generate_operation_sequence(self) -> List[Tuple[str, tuple, Any]]:
        """Generate a sequence of BST operations."""
        operations = []
        bst = set()
        
        # Start with some initial values
        num_initial = random.randint(3, 7)
        initial_values = random.sample(range(1, 100), num_initial)
        
        for val in initial_values:
            operations.append(("insert", (val,), None))
            bst.add(val)
        
        # Generate random operations
        num_operations = random.randint(5, 15)
        for _ in range(num_operations):
            op = random.choice(["insert", "delete", "search", "min", "max"])
            
            if op == "insert":
                val = random.randint(1, 100)
                operations.append(("insert", (val,), None))
                bst.add(val)
                
            elif op == "delete" and bst:
                val = random.choice(list(bst)) if random.random() < 0.7 else random.randint(100, 200)
                operations.append(("delete", (val,), val in bst))
                if val in bst:
                    bst.remove(val)
                    
            elif op == "search" and bst:
                val = random.choice(list(bst)) if random.random() < 0.7 else random.randint(100, 200)
                operations.append(("search", (val,), val in bst))
                
            elif op == "min" and bst:
                operations.append(("find_min", (), min(bst)))
                
            elif op == "max" and bst:
                operations.append(("find_max", (), max(bst)))
        
        return operations

def generate_linked_list_tests(num_cases: int = 5) -> List[Dict[str, Any]]:
    """Generate test cases for linked list implementation."""
    generator = LinkedListTestGenerator(min_cases=num_cases, max_cases=num_cases)
    return [tc.to_dict() for tc in generator.generate_test_cases()]

def generate_stack_tests(num_cases: int = 5) -> List[Dict[str, Any]]:
    """Generate test cases for stack implementation."""
    generator = StackTestGenerator(min_cases=num_cases, max_cases=num_cases)
    return [tc.to_dict() for tc in generator.generate_test_cases()]

def generate_queue_tests(num_cases: int = 5) -> List[Dict[str, Any]]:
    """Generate test cases for queue implementation."""
    generator = QueueTestGenerator(min_cases=num_cases, max_cases=num_cases)
    return [tc.to_dict() for tc in generator.generate_test_cases()]

def generate_bst_tests(num_cases: int = 5) -> List[Dict[str, Any]]:
    """Generate test cases for binary search tree implementation."""
    generator = BinarySearchTreeTestGenerator(min_cases=num_cases, max_cases=num_cases)
    return [tc.to_dict() for tc in generator.generate_test_cases()]

# Example usage
if __name__ == "__main__":
    print("Linked List Test Cases:")
    ll_tests = generate_linked_list_tests(3)
    for i, test in enumerate(ll_tests, 1):
        print(f"\nTest {i}:")
        for op in test['input']:
            print(f"  {op['operation']}{op['args']}")
        print(f"  Expected: {test['expected']}")
    
    print("\nStack Test Cases:")
    stack_tests = generate_stack_tests(2)
    for i, test in enumerate(stack_tests, 1):
        print(f"\nTest {i}:")
        for op in test['input']:
            print(f"  {op['operation']}{op['args']}")
        print(f"  Expected: {test['expected']}")
