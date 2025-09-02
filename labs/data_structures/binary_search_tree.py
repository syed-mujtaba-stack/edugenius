"""
Binary Search Tree Implementation

This module provides a basic implementation of a binary search tree.
"""

class TreeNode:
    """Node class for binary search tree."""
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.parent = None

class BinarySearchTree:
    """Binary Search Tree implementation."""
    
    def __init__(self):
        self.root = None
    
    def insert(self, key):
        """Insert a key into the BST."""
        if self.root is None:
            self.root = TreeNode(key)
        else:
            self._insert_recursive(self.root, key)
    
    def _insert_recursive(self, node, key):
        """Helper method to insert a key recursively."""
        if key < node.key:
            if node.left is None:
                node.left = TreeNode(key)
                node.left.parent = node
            else:
                self._insert_recursive(node.left, key)
        else:
            if node.right is None:
                node.right = TreeNode(key)
                node.right.parent = node
            else:
                self._insert_recursive(node.right, key)
    
    def search(self, key):
        """Search for a key in the BST."""
        return self._search_recursive(self.root, key)
    
    def _search_recursive(self, node, key):
        """Helper method to search for a key recursively."""
        if node is None or node.key == key:
            return node
        if key < node.key:
            return self._search_recursive(node.left, key)
        return self._search_recursive(node.right, key)
    
    def delete(self, key):
        """Delete a node with the given key from the BST."""
        node = self.search(key)
        if node is None:
            return None
        
        # Node with only one child or no child
        if node.left is None:
            self._transplant(node, node.right)
        elif node.right is None:
            self._transplant(node, node.left)
        else:
            # Node with two children: get the in-order successor
            successor = self._minimum(node.right)
            if successor.parent != node:
                self._transplant(successor, successor.right)
                successor.right = node.right
                successor.right.parent = successor
            self._transplant(node, successor)
            successor.left = node.left
            successor.left.parent = successor
        
        return node.key
    
    def _transplant(self, u, v):
        """Replace the subtree rooted at node u with the subtree rooted at node v."""
        if u.parent is None:
            self.root = v
        elif u == u.parent.left:
            u.parent.left = v
        else:
            u.parent.right = v
        if v is not None:
            v.parent = u.parent
    
    def _minimum(self, node):
        """Find the node with the minimum key in the subtree rooted at the given node."""
        while node.left is not None:
            node = node.left
        return node
    
    def inorder_traversal(self):
        """Perform an in-order traversal of the BST."""
        result = []
        self._inorder_recursive(self.root, result)
        return result
    
    def _inorder_recursive(self, node, result):
        """Helper method for in-order traversal."""
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.key)
            self._inorder_recursive(node.right, result)
    
    def __str__(self):
        """Return a string representation of the BST."""
        return str(self.inorder_traversal())

# Example usage
if __name__ == "__main__":
    bst = BinarySearchTree()
    keys = [50, 30, 20, 40, 70, 60, 80]
    
    # Insert keys
    for key in keys:
        bst.insert(key)
    
    print("In-order traversal:", bst)  # [20, 30, 40, 50, 60, 70, 80]
    
    # Search for a key
    search_key = 40
    result = bst.search(search_key)
    print(f"Search for {search_key}: {'Found' if result else 'Not found'}")
    
    # Delete a key
    delete_key = 30
    bst.delete(delete_key)
    print(f"After deleting {delete_key}:", bst)  # [20, 40, 50, 60, 70, 80]
