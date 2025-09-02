#include "linked_list.h"
#include <stdio.h>

int main() {
    // Create and initialize a new linked list
    LinkedList list;
    init_list(&list);
    
    printf("Initial list: ");
    print_list(&list);
    
    // Append some values
    printf("\nAppending values 10, 20, 30, 40, 50\n");
    append(&list, 10);
    append(&list, 20);
    append(&list, 30);
    append(&list, 40);
    append(&list, 50);
    print_list(&list);
    printf("List size: %d\n", size(&list));
    
    // Prepend a value
    printf("\nPrepending value 5\n");
    prepend(&list, 5);
    print_list(&list);
    
    // Insert at position
    printf("\nInserting 25 at position 3\n");
    insert_at(&list, 3, 25);
    print_list(&list);
    
    // Get value at position
    printf("\nValue at position 2: %d\n", get_at(&list, 2));
    
    // Check if value exists
    int search_value = 30;
    printf("\nDoes %d exist in the list? %s\n", 
           search_value, 
           contains(&list, search_value) ? "Yes" : "No");
    
    // Remove by value
    int remove_val = 25;
    printf("\nRemoving first occurrence of %d\n", remove_val);
    if (remove_value(&list, remove_val)) {
        printf("Removed successfully. New list: ");
        print_list(&list);
    } else {
        printf("Value %d not found in the list.\n", remove_val);
    }
    
    // Remove at position
    int remove_pos = 2;
    printf("\nRemoving element at position %d\n", remove_pos);
    if (remove_at(&list, remove_pos)) {
        printf("Removed successfully. New list: ");
        print_list(&list);
    } else {
        printf("Invalid position %d\n", remove_pos);
    }
    
    // Free the list
    free_list(&list);
    printf("\nAfter freeing the list, size: %d\n", size(&list));
    
    return 0;
}
