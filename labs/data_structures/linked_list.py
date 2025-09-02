"""
Linked List Implementation

This module provides a basic implementation of a singly linked list.
"""

class Node:
    """Node class for linked list elements."""
    def __init__(self, data=None):
        self.data = data
        self.next = None

class LinkedList:
    """Singly Linked List implementation."""
    
    def __init__(self):
        self.head = None
    
    def append(self, data):
        """Add a node at the end of the linked list."""
        new_node = Node(data)
        if not self.head:
            self.head = new_node
            return
        
        last = self.head
        while last.next:
            last = last.next
        last.next = new_node
    
    def prepend(self, data):
        """Add a node at the beginning of the linked list."""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
    
    def delete(self, key):
        """Delete the first occurrence of key in the linked list."""
        current = self.head
        
        # If head node itself holds the key
        if current and current.data == key:
            self.head = current.next
            current = None
            return
        
        # Search for the key to be deleted
        prev = None
        while current and current.data != key:
            prev = current
            current = current.next
        
        # If key was not present
        if current is None:
            return
        
        # Unlink the node
        prev.next = current.next
        current = None
    
    def display(self):
        """Print all elements of the linked list."""
        elements = []
        current = self.head
        while current:
            elements.append(str(current.data))
            current = current.next
        print(" -> ".join(elements) if elements else "Empty list")

# Example usage
if __name__ == "__main__":
    ll = LinkedList()
    ll.append(1)
    ll.append(2)
    ll.append(3)
    ll.prepend(0)
    ll.display()  # 0 -> 1 -> 2 -> 3
    ll.delete(2)
    ll.display()  # 0 -> 1 -> 3
