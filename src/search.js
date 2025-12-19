/**
 * Executes a Tavily search request for the given query and returns the raw response.
 *
 * @param {ReturnType<typeof import('@tavily/core').tavily>} client - Tavily client instance used to perform the search.
 * @param {string} query - Text the user wants to search for.
 * @param {number} [numResults=5] - Maximum number of results to request.
 * @returns {Promise<object>} Tavily API response payload containing results and metadata.
 */
export async function searchWeb(client, query, numResults = 5){
    try {
        const response = await client.search(query, {
            searchDepth: 'advanced',
            numResults: numResults,
            includeAnswer: true,
            includeRawContent: false,
            includeImages: false
        })

        return response;
    } catch (error) {
        
    }
}
