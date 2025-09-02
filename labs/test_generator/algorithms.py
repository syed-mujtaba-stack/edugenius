"""
Algorithm Test Generators

This module provides test generators for common algorithms.
"""
import random
from typing import List, Dict, Any, Tuple, Optional, Callable, TypeVar
from .base import TestGenerator, TestCase

T = TypeVar('T')

def sorting_test_generator(
    algorithm_name: str,
    min_length: int = 0,
    max_length: int = 20,
    min_val: int = -100,
    max_val: int = 100,
    num_cases: int = 10,
    allow_duplicates: bool = True
) -> List[Dict[str, Any]]:
    """Generate test cases for sorting algorithms.
    
    Args:
        algorithm_name: Name of the sorting algorithm (for description)
        min_length: Minimum length of test arrays
        max_length: Maximum length of test arrays
        min_val: Minimum value in the arrays
        max_val: Maximum value in the arrays
        num_cases: Number of test cases to generate
        allow_duplicates: Whether to allow duplicate values in the arrays
        
    Returns:
        List of test cases as dictionaries
    """
    test_cases = []
    
    # Edge cases
    test_cases.append({
        'description': f'{algorithm_name} - Empty array',
        'input': [],
        'expected': []
    })
    
    test_cases.append({
        'description': f'{algorithm_name} - Single element',
        'input': [42],
        'expected': [42]
    })
    
    test_cases.append({
        'description': f'{algorithm_name} - Already sorted array',
        'input': [1, 2, 3, 4, 5],
        'expected': [1, 2, 3, 4, 5]
    })
    
    test_cases.append({
        'description': f'{algorithm_name} - Reverse sorted array',
        'input': [5, 4, 3, 2, 1],
        'expected': [1, 2, 3, 4, 5]
    })
    
    # Random test cases
    for i in range(num_cases - len(test_cases)):
        length = random.randint(min_length, max_length)
        if allow_duplicates:
            arr = [random.randint(min_val, max_val) for _ in range(length)]
        else:
            # Ensure no duplicates by using a set
            arr = []
            while len(arr) < length:
                num = random.randint(min_val, max_val)
                if num not in arr:
                    arr.append(num)
        
        test_cases.append({
            'description': f'{algorithm_name} - Random test case {i+1}',
            'input': arr.copy(),
            'expected': sorted(arr)
        })
    
    return test_cases

def search_test_generator(
    algorithm_name: str,
    min_length: int = 1,
    max_length: int = 20,
    min_val: int = -100,
    max_val: int = 100,
    num_cases: int = 10,
    target_exists: Optional[bool] = None
) -> List[Dict[str, Any]]:
    """Generate test cases for search algorithms.
    
    Args:
        algorithm_name: Name of the search algorithm (for description)
        min_length: Minimum length of test arrays
        max_length: Maximum length of test arrays
        min_val: Minimum value in the arrays
        max_val: Maximum value in the arrays
        num_cases: Number of test cases to generate
        target_exists: Whether the target should exist in the array (None for random)
        
    Returns:
        List of test cases as dictionaries
    """
    test_cases = []
    
    # Edge cases
    test_cases.append({
        'description': f'{algorithm_name} - Single element array, target exists',
        'input': {'arr': [42], 'target': 42},
        'expected': 0
    })
    
    test_cases.append({
        'description': f'{algorithm_name} - Single element array, target does not exist',
        'input': {'arr': [42], 'target': 10},
        'expected': -1
    })
    
    # Random test cases
    for i in range(num_cases - len(test_cases)):
        length = random.randint(min_length, max_length)
        
        # Generate a sorted array with unique elements
        arr = []
        while len(arr) < length:
            num = random.randint(min_val, max_val)
            if num not in arr:
                arr.append(num)
        arr.sort()
        
        # Decide if target should exist in the array
        if target_exists is None:
            target_exists_case = random.choice([True, False])
        else:
            target_exists_case = target_exists
        
        if target_exists_case and arr:  # Ensure target exists
            target = random.choice(arr)
            expected = arr.index(target)
        else:  # Target might not exist
            # Generate a target that's not in the array
            while True:
                target = random.randint(min_val - 10, max_val + 10)
                if target not in arr:
                    expected = -1
                    break
        
        test_cases.append({
            'description': f'{algorithm_name} - Test case {i+1}',
            'input': {'arr': arr, 'target': target},
            'expected': expected
        })
    
    return test_cases

