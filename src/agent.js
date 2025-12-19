import { z } from 'zod';
import { searchWeb } from './search.js';

/**
 * Registers a tool with the AI runtime that performs a web search using the Tavily client
 * and returns a formatted string of results.
 *
 * @param {ReturnType<typeof import('genkit/beta').genkit>} ai - Genkit instance used to define tools.
 * @param {ReturnType<typeof import('@tavily/core').tavily>} client - Tavily client for performing searches.
 * @returns {ReturnType<typeof ai.defineTool>} Configured search tool ready to be attached to prompts.
 */
export function createSearchTool(ai, client) {
    return ai.defineTool({
        name: 'searchWeb',
        description: 'Searches the web for a user query and returns formatted results.',
        inputSchema: z.object({
            query: z.string().describe('The user query to search for.')
        }),
        outputSchema: z.string().describe('The search results as a formatted string including titles, snippets, and URLs.')

    }, async (input) => {
        const searchResults = await searchWeb(client, input.query, 5);

        const formattedResults = searchResults.results.map((result, index) => {
            return `[${index + 1}] ${result.title}\n URL: ${result.url}\n Content: ${result.content}`;
        }).join('\n');

        return formattedResults;
    });

}

/**
 * Creates a chat agent configured with a search prompt and the web search tool to
 * answer user queries with up-to-date information.
 *
 * @param {ReturnType<typeof import('genkit/beta').genkit>} ai - Genkit instance used to define prompts.
 * @param {ReturnType<typeof import('@tavily/core').tavily>} client - Tavily client passed to the search tool.
 * @param {ReturnType<typeof import('@genkit-ai/google-genai').googleAI.model>} model - Gemini model used by the prompt.
 * @returns {ReturnType<typeof ai.chat>} Chat agent capable of handling user queries.
 */
export function createChatAgent (ai, client, model) {
 
    const searchTool = createSearchTool(ai, client);
    const searchPrompt = ai.definePrompt({
        name: 'searchPrompt',
        description: 'Prompt that searches the web to answer user queries based on current information.',
        model: model,
        input: {
            schema: z.object({
                query: z.string().min(1).max(200).describe('The user query to search for.')
            })
        },
        tools: [searchTool],
        prompt: `You are a helpful AI assistant that provides comprehensive and accurate answers based on web search results.

                User Query: {{query}}

                Instructions:
                1. Provide a comprehensive answer to the user's query based on the search results above
                2. Synthesize information from multiple sources when relevant
                3. Be factual and cite specific sources using [1], [2], etc. notation
                4. If the search results don't contain enough information, acknowledge this
                5. Keep the answer clear and well-structured
                6. Use markdown formatting for better readability
                7. Please use the tool searchWeb always when you need to look up current information
                8. Add a section at the end titled "Sources" listing the URLs of the references used

                Answer:`

    });

    return ai.chat(searchPrompt)

}
