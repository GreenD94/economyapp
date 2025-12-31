# Coding Standards and Best Practices

This document outlines the coding standards, architectural patterns, and best practices for this project. All developers must follow these guidelines to ensure code quality, maintainability, and consistency.

## Table of Contents
1. [Code Quality Principles](#code-quality-principles)
2. [Naming Conventions](#naming-conventions)
3. [Project Structure](#project-structure)
4. [TypeScript & Type Safety](#typescript--type-safety)
5. [Component Architecture](#component-architecture)
6. [API & Data Fetching](#api--data-fetching)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)
9. [Performance](#performance)
10. [Testing](#testing)

---

## Code Quality Principles

### Eloquent Conditionals
**Always use descriptive boolean variables/functions instead of direct comparisons.**

❌ **Incorrect:**
```typescript
if (admin.role === 1) { ... }
if (user.age >= 18) { ... }
if (status === 'active') { ... }
```

✅ **Correct:**
```typescript
if (isAdmin) { ... }
if (isAdult) { ... }
if (isActive) { ... }
```

**Rule:** Extract conditions into well-named boolean variables or functions that clearly express intent.

---

### Descriptive Naming
**All variables, functions, and components must have descriptive, self-documenting names.**

❌ **Incorrect:**
```typescript
const d = new Date();
const u = getUser();
const btn = <Button />;
function calc(x, y) { ... }
```

✅ **Correct:**
```typescript
const currentDate = new Date();
const currentUser = getUser();
const submitButton = <Button />;
function calculateTotalPrice(price: number, tax: number): number { ... }
```

**Rules:**
- Use full words, not abbreviations
- Function names should be verbs (e.g., `getUser`, `calculateTotal`, `validateEmail`)
- Component names should be nouns in PascalCase (e.g., `UserProfile`, `GraphContainer`)
- Boolean variables should start with `is`, `has`, `should`, `can`, etc. (e.g., `isLoading`, `hasPermission`)

---

### Code Language
**All code, comments (if needed), variable names, function names, and documentation must be in English.**

---

### No Comments
**Do not write comments in the code. Code should be self-documenting through:**
- Descriptive naming
- Clear function structure
- Well-organized code
- Type definitions

If code needs explanation, refactor it to be more readable instead of adding comments.

---

## Project Structure

### Vertical Slicing with Modularity
**Organize code by features using vertical slicing. Each feature is self-contained.**

```
features/
  ├── graphs/
  │   ├── components/
  │   │   ├── graph.graph-line-chart.tsx
  │   │   └── graph.graph-bar-chart.tsx
  │   ├── containers/
  │   │   └── graph.general-graphs.container.tsx
  │   ├── types/
  │   │   └── graph.types.ts
  │   ├── hooks/
  │   │   └── graph.use-graph-data.ts
  │   ├── utils/
  │   │   └── graph.formatters.ts
  │   └── server-actions/
  │       └── graph.server-actions.ts
  ├── users/
  │   ├── components/
  │   ├── containers/
  │   ├── types/
  │   ├── hooks/
  │   ├── utils/
  │   └── server-actions/
  └── core/
      ├── components/
      ├── types/
      ├── utils/
      └── constants/
```

**Rules:**
- Each feature folder contains all related code (components, containers, types, hooks, utils, server-actions)
- Features are independent and can be developed in parallel
- Shared code goes in `features/core/`

---

### Container Pattern
**Pages are thin wrappers that import from feature containers. All business logic stays in features.**

**Structure:**
```
app/
  └── graphs/
      └── page.tsx  (thin wrapper)

features/
  └── graphs/
      └── containers/
          └── graph.general-graphs.container.tsx  (actual implementation)
```

**Example:**

`app/graphs/page.tsx`:
```typescript
import { GeneralGraphsContainer } from '@/features/graphs/containers/graph.general-graphs.container';

export default function GraphsPage() {
  return <GeneralGraphsContainer />;
}
```

`features/graphs/containers/graph.general-graphs.container.tsx`:
```typescript
'use client';

import { GraphLineChart } from '../components/graph.graph-line-chart';
import { useGraphData } from '../hooks/graph.use-graph-data';

export function GeneralGraphsContainer() {
  const { data, isLoading } = useGraphData();
  
  if (isLoading) return <div>Loading...</div>;
  
  return <GraphLineChart data={data} />;
}
```

**Rules:**
- Framework-specific code (Next.js pages) should be minimal
- All business logic, state management, and UI logic lives in features
- Containers are client components that orchestrate feature components

---

### File Naming Convention
**Files must include the folder name in singular form after a dot.**

**Rules:**
- Folders are **plural** (e.g., `graphs/`, `users/`, `components/`)
- Files include the **singular** folder name after a dot (e.g., `graph.line-chart.tsx`, `user.profile.tsx`)
- Use kebab-case for file names
- Use PascalCase for component file names

**Examples:**
```
features/graphs/
  ├── components/
  │   ├── graph.line-chart.tsx
  │   ├── graph.bar-chart.tsx
  │   └── graph.pie-chart.tsx
  ├── containers/
  │   └── graph.general-graphs.container.tsx
  ├── types/
  │   └── graph.types.ts
  └── server-actions/
      └── graph.server-actions.ts
```

---

## TypeScript & Type Safety

### No `any`, `unknown`, `null`, or `undefined`
**Strictly avoid using `any`, `unknown`, `null`, or `undefined` types. These types defeat the purpose of TypeScript's type safety and violate clean code principles.**

❌ **Incorrect:**
```typescript
function processData(data: any) { ... }
function processData(data: unknown) { ... }
let user: User | null = null;
let name: string | undefined;
const result = value as unknown as TargetType;
```

✅ **Correct:**
```typescript
function processData(data: UserData) { ... }
let user: User = emptyUser;
let name: string = "";
// Use proper types instead of type assertions
function processData(data: UserData): Result<User> { ... }
```

**Rules:**
- Never use `any` - it disables all type checking
- Never use `unknown` as a type escape hatch - use proper types or type guards instead
- Never use `null` - use empty constants or default values
- Never use `undefined` - use default values or optional properties with defaults
- Never use `as unknown as` type assertions - refactor to use proper types

---

### Avoid Null Initialization
**Use default values instead of null initialization.**

❌ **Incorrect:**
```typescript
let name: string | null = null;
let isValid: boolean | null = null;
let age: number | null = null;
let user: User | null = null;
```

✅ **Correct:**
```typescript
let name: string = "";
let isValid: boolean = false;
let age: number = 0;
let user: User = emptyUser;
```

---

### Empty Object Constants
**For complex types (objects), define empty constants in `features/core/constants/`.**

**Example:**

`features/core/constants/user.constants.ts`:
```typescript
import { User } from '../types/user.types';

export const emptyUser: User = {
  id: "",
  name: "",
  email: "",
  age: 0,
  isActive: false,
  role: "guest",
  createdAt: new Date(0),
};
```

**Usage:**
```typescript
import { emptyUser } from '@/features/core/constants/user.constants';

let currentUser: User = emptyUser;
```

**Rules:**
- All empty object constants go in `features/core/constants/`
- File naming: `{type}.constants.ts` (e.g., `user.constants.ts`, `role.constants.ts`)
- Export constants with descriptive names (e.g., `emptyUser`, `emptyRole`, `defaultSettings`)

---

## Component Architecture

### SOLID Principles
**All code must follow SOLID principles:**

1. **Single Responsibility:** Each component/function does one thing
2. **Open/Closed:** Open for extension, closed for modification
3. **Liskov Substitution:** Derived classes must be substitutable for their base classes
4. **Interface Segregation:** Many specific interfaces are better than one general interface
5. **Dependency Inversion:** Depend on abstractions, not concretions

---

### Clean Code Principles
**Follow clean code best practices:**
- Functions should be small and focused
- Avoid deep nesting (max 2-3 levels)
- Use early returns to reduce nesting
- Extract complex logic into separate functions
- Keep functions pure when possible
- Avoid side effects in functions

---

### Componentization
**Componentize UI in a way that makes it easy to locate main UI elements.**

**Structure:**
```
features/graphs/components/
  ├── graph.line-chart.tsx          (main chart component)
  ├── graph.chart-legend.tsx        (legend sub-component)
  ├── graph.chart-tooltip.tsx       (tooltip sub-component)
  └── graph.chart-controls.tsx      (controls sub-component)
```

**Rules:**
- Main UI elements should be clearly identifiable by their file names
- Break down complex components into smaller, focused sub-components
- Group related components in the same folder
- Use composition over inheritance

---

## API & Data Fetching

### Server Actions Only
**All API calls must be made strictly through Next.js Server Actions.**

**Structure:**
```
features/
  └── graphs/
      └── server-actions/
          └── graph.server-actions.ts
```

**Example:**

`features/graphs/server-actions/graph.server-actions.ts`:
```typescript
'use server';

import { GraphData } from '../types/graph.types';

export async function getGraphData(): Promise<GraphData> {
  // Server-side API call logic
  const response = await fetch('...');
  return response.json();
}

export async function createGraphData(data: GraphData): Promise<GraphData> {
  // Create logic
}

export async function updateGraphData(id: string, data: Partial<GraphData>): Promise<GraphData> {
  // Update logic
}

export async function deleteGraphData(id: string): Promise<void> {
  // Delete logic
}
```

**Rules:**
- All server actions must be in `features/{feature}/server-actions/` folder
- File naming: `{feature}.server-actions.ts`
- Server actions must be marked with `'use server'` directive
- Never make direct API calls from client components

---

### CRUD Pattern
**Every server action module must implement the 4 CRUD functions.**

**Required Functions:**
1. **Create:** `create{Entity}(data: EntityData): Promise<Entity>`
2. **Read:** `get{Entity}(id?: string): Promise<Entity | Entity[]>` or `get{Entity}List(): Promise<Entity[]>`
3. **Update:** `update{Entity}(id: string, data: Partial<EntityData>): Promise<Entity>`
4. **Delete:** `delete{Entity}(id: string): Promise<void>`

**Example:**
```typescript
'use server';

export async function createGraph(data: GraphData): Promise<Graph> { ... }
export async function getGraph(id: string): Promise<Graph> { ... }
export async function getGraphList(): Promise<Graph[]> { ... }
export async function updateGraph(id: string, data: Partial<GraphData>): Promise<Graph> { ... }
export async function deleteGraph(id: string): Promise<void> { ... }
```

---

### Axios Usage
**Use Axios for all HTTP requests in server actions.**

**Example:**
```typescript
'use server';

import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
});

export async function getGraphData(): Promise<GraphData> {
  const response = await apiClient.get<GraphData>('/graphs');
  return response.data;
}
```

**Rules:**
- Configure Axios instance in `features/core/utils/api.client.ts`
- Use typed responses with TypeScript generics
- Handle errors appropriately (see Error Handling section)

---

## State Management

### React Query (TanStack Query)
**Use React Query for all client-side data fetching and state management.**

**Example:**
```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getGraphData, createGraphData } from '../server-actions/graph.server-actions';

export function useGraphData() {
  return useQuery({
    queryKey: ['graphs'],
    queryFn: getGraphData,
  });
}

export function useCreateGraph() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createGraphData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['graphs'] });
    },
  });
}
```

**Rules:**
- Create custom hooks in `features/{feature}/hooks/` folder
- File naming: `{feature}.use-{hook-name}.ts`
- Use React Query for all async state management
- Avoid useState for server data

---

## Error Handling

### Error Boundaries
**Implement error boundaries for graceful error handling.**

### Server Action Error Handling
**Always handle errors in server actions and return typed error responses.**

**Example:**
```typescript
'use server';

type Result<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function getGraphData(): Promise<Result<GraphData>> {
  try {
    const data = await fetchGraphData();
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```

---

## Performance

### Code Splitting
- Use dynamic imports for large components
- Lazy load routes when appropriate

### Memoization
- Use `React.memo` for expensive components
- Use `useMemo` and `useCallback` appropriately (don't overuse)

### Image Optimization
- Use Next.js `Image` component for all images
- Provide proper `alt` attributes

---

## Testing

### Test Structure
**Tests should mirror the feature structure:**

```
features/graphs/
  ├── components/
  │   └── __tests__/
  │       └── graph.line-chart.test.tsx
  ├── containers/
  │   └── __tests__/
  │       └── graph.general-graphs.container.test.tsx
  └── server-actions/
      └── __tests__/
          └── graph.server-actions.test.ts
```

**Rules:**
- Write tests for all components, containers, and server actions
- Use descriptive test names that explain what is being tested
- Follow AAA pattern (Arrange, Act, Assert)

---

## Additional Best Practices

### Type Definitions
- Define all types in `features/{feature}/types/` folder
- File naming: `{feature}.types.ts`
- Export types with descriptive names
- Use interfaces for object shapes, types for unions/intersections

### Utility Functions
- Place utility functions in `features/{feature}/utils/` folder
- File naming: `{feature}.{purpose}.ts` (e.g., `graph.formatters.ts`, `user.validators.ts`)
- Keep utilities pure and testable
- Shared utilities go in `features/core/utils/`

### Constants
- Define constants in `features/{feature}/constants/` or `features/core/constants/`
- File naming: `{feature}.constants.ts`
- Use UPPER_SNAKE_CASE for constant values
- Group related constants together

### Environment Variables
- Use `.env.local` for local development
- Never commit sensitive data
- Validate environment variables at startup

### Git Commit Messages
- Use conventional commits format
- Be descriptive and concise
- Reference issue numbers when applicable

### Code Reviews
- All code must be reviewed before merging
- Reviewers should check adherence to these standards
- Request changes if standards are not met

### Documentation
- Keep this document updated as practices evolve
- Document complex business logic in feature README files if needed
- Use TypeScript types as documentation

---

## Summary Checklist

Before submitting code, ensure:
- [ ] All conditionals use descriptive boolean variables/functions
- [ ] All names are descriptive and self-documenting
- [ ] All code is in English
- [ ] No comments in code
- [ ] Code follows vertical slicing structure
- [ ] Pages are thin wrappers importing from containers
- [ ] File names include singular folder name after dot
- [ ] Folders are plural
- [ ] SOLID and clean code principles are followed
- [ ] Components are properly componentized
- [ ] Axios is used for HTTP requests
- [ ] React Query is used for state management
- [ ] All API calls go through server actions
- [ ] Server actions implement CRUD pattern
- [ ] No `any`, `null`, or `undefined` types
- [ ] No null initialization (use default values)
- [ ] Empty object constants are defined in `features/core/constants/`
- [ ] Shared code is in `features/core/`

---

**Last Updated:** 2024
**Version:** 1.0.0
