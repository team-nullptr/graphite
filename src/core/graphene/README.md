# Graphene

Graphene _(which is the name for individual layers graphite consists of)_ is a graph definition language used by Graphite to easily describe a graph.

```go
vertex(A)
vertex(B, 4)

edge(A, B)
edge(A, B, 16)

arc(A, B)
arc(A, B, 16)
```
