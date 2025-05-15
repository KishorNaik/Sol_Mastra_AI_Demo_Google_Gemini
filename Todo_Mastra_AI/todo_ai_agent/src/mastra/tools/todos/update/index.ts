import { createTool } from "@mastra/core";
import { UpdateTodosApiService } from "./services";
import { z } from "zod";

const updateTodosApiService=new UpdateTodosApiService();

export const updateTodoTools= createTool({
    id:"update-todo",
    description:`
      This tool allows the AI to modify an existing to-do item.
      Before using this tool, the AI should first use the 'search_todos' tool to find the specific to-do item by its title or relevant keywords and obtain its unique identifier.
      Once the identifier of the target to-do is known, this tool can be invoked to update its title and/or description.
      The AI should use this tool when the user requests to edit a to-do, correct information in an existing task, or add more details to a previously created item.
      It's crucial that the AI has the correct 'identifier' of the to-do to ensure the intended item is updated.
      If the 'identifier' is unknown, the 'search_todos' tool must be used first to retrieve it.
    `,
    inputSchema:z.object({
        identifier:z.string().describe(`The unique identifier of the to-do item to be updated.`),
        title: z
            .string()
            .describe(
                'The concise name or heading of the to-do item. This should be a brief summary of the task or item to be added to the list.'
            ),
        description: z
            .string()
            .describe(
                'A more detailed explanation or notes about the to-do item. This can include specific details, context, or any additional information relevant to the task.'
            ),
		}),
    outputSchema: z.object({
        message: z.string().describe('A message confirming the successful addition of the to-do item to the list.'),
    }),
    execute:async ({context})=>{
        const {identifier,title,description}=context;

        const addTodosApiServiceResult = await updateTodosApiService.handleAsync({
				title: title,
				description: description,
                identifier:identifier
			});

        if (addTodosApiServiceResult.isErr())
            return {
                message: String(`something went wrong. ${addTodosApiServiceResult.error.message}`)
            } 

        return {
            message: String(`Successfully requested to add a new todo item with title "${title}" and description "${description}".`)
        }
    }
})