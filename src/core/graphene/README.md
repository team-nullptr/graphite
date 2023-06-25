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
vertex(A)
vertex(B)

A.edge(B).weight(13)
B.direct(A).weight(10)
```

```
call ::= identifier ("(" arguments? ")")* ;
arguments ::= expression ( "," expression )* ;
expression ::=
```
