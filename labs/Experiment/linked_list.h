#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include <stdbool.h>

// Node structure for the linked list
typedef struct Node {
    int data;
    struct Node* next;
} Node;

// Linked list structure
typedef struct {
    Node* head;
    int size;
} LinkedList;

// Function declarations
void init_list(LinkedList* list);
void free_list(LinkedList* list);
bool is_empty(const LinkedList* list);
int size(const LinkedList* list);
void append(LinkedList* list, int data);
void prepend(LinkedList* list, int data);
bool insert_at(LinkedList* list, int index, int data);
bool remove_at(LinkedList* list, int index);
bool remove_value(LinkedList* list, int value);
int get_at(const LinkedList* list, int index);
bool contains(const LinkedList* list, int value);
void print_list(const LinkedList* list);

#endif // LINKED_LIST_H
