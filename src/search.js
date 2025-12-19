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