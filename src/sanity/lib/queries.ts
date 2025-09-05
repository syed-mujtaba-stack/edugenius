import { groq } from 'next-sanity'

// Get all blog posts
export const allBlogPostsQuery = groq`
*[_type == "blogPost"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  "author": author->{
    name,
    role,
    "image": image.asset->url
  },
  "mainImage": mainImage.asset->url,
  "categories": categories[]->{
    title,
    slug,
    color
  },
  publishedAt,
  readTime,
  tags,
  stats
}
`

// Get a single blog post by slug
export const blogPostBySlugQuery = groq`
*[_type == "blogPost" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  "author": author->{
    name,
    role,
    "image": image.asset->url,
    bio
  },
  "mainImage": mainImage.asset->url,
  "categories": categories[]->{
    title,
    slug,
    color
  },
  publishedAt,
  readTime,
  tags,
  body,
  stats
}
`

// Get all categories
export const allCategoriesQuery = groq`
*[_type == "category"] | order(title asc) {
  _id,
  title,
  slug,
  description,
  color
}
`

// Get featured blog post (most recent)
export const featuredBlogPostQuery = groq`
*[_type == "blogPost"] | order(publishedAt desc)[0] {
  _id,
  title,
  slug,
  excerpt,
  "author": author->{
    name,
    role,
    "image": image.asset->url
  },
  "mainImage": mainImage.asset->url,
  "categories": categories[]->{
    title,
    slug,
    color
  },
  publishedAt,
  readTime,
  tags,
  stats
}
`

// Get blog posts by category
export const blogPostsByCategoryQuery = groq`
*[_type == "blogPost" && $categoryId in categories[]._ref] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  "author": author->{
    name,
    role,
    "image": image.asset->url
  },
  "mainImage": mainImage.asset->url,
  "categories": categories[]->{
    title,
    slug,
    color
  },
  publishedAt,
  readTime,
  tags,
  stats
}
`