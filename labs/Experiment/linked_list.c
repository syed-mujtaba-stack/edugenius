#include "linked_list.h"
#include <stdio.h>
#include <stdlib.h>

// Initialize an empty linked list
void init_list(LinkedList* list) {
    list->head = NULL;
    list->size = 0;
}

// Free all nodes in the linked list
void free_list(LinkedList* list) {
    Node* current = list->head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
    list->head = NULL;
    list->size = 0;
}

// Check if the list is empty
bool is_empty(const LinkedList* list) {
    return list->head == NULL;
}

// Get the size of the list
int size(const LinkedList* list) {
    return list->size;
}

// Create a new node
static Node* create_node(int data) {
    Node* node = (Node*)malloc(sizeof(Node));
    if (node == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(EXIT_FAILURE);
    }
    node->data = data;
    node->next = NULL;
    return node;
}

// Append a node to the end of the list
void append(LinkedList* list, int data) {
    Node* new_node = create_node(data);
    
    if (is_empty(list)) {
        list->head = new_node;
    } else {
        Node* current = list->head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = new_node;
    }
    list->size++;
}

// Prepend a node to the beginning of the list
void prepend(LinkedList* list, int data) {
    Node* new_node = create_node(data);
    new_node->next = list->head;
    list->head = new_node;
    list->size++;
}

// Insert a node at the specified index (0-based)
bool insert_at(LinkedList* list, int index, int data) {
    if (index < 0 || index > list->size) {
        return false;
    }
    
    if (index == 0) {
        prepend(list, data);
        return true;
    }
    
    if (index == list->size) {
        append(list, data);
        return true;
    }
    
    Node* new_node = create_node(data);
    Node* current = list->head;
    
    // Move to the node before the insertion point
    for (int i = 0; i < index - 1; i++) {
        current = current->next;
    }
    
    new_node->next = current->next;
    current->next = new_node;
    list->size++;
    return true;
}

// Remove the node at the specified index (0-based)
bool remove_at(LinkedList* list, int index) {
    if (index < 0 || index >= list->size || is_empty(list)) {
        return false;
    }
    
    Node* to_remove;
    
    if (index == 0) {
        to_remove = list->head;
        list->head = list->head->next;
    } else {
        Node* current = list->head;
        // Move to the node before the one to remove
        for (int i = 0; i < index - 1; i++) {
            current = current->next;
        }
        to_remove = current->next;
        current->next = to_remove->next;
    }
    
    free(to_remove);
    list->size--;
    return true;
}

// Remove the first occurrence of a value from the list
bool remove_value(LinkedList* list, int value) {
    if (is_empty(list)) {
        return false;
    }
    
    if (list->head->data == value) {
        Node* to_remove = list->head;
        list->head = list->head->next;
        free(to_remove);
        list->size--;
        return true;
    }
    
    Node* current = list->head;
    while (current->next != NULL && current->next->data != value) {
        current = current->next;
    }
    
    if (current->next != NULL) {
        Node* to_remove = current->next;
        current->next = to_remove->next;
        free(to_remove);
        list->size--;
        return true;
    }
    
    return false;
}

// Get the value at the specified index (0-based)
int get_at(const LinkedList* list, int index) {
    if (index < 0 || index >= list->size || is_empty(list)) {
        fprintf(stderr, "Index out of bounds\n");
        exit(EXIT_FAILURE);
    }
    
    Node* current = list->head;
    for (int i = 0; i < index; i++) {
        current = current->next;
    }
    
    return current->data;
}

// Check if the list contains a value
bool contains(const LinkedList* list, int value) {
    Node* current = list->head;
    while (current != NULL) {
        if (current->data == value) {
            return true;
        }
        current = current->next;
    }
    return false;
}

// Print the contents of the list
void print_list(const LinkedList* list) {
    Node* current = list->head;
    printf("[");
    while (current != NULL) {
        printf("%d", current->data);
        if (current->next != NULL) {
            printf(", ");
        }
        current = current->next;
    }
    printf("]\n");
}
