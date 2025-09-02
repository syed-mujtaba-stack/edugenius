"""
Queue Implementation

This module provides a basic implementation of a queue using a list.
"""

class Queue:
    """Queue implementation using a list."""
    
    def __init__(self):
        """Initialize an empty queue."""
        self.items = []
    
    def is_empty(self):
        """Check if the queue is empty."""
        return len(self.items) == 0
    
    def enqueue(self, item):
        """Add an item to the end of the queue."""
        self.items.append(item)
    
    def dequeue(self):
        """Remove and return the first item from the queue."""
        if not self.is_empty():
            return self.items.pop(0)
        raise IndexError("dequeue from empty queue")
    
    def front(self):
        """Return the first item without removing it."""
        if not self.is_empty():
            return self.items[0]
        raise IndexError("front from empty queue")
    
    def size(self):
        """Return the number of items in the queue."""
        return len(self.items)
    
    def __str__(self):
        """Return string representation of the queue."""
        return f"Queue({self.items})"

# Example usage
if __name__ == "__main__":
    q = Queue()
    q.enqueue(1)
    q.enqueue(2)
    q.enqueue(3)
    print(q)  # Queue([1, 2, 3])
    print(q.dequeue())  # 1
    print(q.front())  # 2
    print(q.size())  # 2
