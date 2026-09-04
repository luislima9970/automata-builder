# Automata Builder

A TypeScript library for modeling and working with formal automata in a structured, extensible way. The project is currently focused on the API layer: defining the automata model and building a regex interpreter and parser that can compile expressions into NFAs.

## Overview

Automata Builder is intended as a reusable automata toolkit for:

- representing states and transitions
- modeling deterministic and nondeterministic automata
- managing start and accepting states
- validating input against automata logic
- tokenizing and parsing regular expressions
- compiling parsed regular expressions into NFAs
- supporting a future NFA-to-DFA conversion

This repository is designed as a library-first project. The diagrams below document the planned architecture and the stages of the regex compilation pipeline. They are reference models for the implementation, not a claim that every component is already available.

## Architecture Diagrams

### Regex pipeline

![Regex parsing and NFA construction](diagrams/01_regex_pipeline_classes.svg)

![Regex compilation flow](diagrams/05_regex_compilation_flow.svg)

### Syntax tree and automata model

![Token and syntax tree model](diagrams/02_token_and_syntax_node.svg)

![Automata class hierarchy](diagrams/03_automata_hierarchy.svg)

![NFA fragment relationship](diagrams/04_nfa_fragment_relationship.svg)

## Architectural Model

The project is organized around a small set of core abstractions designed to remain clear and extensible.

### Core entities

- State
  - Represents an individual automaton node
  - Stores the state identifier and acceptance status

- Transition
  - Represents a directed connection between two states
  - Encodes the symbol required to traverse the transition, including epsilon-like edge cases when needed

- Automata
  - Serves as the base abstraction for automata implementations
  - Maintains state and transition collections as well as naming metadata
  - Manages the start state and common mutation operations

### Specialized automata

- DFA
  - Deterministic finite automaton
  - Enforces a single valid transition per state and symbol

- NFA
  - Nondeterministic finite automaton
  - Supports multiple possible transitions and acceptance across alternate paths

### Supporting abstractions

- Token
  - Represents a lexical unit with structural metadata

- NFAFragment
  - Models a reusable automata fragment that can be composed into larger structures

- Acceptor
  - Defines the interface for accepting or rejecting input according to automata rules

- RegexParser
  - Converts tokens into a syntax tree for automata construction

- SyntaxNode
  - Represents the recursive structure of a parsed regular expression

- NFAFragment
  - Represents a composable start and end pair during NFA construction

## Regular Expression Language

The implemented regex language supports:

- literal characters, such as `a` and `0`
- epsilon, written as `\e`
- implicit concatenation, such as `ab`
- union with `|`, such as `a|b`
- Kleene star with `*`, such as `a*`
- one-or-more repetition with `+`, such as `a+`
- optional expressions with `?`, such as `a?`
- grouping with parentheses, such as `(a|b)*`
- escaping operators and delimiters with `\`, such as `\+` for a literal plus sign

Repetition binds more tightly than concatenation, and concatenation binds more tightly than union. For example, `ab*|c` is interpreted as `(a(b*))|c`.

The parser and NFA builder are connected through `NFABuilder.buildRegex(regex)`, which parses a regex and returns an executable NFA.

## Development Direction

The intended workflow is organized around the following stages:

1. Regex interpretation
  - tokenize literals, operators, delimiters, and epsilon
  - parse tokens into a syntax tree
  - optionally optimize the syntax tree

2. NFA construction
  - build fragments for literals, concatenation, union, and repetition
  - connect fragments with symbol and epsilon transitions
  - produce an executable NFA

3. Automata behavior
  - create and configure states and transitions
  - run DFA and NFA inputs
  - determine acceptance and inspect execution paths

4. Potential conversion features
  - convert an NFA into an equivalent DFA
  - preserve acceptance behavior during conversion

The regex interpreter, parser, and parser-to-NFA path are implemented and tested. The only remaining core conversion feature is NFA-to-DFA conversion. After that conversion is complete, UI development can begin.

## Design Principles

- Prefer explicit, typed abstractions over implicit behavior.
- Keep the base automata model independent from UI concerns.
- Maintain a clear distinction between core automata logic and higher-level parsing or visualization features.
- Use the UML as the architectural reference for the implementation, rather than introducing ad hoc structures.

## DFA execution cache note

The UML shows the conceptual DFA model, but it does not include the internal optimization used during execution.

The DFA keeps a cached transition index for fast lookup during `run()` and `accepts()` calls:

- outer key: current state id
- inner key: input symbol
- value: the matching transition

This cache is a performance shortcut, not the source of truth. It must be invalidated whenever the transition graph changes because the lookup table can become stale.

That means the cache should be cleared after any mutation that changes the DFA transitions, especially:

- adding a transition
- removing a transition
- removing a state that is connected to those transitions

The reason is simple: the cached index is derived from the current DFA structure, and a stale cache would allow `run()` to use outdated transitions even though the automaton itself has changed.

This is an implementation detail of the execution layer, so it is intentionally not shown in the UML; it exists only to make repeated lookups faster while preserving the same formal DFA behavior.

## Project Scope

The repository is organized as a small workspace: the reusable library lives in `automata-lib/`, and the React UI lives in `app/`. The UI is an early workbench for exercising the library; broader visualization and editing workflows remain future work.

## Status

- Documentation and architecture diagrams: in progress
- Automata API foundation: in progress
- Regex tokenizer: implemented
- Regex interpreter and parser into NFA: implemented
- NFA-to-DFA conversion: remaining core feature
- React workbench: initial setup complete
- Full UI visualization and editing: future work
