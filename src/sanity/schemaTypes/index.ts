import { type SchemaTypeDefinition } from 'sanity'

// Import schema types
import blockContent from './blockContent'
import category from './category'
import author from './author'
import blogPost from './blogPost'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Document types
    blogPost,
    author,
    category,
    // Other types
    blockContent,
  ],
}
