"""
Stack Implementation

This module provides a basic implementation of a stack using a list.
"""

class Stack:
    """Stack implementation using a list."""
    
    def __init__(self):
        """Initialize an empty stack."""
        self.items = []
    
    def is_empty(self):
        """Check if the stack is empty."""
        return len(self.items) == 0
    
    def push(self, item):
        """Add an item to the top of the stack."""
        self.items.append(item)
    
    def pop(self):
        """Remove and return the top item from the stack."""
        if not self.is_empty():
            return self.items.pop()
        raise IndexError("pop from empty stack")
    
    def peek(self):
        """Return the top item without removing it."""
        if not self.is_empty():
            return self.items[-1]
        raise IndexError("peek from empty stack")
    
    def size(self):
        """Return the number of items in the stack."""
        return len(self.items)
    
    def __str__(self):
        """Return string representation of the stack."""
        return f"Stack({self.items})"

# Example usage
if __name__ == "__main__":
    s = Stack()
    s.push(1)
    s.push(2)
    s.push(3)
    print(s)  # Stack([1, 2, 3])
    print(s.pop())  # 3
    print(s.peek())  # 2
    print(s.size())  # 2
