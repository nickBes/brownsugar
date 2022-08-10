# Brownsugar
Brownsugar is a simple library for managing results and options in typescript.
> Table of contents:
- [Brownsugar](#brownsugar)
- [Setup](#setup)
- [Docs](#docs)
  - [Options](#options)
  - [Results](#results)
  - [Array methods](#array-methods)

# Setup
1. Install the package
   
    ```
    npm install brownsugar
    ```
2. Enable strict mode inside tsconfig.json
    
    ```json
    {
        "compilerOptions": {
            // ...
            "strict": true
        }
    }
    ```
    This will enable strict type checking which is required for correct usage of the library.

# Docs
## Options
Options are structures which let you handle values that might be `undefined` or `null`.

But, sometimes when using options you might write redundant code.

For example:
```ts
import { Option } from "brownsugar"

function nullable(): string | null {...}

const value = Option.from(nullable())
                    .unwrapOr("default string")
```

Which is equivalent to:
```ts
const value = nullable() ?? "default string"
```
## Results
## Array methods