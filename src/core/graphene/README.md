# Graphene

Graphene _(which is the name for individual layers graphite consists of)_ is a graph definition language used by Graphite to easily describe a graph.

## What Graphene tries to achieve?

Graphene's goal is to allow users to describe their graph with a simple and readable code. Why code and not some UI? Code is faster to type and is a good base for UI abstractions in the future.

## Example

```rust
vertex(A)
vertex(B, 4)

edge(A, B)
edge(A, B, 16)

directedEdge(A, B)
directedEdge(A, B, 16)
```
