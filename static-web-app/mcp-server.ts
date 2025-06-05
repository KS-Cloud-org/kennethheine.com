import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { execSync } from 'child_process';

/**
 * Standard MCP Server for Playwright Testing
 * Based on Microsoft Playwright MCP implementation
 */
class PlaywrightMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'playwright-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'run_playwright_test',
            description: 'Run Playwright tests with specified configuration',
            inputSchema: {
              type: 'object',
              properties: {
                testPath: {
                  type: 'string',
                  description: 'Path to the test file or directory',
                },
                config: {
                  type: 'string',
                  description: 'Playwright config file to use',
                  default: 'playwright.config.ts',
                },
                headed: {
                  type: 'boolean',
                  description: 'Run tests in headed mode',
                  default: false,
                },
                project: {
                  type: 'string',
                  description: 'Specific project to run',
                },
              },
            },
          },
          {
            name: 'generate_playwright_test',
            description: 'Generate Playwright test code for a given page or component',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'URL to generate test for',
                },
                testName: {
                  type: 'string',
                  description: 'Name for the test',
                },
                actions: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of actions to test',
                },
              },
              required: ['url', 'testName'],
            },
          },
          {
            name: 'analyze_test_results',
            description: 'Analyze Playwright test results and provide insights',
            inputSchema: {
              type: 'object',
              properties: {
                reportPath: {
                  type: 'string',
                  description: 'Path to the test report',
                  default: 'test-results',
                },
              },
            },
          },
        ] as Tool[],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'run_playwright_test':
            return await this.runPlaywrightTest(args);
          case 'generate_playwright_test':
            return await this.generatePlaywrightTest(args);
          case 'analyze_test_results':
            return await this.analyzeTestResults(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async runPlaywrightTest(args: any) {
    const { testPath = '', config = 'playwright.config.ts', headed = false, project } = args;
    
    let cmd = `npx playwright test`;
    if (testPath) cmd += ` ${testPath}`;
    if (config !== 'playwright.config.ts') cmd += ` --config=${config}`;
    if (headed) cmd += ` --headed`;
    if (project) cmd += ` --project=${project}`;

    try {
      const output = execSync(cmd, { 
        encoding: 'utf8',
        cwd: process.cwd(),
        timeout: 60000,
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `Playwright test execution completed:\n\n${output}`,
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: 'text',
            text: `Playwright test execution failed:\n\n${error.stdout || error.message}`,
          },
        ],
      };
    }
  }

  private async generatePlaywrightTest(args: any) {
    const { url, testName, actions = [] } = args;
    
    const testTemplate = `import { test, expect } from '@playwright/test';

test('${testName}', async ({ page }) => {
  // Navigate to the page
  await page.goto('${url}');

  // Wait for the page to load
  await page.waitForLoadState('networkidle');

  // Basic assertions
  await expect(page).toHaveTitle(/.+/);
  await expect(page).toHaveURL('${url}');

  ${actions.map((action: string) => `  // ${action}`).join('\n  ')}
});
`;

    return {
      content: [
        {
          type: 'text',
          text: `Generated Playwright test:\n\n\`\`\`typescript\n${testTemplate}\n\`\`\``,
        },
      ],
    };
  }

  private async analyzeTestResults(args: any) {
    const { reportPath = 'test-results' } = args;

    try {
      // Basic test results analysis
      const analysis = `Test Results Analysis:
- Report location: ${reportPath}
- Use 'npx playwright show-report' to view detailed results
- Check for failed tests and screenshots in the report directory
`;

      return {
        content: [
          {
            type: 'text',
            text: analysis,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing test results: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  public async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Start the server
const server = new PlaywrightMCPServer();
server.start().catch(console.error);
