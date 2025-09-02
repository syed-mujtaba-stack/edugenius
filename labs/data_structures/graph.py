"""
Graph Implementation

This module provides implementations of both directed and undirected graphs using adjacency lists.
"""
from collections import deque
from typing import Dict, List, Set, Optional, Union, Tuple

class Graph:
    """Base graph class that can be directed or undirected."""
    
    def __init__(self, directed: bool = False):
        """Initialize a graph.
        
        Args:
            directed: If True, creates a directed graph. Undirected by default.
        """
        self.adj_list: Dict[Union[str, int], List[Tuple[Union[str, int], int]]] = {}
        self.directed = directed
    
    def add_vertex(self, vertex: Union[str, int]) -> None:
        """Add a vertex to the graph if it doesn't exist."""
        if vertex not in self.adj_list:
            self.adj_list[vertex] = []
    
    def add_edge(self, v1: Union[str, int], v2: Union[str, int], weight: int = 1) -> None:
        """Add an edge between two vertices with an optional weight."""
        if v1 not in self.adj_list:
            self.add_vertex(v1)
        if v2 not in self.adj_list:
            self.add_vertex(v2)
            
        # Add edge from v1 to v2
        if (v2, weight) not in self.adj_list[v1]:
            self.adj_list[v1].append((v2, weight))
            
            # If undirected, add edge in the opposite direction
            if not self.directed:
                self.adj_list[v2].append((v1, weight))
    
    def remove_edge(self, v1: Union[str, int], v2: Union[str, int]) -> bool:
        """Remove an edge between two vertices."""
        if v1 in self.adj_list and v2 in self.adj_list:
            # Remove v2 from v1's neighbors
            self.adj_list[v1] = [(v, w) for v, w in self.adj_list[v1] if v != v2]
            
            # If undirected, remove v1 from v2's neighbors
            if not self.directed:
                self.adj_list[v2] = [(v, w) for v, w in self.adj_list[v2] if v != v1]
            return True
        return False
    
    def remove_vertex(self, vertex: Union[str, int]) -> bool:
        """Remove a vertex and all its edges from the graph."""
        if vertex not in self.adj_list:
            return False
            
        # Remove all edges to this vertex
        for v in self.adj_list:
            self.adj_list[v] = [(v2, w) for v2, w in self.adj_list[v] if v2 != vertex]
        
        # Remove the vertex
        del self.adj_list[vertex]
        return True
    
    def get_vertices(self) -> List[Union[str, int]]:
        """Return a list of all vertices in the graph."""
        return list(self.adj_list.keys())
    
    def get_edges(self) -> List[Tuple[Union[str, int], Union[str, int], int]]:
        """Return a list of all edges in the graph as (v1, v2, weight) tuples."""
        edges = []
        for v1 in self.adj_list:
            for v2, weight in self.adj_list[v1]:
                # For undirected graphs, only include each edge once
                if self.directed or v1 < v2:
                    edges.append((v1, v2, weight))
        return edges
    
    def bfs(self, start: Union[str, int]) -> List[Union[str, int]]:
        """Perform breadth-first search starting from the given vertex."""
        if start not in self.adj_list:
            return []
            
        visited = set()
        queue = deque([start])
        result = []
        
        while queue:
            vertex = queue.popleft()
            if vertex not in visited:
                visited.add(vertex)
                result.append(vertex)
                # Add all unvisited neighbors to the queue
                for neighbor, _ in self.adj_list[vertex]:
                    if neighbor not in visited:
                        queue.append(neighbor)
        
        return result
    
    def dfs(self, start: Union[str, int]) -> List[Union[str, int]]:
        """Perform depth-first search starting from the given vertex."""
        if start not in self.adj_list:
            return []
            
        visited = set()
        result = []
        
        def _dfs(vertex):
            visited.add(vertex)
            result.append(vertex)
            for neighbor, _ in self.adj_list[vertex]:
                if neighbor not in visited:
                    _dfs(neighbor)
        
        _dfs(start)
        return result
    
    def dijkstra(self, start: Union[str, int], end: Union[str, int]) -> Tuple[List[Union[str, int]], int]:
        """Find the shortest path between two vertices using Dijkstra's algorithm."""
        if start not in self.adj_list or end not in self.adj_list:
            return [], float('inf')
            
        # Initialize distances and previous nodes
        distances = {v: float('inf') for v in self.adj_list}
        previous = {v: None for v in self.adj_list}
        distances[start] = 0
        
        # Priority queue (vertex, distance)
        import heapq
        pq = [(0, start)]
        
        while pq:
            current_dist, current_vertex = heapq.heappop(pq)
            
            # If we've already found a better path, skip
            if current_dist > distances[current_vertex]:
                continue
                
            # Stop if we've reached the end vertex
            if current_vertex == end:
                break
                
            # Check all neighbors
            for neighbor, weight in self.adj_list[current_vertex]:
                distance = current_dist + weight
                
                # If we found a shorter path to the neighbor
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous[neighbor] = current_vertex
                    heapq.heappush(pq, (distance, neighbor))
        
        # Reconstruct the path
        path = []
        current = end
        while current is not None:
            path.append(current)
            current = previous[current]
        path.reverse()
        
        # Return the path and total distance
        return (path, distances[end]) if end in distances and distances[end] != float('inf') else ([], float('inf'))
    
    def __str__(self) -> str:
        """Return a string representation of the graph."""
        result = []
        for vertex in self.adj_list:
            connections = ", ".join(f"{v}({w})" for v, w in self.adj_list[vertex])
            result.append(f"{vertex} -> {connections}")
        return "\n".join(result)

# Example usage
if __name__ == "__main__":
    # Create an undirected graph
    print("Undirected Graph:")
    g = Graph(directed=False)
    
    # Add vertices and edges
    g.add_edge('A', 'B', 4)
    g.add_edge('A', 'C', 2)
    g.add_edge('B', 'C', 1)
    g.add_edge('B', 'D', 5)
    g.add_edge('C', 'D', 8)
    g.add_edge('C', 'E', 10)
    g.add_edge('D', 'E', 2)
    
    # Print the graph
    print("Graph structure:")
    print(g)
    
    # Test BFS and DFS
    print("\nBFS starting from A:", g.bfs('A'))
    print("DFS starting from A:", g.dfs('A'))
    
    # Test shortest path
    start, end = 'A', 'E'
    path, distance = g.dijkstra(start, end)
    print(f"\nShortest path from {start} to {end}:")
    print(f"Path: {' -> '.join(path)}" if path else "No path exists")
    print(f"Total distance: {distance}" if path else "")
    
    # Create a directed graph
    print("\nDirected Graph:")
    dg = Graph(directed=True)
    dg.add_edge('A', 'B', 1)
    dg.add_edge('B', 'C', 2)
    dg.add_edge('C', 'A', 3)
    dg.add_edge('C', 'D', 4)
    
    print("Directed graph structure:")
    print(dg)
