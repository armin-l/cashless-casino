# Agent Instructions

When performing tasks, follow these principles:

## Core Principles
- **Test-Driven Development (TDD)**: Write tests before implementing features. Ensure all new functionality is accompanied by corresponding tests and that all existing tests pass.
- **Task Completion**: A task is only complete once it has been verified by running relevant tests, linting, or type-checking commands.
- **Project Tracking**: 
    - Reference the project plan located at `docs/project_plan.md`.
    - Upon completing a milestone or sub-task, update `docs/project_plan.md` by marking the relevant item as finished (`[x]`).
- **Version Control**: Commit changes with descriptive, conventional commit messages immediately after finishing a task and verifying it. Never commit unless explicitly asked.

## Verification Workflow
1.  **Implement/Modify Code**
2.  **Run Tests**: (e.g., `pytest` for backend)
3.  **Lint & Typecheck**: (e.g., `ruff`, `mypy`)
4.  **Update Plan**: Mark items as completed in `docs/project_plan.md`.
5.  **Commit**: Commit the changes and the plan update.
