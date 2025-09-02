"""
Hash Table Implementation

This module provides a basic implementation of a hash table with chaining.
"""

class HashNode:
    """Node class for hash table chaining."""
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.next = None

class HashTable:
    """Hash table implementation with chaining for collision resolution."""
    
    def __init__(self, size=10):
        """Initialize the hash table with a default size of 10."""
        self.size = size
        self.table = [None] * self.size
        self.count = 0
        self.load_factor_threshold = 0.7
    
    def _hash(self, key):
        """Generate a hash value for the given key."""
        return hash(key) % self.size
    
    def _resize(self):
        """Resize the hash table when the load factor exceeds the threshold."""
        old_table = self.table
        self.size *= 2
        self.table = [None] * self.size
        self.count = 0
        
        for node in old_table:
            current = node
            while current:
                self.put(current.key, current.value)
                current = current.next
    
    def put(self, key, value):
        """Insert or update a key-value pair in the hash table."""
        # Check if resizing is needed
        if (self.count + 1) / self.size > self.load_factor_threshold:
            self._resize()
            
        index = self._hash(key)
        node = self.table[index]
        
        # If bucket is empty
        if not node:
            self.table[index] = HashNode(key, value)
            self.count += 1
            return
        
        # Check if key exists and update value
        prev = None
        while node:
            if node.key == key:
                node.value = value
                return
            prev = node
            node = node.next
        
        # Add new node to the end of the chain
        prev.next = HashNode(key, value)
        self.count += 1
    
    def get(self, key, default=None):
        """Retrieve the value associated with the given key."""
        index = self._hash(key)
        node = self.table[index]
        
        while node:
            if node.key == key:
                return node.value
            node = node.next
        
        return default
    
    def remove(self, key):
        """Remove the key-value pair from the hash table."""
        index = self._hash(key)
        node = self.table[index]
        prev = None
        
        while node:
            if node.key == key:
                if prev:
                    prev.next = node.next
                else:
                    self.table[index] = node.next
                self.count -= 1
                return node.value
            prev = node
            node = node.next
        
        raise KeyError(f"Key not found: {key}")
    
    def __setitem__(self, key, value):
        """Support for dictionary-style assignment: hash_table[key] = value"""
        self.put(key, value)
    
    def __getitem__(self, key):
        """Support for dictionary-style access: value = hash_table[key]"""
        value = self.get(key, None)
        if value is None:
            raise KeyError(key)
        return value
    
    def __contains__(self, key):
        """Support for 'in' operator: if key in hash_table"""
        return self.get(key, None) is not None
    
    def __str__(self):
        """Return a string representation of the hash table."""
        result = []
        for i in range(self.size):
            chain = []
            node = self.table[i]
            while node:
                chain.append(f"{node.key}:{node.value}")
                node = node.next
            if chain:
                result.append(f"{i}: {' -> '.join(chain)}")
        return "\n".join(result)

# Example usage
if __name__ == "__main__":
    # Create a hash table
    ht = HashTable(size=5)
    
    # Add some key-value pairs
    ht["apple"] = 10
    ht["banana"] = 20
    ht["orange"] = 30
    ht["grape"] = 40
    ht["mango"] = 50
    
    # Test __str__
    print("Hash Table Contents:")
    print(ht)
    
    # Test get
    print("\nGet values:")
    print(f"apple: {ht.get('apple')}")  # 10
    print(f"banana: {ht.get('banana')}")  # 20
    
    # Test update
    ht["apple"] = 100
    print(f"\nUpdated apple: {ht['apple']}")  # 100
    
    # Test contains
    print(f"\nContains 'orange': {'orange' in ht}")  # True
    print(f"Contains 'pear': {'pear' in ht}")  # False
    
    # Test remove
    print("\nRemoving 'banana'")
    del ht["banana"]
    print(f"Contains 'banana' after removal: {'banana' in ht}")  # False