def graph_test_generator(
    algorithm_name: str,
    min_nodes: int = 3,
    max_nodes: int = 10,
    density: float = 0.5,
    weighted: bool = False,
    min_weight: int = 1,
    max_weight: int = 10,
    num_cases: int = 5,
    directed: bool = False
) -> List[Dict[str, Any]]:
    """Generate test cases for graph algorithms.
    
    Args:
        algorithm_name: Name of the graph algorithm (for description)
        min_nodes: Minimum number of nodes in the graph
        max_nodes: Maximum number of nodes in the graph
        density: Edge density (0.0 to 1.0)
        weighted: Whether the graph is weighted
        min_weight: Minimum edge weight
        max_weight: Maximum edge weight
        num_cases: Number of test cases to generate
        directed: Whether the graph is directed
        
    Returns:
        List of test cases as dictionaries
    """
    test_cases = []
    
    for i in range(num_cases):
        num_nodes = random.randint(min_nodes, max_nodes)
        nodes = list(range(num_nodes))
        edges = []
        
        # Generate edges based on density
        max_possible_edges = num_nodes * (num_nodes - 1)
        if not directed:
            max_possible_edges = num_nodes * (num_nodes - 1) // 2
            
        num_edges = int(density * max_possible_edges)
        num_edges = max(num_edges, num_nodes - 1)  # Ensure connectivity
        
        # Create a connected graph
        for i in range(1, num_nodes):
            weight = random.randint(min_weight, max_weight) if weighted else 1
            edges.append((random.randint(0, i-1), i, weight))
        
        # Add random edges
        possible_edges = []
        for u in range(num_nodes):
            for v in range(u + 1, num_nodes) if not directed else range(num_nodes):
                if u != v and (u, v) not in [(e[0], e[1]) for e in edges]:
                    possible_edges.append((u, v))
        
        random.shuffle(possible_edges)
        for u, v in possible_edges[:num_edges - (num_nodes - 1)]:
            weight = random.randint(min_weight, max_weight) if weighted else 1
            edges.append((u, v, weight))
        
        # Format the graph representation
        graph = {}
        for u, v, weight in edges:
            if u not in graph:
                graph[u] = []
            graph[u].append((v, weight) if weighted else v)
            
            if not directed:
                if v not in graph:
                    graph[v] = []
                graph[v].append((u, weight) if weighted else u)
        
        # Generate expected output (simplified, would be algorithm-specific)
        expected = {}
        
        test_cases.append({
            'description': f'{algorithm_name} - Test case {i+1} ({num_nodes} nodes, {len(edges)} edges)',
            'input': {
                'graph': graph,
                'start': 0,
                'weighted': weighted
            },
            'expected': expected
        })
    
    return test_cases

def dynamic_programming_test_generator(
    problem_type: str,
    num_cases: int = 5,
    max_n: int = 20
) -> List[Dict[str, Any]]:
    """Generate test cases for dynamic programming problems.
    
    Args:
        problem_type: Type of DP problem ('fibonacci', 'knapsack', 'lcs', etc.)
        num_cases: Number of test cases to generate
        max_n: Maximum value of n for problems that use it
        
    Returns:
        List of test cases as dictionaries
    """
    test_cases = []
    
    if problem_type.lower() == 'fibonacci':
        # Predefined Fibonacci test cases
        fib_cases = [
            (0, 0), (1, 1), (2, 1), (5, 5), (10, 55), (15, 610)
        ]
        
        for n, expected in fib_cases:
            test_cases.append({
                'description': f'Fibonacci - n = {n}',
                'input': n,
                'expected': expected
            })
        
        # Add some random test cases
        for _ in range(num_cases - len(test_cases)):
            n = random.randint(0, max_n)
            test_cases.append({
                'description': f'Fibonacci - Random n = {n}',
                'input': n,
                'expected': self._fib(n)
            })
    
    elif problem_type.lower() == 'knapsack':
        # Predefined Knapsack test cases
        knapsack_cases = [
            {
                'weights': [1, 2, 3],
                'values': [6, 10, 12],
                'capacity': 5,
                'expected': 22
            },
            {
                'weights': [2, 3, 4, 5],
                'values': [3, 4, 5, 6],
                'capacity': 5,
                'expected': 7
            }
        ]
        
        for i, case in enumerate(knapsack_cases):
            test_cases.append({
                'description': f'Knapsack - Test case {i+1}',
                'input': {
                    'weights': case['weights'],
                    'values': case['values'],
                    'capacity': case['capacity']
                },
                'expected': case['expected']
            })
        
        # Add some random test cases
        for i in range(num_cases - len(test_cases)):
            n = random.randint(1, 10)
            weights = [random.randint(1, 20) for _ in range(n)]
            values = [random.randint(1, 100) for _ in range(n)]
            capacity = random.randint(5, 50)
            
            test_cases.append({
                'description': f'Knapsack - Random test case {i+1}',
                'input': {
                    'weights': weights,
                    'values': values,
                    'capacity': capacity
                },
                'expected': self._knapsack_bruteforce(weights, values, capacity)
            })
    
    return test_cases

def _fib(self, n: int) -> int:
    """Helper method to compute Fibonacci numbers."""
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

def _knapsack_bruteforce(self, weights: List[int], values: List[int], capacity: int) -> int:
    """Brute force solution for 0/1 Knapsack problem (for testing)."""
    n = len(weights)
    max_value = 0
    
    # Try all possible subsets
    for mask in range(1 << n):
        total_weight = 0
        total_value = 0
        for i in range(n):
            if mask & (1 << i):
                total_weight += weights[i]
                total_value += values[i]
        
        if total_weight <= capacity and total_value > max_value:
            max_value = total_value
    
    return max_value
