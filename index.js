import { googleAI } from '@genkit-ai/google-genai'
import { tavily } from '@tavily/core';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { genkit } from 'genkit/beta';
import readline from 'readline';
import ora from 'ora';
import { createChatAgent } from './src/agent.js';


dotenv.config();

/**
 * Starts the interactive CLI loop, wiring environment configuration, Tavily search,
 * Gemini model, and the chat agent that answers user prompts.
 */
async function startInteractive() {
    try {

        const TavilyApiKey = process.env.TAVILY_API_KEY;
        if (!TavilyApiKey) {
            throw new Error('TAVILY_API_KEY is not set in the environments variables.');
        }
        const GeminiApiKey = process.env.GOOGLE_API_KEY;
        if (!GeminiApiKey){
            throw new Error('GOOGLE_API_KEY is not set in the environments variables ')
        }

        const client = tavily({ apiKey: TavilyApiKey})

        const ai = genkit({
            plugins: [ googleAI({ apiKey: GeminiApiKey})]
        })

        const chat = createChatAgent(ai, client,  googleAI.model('gemini-2.5-flash'));

        const rl =  readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: chalk.green.bold('\n Ask a questions (or type "exit" to quit): '),
            terminal: true
        })

        console.log(chalk.red.bold('\n┌──────────────────────────────┐'));
        console.log(chalk.red.bold('│   pseudo CLI terminal boot   │'));
        console.log(chalk.red.bold('├──────────────────────────────┤'));
        console.log(chalk.red.bold('│ Welcome to CLI - Interactive │'));
        console.log(chalk.red.bold('│ model                        │'));
        console.log(chalk.red.bold('│ Commads: exit, quit or ..    │'));
        console.log(chalk.red.bold('│ press Ctrl+C to leave        │'));
        console.log(chalk.red.bold('└──────────────────────────────┘\n'));
        rl.prompt();

        rl.on('line', async(line) => {
            const query =  line.trim();

            if (!query) {
                rl.prompt();
                return;
            }

            if (query.toLowerCase() === 'exit' || query.toLowerCase() === 'quit'){
                console.log(chalk.yellow('\n Good Bye\n'));
                rl.close();
                return;
            }

            rl.pause();

            let spinner;
            try {
                
                spinner = ora('Thinking...').start();    
                const {text} = await chat.send(query)
                spinner.succeed('Answer recived!\n')
                console.log(text)
            } catch (error) {
                if (spinner) spinner.fail('Error ocurred while getting the answer.');
                    console.error(chalk.red('Error; ', error.message));

            }finally{
                rl.resume();
                rl.prompt();
            }
            



        })
        
    } catch (error) {
        console.error(chalk.red('\n Error'), error.message);
        if (error.message.includes('TAVILY_API_KEY')){
            console.log(chalk.yellow('\n Tip: Make sure TO SET YOUR tavily api key in to the .env file.'));
        }
        if (error.message.includes('GOOGLE_API_KEY')){
            console.LOG(chalk.yellow('\n Tip: Make sure to set your GOOGLE_API_KEY in the .env file'));
        }

        process.exit(1);
    }    
}

startInteractive();
