# Todo AI Agent Tool using Mastra AI with Google Gemini Model

## Description

This project demonstrates how to build an intelligent AI agent that can manage a to-do list by leveraging the Mastra AI TypeScript framework and the Google Gemini language model. Instead of directly managing the to-do data, this agent acts as an intermediary, communicating with an existing RESTful Todo API to perform actions like creating, searching, updating, and removing tasks. This approach allows the AI agent to interact with a pre-existing and robust to-do list infrastructure in a standardized way.

## Built With

* **[Mastra AI](https://mastra.ai/).:** A TypeScript framework for building AI agents and applications.
* **TypeScript:** A strongly typed superset of JavaScript.
* **Google Gemini:** A state-of-the-art large language model from Google, used for the AI agent's reasoning and natural language understanding.

## Integrating with the Todo API

This solution takes an interesting approach: instead of directly managing the to-do list within the AI agent itself, it acts as an intermediary by calling an existing RESTful Todo API. This means the AI agent exposes tools that, behind the scenes, interact with your dedicated Todo API to perform actions like creating, searching, updating, and removing todos.

Here's a breakdown of why and how this works:

* **Leveraging Existing Infrastructure:** If you already have a well-established Todo API with its own data storage (like a PostgreSQL database) and business logic, the AI agent can build upon this foundation instead of duplicating it.
* **Abstraction for the AI:** The AI interacting with the agent doesn't need to know the intricacies of your REST API (e.g., specific endpoints, HTTP methods, request bodies). The AI agent presents a simpler, tool-based interface.
* **Focus on Orchestration:** The AI agent's role becomes orchestrating the interaction between the AI's requests and your backend API. It translates the AI's tool calls into the necessary API requests and formats the API responses back for the AI.

In essence, the AI agent defines tools like `create-todo`, `search-todo`, `update-todo`, and `remove-todo`. When an AI agent calls one of these tools with the required parameters, the AI agent will:

1.  Receive the tool call and its arguments.
2.  Construct the appropriate HTTP request to your Todo API based on the called tool and the provided arguments.
3.  Send the request to your Todo API.
4.  Receive the response from the Todo API.
5.  Format the API response into a structured result that the AI can understand, as defined by the Mastra standard and the tool's returns schema.
6.  Return the result to the AI agent.

This design allows you to expose your existing Todo API's functionality to AI agents in a standardized and easily consumable way through the Mastra framework.

## Setting Up the PostgreSQL Database (Todo API Backend)

Before running the Todo API and the AI agent, you need to ensure your PostgreSQL database is set up and the necessary tables are created. Follow these steps within the `Todo_Db_Library` project solution (assuming this is a separate project containing your database setup):

1.  Navigate to the `Todo_Db_Library` project directory in your terminal.

2.  **Generate Database Migration (if needed):** If you've made changes to your database entities (models), you'll need to generate a migration file to reflect those changes. Run the following command:

    ```bash
    npm run typeorm:generate
    ```

    This command will typically create a new migration file in your project's `migrations` directory. Review the generated file to ensure it accurately reflects your intended database schema changes.

3.  **Apply Database Migrations:** Once the migration file (or if you have existing migrations) is ready, apply them to your PostgreSQL database using the following command:

    ```bash
    npm run typeorm:migrate
    ```

    This command will execute any pending migration files, creating or updating the tables in your todo database according to your defined entities.

## Running the Todo REST API

With the database set up, you can now start the Todo REST API. This API will be the backend that our Mastra AI agent communicates with. Follow these steps within the `Todo_API` project solution (assuming this is a separate project for your REST API):

1.  Navigate to the `Todo_API` project directory in your terminal.

2.  **Run the Development Server:** Start the API development server using the following command:

    ```bash
    npm run dev
    ```

    This command will typically start the API server and enable features like hot-reloading for development. Keep this server running in the background.

3.  **Ensure Redis Docker is Running:** This Todo API might rely on Redis for caching or other purposes. Make sure you have a Redis Docker container running. If you don't have it set up, you'll need to install Docker and then run a Redis container. A basic command to run a Redis container is:

    ```bash
    docker run -d -p 6379:6379 redis
    ```

4.  **.env Configuration:** Before running the API, ensure you have a `.env` file in the `Todo_API` project root with the following configuration. Adjust the values as needed to match your local environment, especially the database and Redis connection details.

    ```env
    PORT=3000
    LOG_FORMAT=dev
    LOG_DIR=../logs

    # Database
    DB_HOST=localhost # Or host.docker.internal for local Docker
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=root
    DB_DATABASE=todo

    # Redis
    REDIS_HOST=127.0.0.1 # Or host.docker.internal for local Docker
    # REDIS_USERNAME=username
    # REDIS_PASSWORD=password
    REDIS_DB=0
    REDIS_PORT=6379

    # AES Encryption Key (example)
    AES_ENCRYPTION_KEY=RWw5ejc0Wzjq0i0T2ZTZhcYu44fQI5M7

    # Rate Limit Size (example)
    RATE_LIMITER=100
    ```

## Running the Mastra AI Agent Server

Now, to run the Mastra AI agent that orchestrates the communication with your Todo API:

1.  **How to Generate a Gemini API Key from Google AI Studio:**

    Google AI Studio provides a user-friendly interface to generate API keys for the Gemini models. Follow these steps:

    1.  **Open Google AI Studio:** Go to [https://aistudio.google.com/](https://aistudio.google.com/) in your web browser.
    2.  **Sign In:** Sign in with your Google account. If it's your first time, you might need to agree to the terms of service.
    3.  **Navigate to Get API Key:** In the Google AI Studio interface, look for the "Get API key" button, usually located in the top-left corner. Click on it.
    4.  **Create API Key:** A dialog will appear. Click on the "Create API key" button. You might be prompted to create an API key in a new project or select an existing one. Choose your preferred option.
    5.  **Copy Your API Key:** Once the API key is generated, a pop-up will display your key. **Click the "Copy" button to copy the API key to your clipboard.**
    6.  **Secure Your API Key:** **This is crucial!** Treat your API key like a password. Do not share it publicly, do not commit it directly to your code repository, and store it securely.
    7.  **Paste into `.env`:** Paste the copied API key into your `.env` file for the `GOOGLE_GENERATIVE_AI_API_KEY` variable as shown above.

2.  Navigate to the `Todo_Mastra_AI/todo_ai_agent` directory in your terminal.

3.  **Create `.env` File:** If you don't have one already, create a `.env` file in this directory.

4.  **Add Configuration to `.env`:** Add the following environment variables to the `.env` file:

    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=YOUR_GIMINI_KEY
    ENCRYPTION_KEY=RWw5ejc0Wzjq0i0T2ZTZhcYu44fQI5M7
    BASE_URL=http://localhost:3000 # The base URL of your Todo REST API
    ```

    * Replace `YOUR_GIMINI_KEY` with the actual Google Gemini API key you obtained.
    * Ensure `BASE_URL` points to the correct address and port where your Todo REST API is running.

5.  **Run the Mastra Development Server:** Execute the following command in your terminal:

    ```bash
    npm run dev
    ```

    This command will start the Mastra development server.

6.  **Access the Playground:** Once the server is running, you can typically access the Mastra Playground in your web browser at:

    ```
    http://localhost:4111/
    ```

    Here, you can interact with the `Todo Assistant` agent and test its ability to create, search, update, and remove todos by communicating with your backend Todo REST API through the defined tools.

Now you have a fully functional AI agent powered by Gemini and Mastra AI that can manage your to-do list by interacting with an existing RESTful API!