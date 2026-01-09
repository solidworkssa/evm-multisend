# Contributing to EVM MultiSend

Thank you for your interest in contributing to EVM MultiSend! We welcome contributions from the community to help make this project better. Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
  - [Frontend](#frontend)
  - [Smart Contracts](#smart-contracts)
- [Coding Standards](#coding-standards)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/evm-multisend.git
    cd evm-multisend
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Set up environment variables**:
    - Copy `.env.example` to `.env.local` (for frontend) or `.env` (for hardhat/scripts).
    - Fill in the required values (e.g., `NEXT_PUBLIC_PROJECT_ID`).

## Development Workflow

1.  **Create a new branch** for your feature or fix.
    -   Use a descriptive name: `feature/add-new-network` or `fix/typo-in-readme`.
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  **Make your changes**.
3.  **Commit your changes** using clear and descriptive commit messages.
    -   We encourage keeping commits granular and specific.
4.  **Push to your fork**:
    ```bash
    git push origin feature/your-feature-name
    ```

## Project Structure

-   `contracts/`: Solidity smart contracts (Hardhat).
-   `src/`: Next.js frontend source code (components, pages, hooks).
-   `scripts/`: Deployment and utility scripts.
-   `test/`: Tests for smart contracts.
-   `public/`: Static assets.

## Running Locally

### Frontend

The frontend is built with Next.js.

1.  Start the development server:
    ```bash
    npm run dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Smart Contracts

The smart contracts are managed with Hardhat.

1.  Compile contracts:
    ```bash
    npx hardhat compile
    ```
2.  Run tests:
    ```bash
    npx hardhat test
    ```
3.  Start a local hardhat node:
    ```bash
    npx hardhat node
    ```

## Coding Standards

-   **Linting**: Please ensure your code passes the linting checks.
    ```bash
    npm run lint
    ```
-   **Solidity**: Follow standard Solidity best practices (security, gas optimization).
-   **TypeScript**: Ensure strict type checking is satisfied.

## Submitting a Pull Request

1.  Ensure your code builds and tests pass locally.
2.  Open a Pull Request (PR) against the `main` branch of the original repository.
3.  Fill out the PR template with details about your changes.
4.  Link any relevant issues (e.g., `Fixes #123`).
5.  Wait for review and address any feedback.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on the GitHub repository. Provide as much detail as possible, including steps to reproduce bugs or clear requirements for features.
