# Graphene

Graphene _(which is the name for individual layers graphite consists of)_ is a graph definition language used by Graphite to easily describe a graph.

## What Graphene tries to achieve?

Graphene's goal is to allow users to describe their graph with a simple and readable code. Why code and not some UI
? Code is faster to type and is a good base for UI abstractions in the future.

## What are neccessary features of Graphene?

- [ ] Adding vertices
- [ ] Defining One-Way and Two-Way edges between vertices
- [ ] Adding weights to edges

How would it even work? In fact it can be a simple interpreted language. The interpreter would execute each expression and apply it to the final graph.

Let's look at an example:

```rust
1 vertex A
2 vertex B
3
4 A.edge(B).weight(13)
5 B.direct(A).weight(10)
```

We can assume that everything is an expression that produces either a `vertex` or an `edge`. After lexing and parsing the source, interpreter would execute each expression.

1. `vertex A` would procude a vertex that can be later referred to as `A`.
2. `A.edge(B).weight(13)` would produce out an edge from `A` to `B` with weight `13`

step `1` is not that hard, it is like a variable declaration. There are many resources that could serve as a reference, for example _"Crafting Interpreters" by Robert Nystrom_.

step `2` is more demanding. We would need some language built-in `Vertex` object that would be created at step `1`. Then the `Vertex` would need to have an `edge` and `direct` methods. Those would produce out an `Edge` built-in object that would have a `weight` method. The key thing is to understand how to implement built-in things (classes? / objects?) in an language. It might be useful to read through chapter discussing classes in _"Crafting Interpreters"_.
