# Architecture

This project follows Feature-Sliced Design (FSD) 2.1 methodology.

## Layers

- **app**: Application initialization, providers, routing
- **pages**: Complete pages/screens
- **widgets**: Complex UI blocks
- **features**: User scenarios and business features
- **entities**: Business entities
- **shared**: Reusable utilities and UI components

## Import Rules

- Higher layers can import from lower layers
- Same-level imports are restricted
- Shared layer is available to all layers
