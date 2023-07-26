# Graphene

Graphene _(which is the name for individual layers graphite consists of)_ is a graph definition language used by Graphite to easily describe a graph.

## Notes

This language is still work in progress. Errors can be weird and inaccurate. For example if you will try to connect vertiecs which do not exist you will just see some js error thrown internally. Just ignore it for now, syntax is not too complicated and the rest of this document covers every available feature.

If you want to be sure it works

- Check if vertex exists when you use it
- If you define the same vertex (with the same id) twice the latter will be used

## Quick Start

### Vertices

Creating a single vertex

```rust
vertex(A)
```

Creating a vertex with a value

```rust
vertex(A, 21)
```

<br/>

Creating multiple vertices with a single vertex statement.

```rust
vertex([B, C, D, E, F, G, H, I, J])
vertex([B, C, D, E, F, G, H, I, J], 37)
```

<br/>

### Edges

Connecting two vertices with an edge

```rust
edge(A, B)
```

Similarly to `vertex` statement `edge` takes optional weight argument

```rust
edge(A, B, 4)
```

We can connect vertex with many vertices using single `edge` statement

```rust
edge(A, [B, C, D, E, F, G], 2)
```

There is separate statement for directed edges called an `arc`. It can be used **exactly the same as an `edge` statement**.

```rust
arc(A, [B, C, D, E, F, G], 0)
```

Example

```rust
vertex([A, B, C, D, E, F, G, H, I, J, K])

edge(A, [B, C, D, E, F, G, H, I, J, K])

arc(F, H)
arc(H, C)
arc(C, E)
arc(E, K)
arc(K, F)

arc(F, G)
arc(G, J)
arc(J, B)
arc(B, D)
arc(D, I)
arc(I, F)
```

## Detailed info

vertex id (`A` and `B` in `edge(A, B)`) can be any text without numbers or spaces. Example valid vertex id's are `A, AA, THISISVALID, thisisvalidtoo` (this list does not contain every valid example)

Value can be an any unsigned integer value. Just keep in mind it is transformed with `parseInt` into js number under the hood, so it's maximum value is the same as javascipt's number maximum value.

<br/>

_If you want to truly see how values are transformed look at graphene's lexer, parser and interpreter that are located in the same directory as this document. I have no idea about making languages so feel free to leave suggestions in an issue._

<br/>
<br/>

---

<br/>
<br/>

_Everything in this document can be changed in the future. It is compatible with currently deployed version of the app._
