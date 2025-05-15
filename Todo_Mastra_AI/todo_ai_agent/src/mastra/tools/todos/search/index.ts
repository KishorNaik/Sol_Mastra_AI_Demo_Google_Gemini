import { createTool } from "@mastra/core";
import { z } from "zod";
import { ISearchTodosApiServiceResult, SearchTodosApiService } from "./services";

const searchTodoApiService=new SearchTodosApiService();

const todoItemSchema: z.ZodType<ISearchTodosApiServiceResult> = z.object({
  identifier: z.string(),
  title: z.string(),
  description: z.string(),
  isCompleted: z.boolean(),
});

export const searchTodoTool=createTool({
    id:"search-todo",
    description:`
        This tool enables the AI to search for existing to-do items based on keywords or phrases present in their titles.
        When invoked, the AI should provide a search term, and the tool will return a list of all to-do items whose titles contain that term.
        This is useful for the AI to recall specific tasks, find related items in the to-do list, or check if a particular task has already been added.
        The AI should use this tool when the user asks to find a to-do, wants to check for the existence of a task, or needs to retrieve a list of tasks related to a specific topic.
        The search is not case-sensitive and will look for the provided term anywhere within the to-do item's title.

        ## Usage ##
        The AI should use this tool when the user asks to find a to-do, wants to check for the existence of a task, or needs to retrieve a list of tasks related to a specific topic.
        The search is not case-sensitive and will look for the provided term anywhere within the to-do item's title. It will use for the update of the to-do list based on the identifier

        ## Parameters ##
        - title: The keyword or phrase to search for within the titles of existing to-do items.
                This should be the term the user is looking for or a relevant keyword to the task the AI is trying to find.

        ## Returns ##
        A list of to-do items whose titles contain the provided search term.An array of objects, each representing a task with properties identifier, title, and description.
        # Schema #
        - identifier: The unique identifier of the to-do item.
        - title: The title of the to-do item.
        - description: The description of the to-do item.
        - isCompleted: A boolean indicating whether the to-do item has been completed or not.
        # Example #
        [{
            "identifier": "4280b487-f3d7-43b2-b7ec-38e8f9e8850g",
            "title": "Buy groceries",
            "description": "Milk, eggs, bread"
            "isCompleted":true
        },
        {
            "identifier": "4280b487-f3d7-43b2-b7ec-38e8f9e885jk",
            "title": "Finish report",
            "description": "Complete the report by Friday",
            "isCompleted":true
        }]


        ## Prompt Example ##
        User: "Find tasks related to shopping"
        AI: "I found the following tasks related to shopping: [Task 1, Task 2, Task 3]"

        User: "What tasks have I completed?"
        AI: "I found the following completed tasks: [Task 1, Task 2, Task 3]"

        User: "I need to find a task"
        AI: "I found the following tasks: [Task 1, Task 2, Task 3]"
    `,
    inputSchema:z.object({
            title: z
                .string()
                .describe(
                    'The concise name or heading of the to-do item. This should be a brief summary of the task or item to be added to the list.'
                )
        }),
    outputSchema: z.array(todoItemSchema).describe('A list of to-do items matching the search term.'),
    execute:async ({context})=>{
        const {title}=context;

        const searchTodosApiServiceResult = await searchTodoApiService.handleAsync({
                title: title,
            });

        if (searchTodosApiServiceResult.isErr())
            return []

        return searchTodosApiServiceResult.value;
    }
})