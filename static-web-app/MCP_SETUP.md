# Model Context Protocol (MCP) Setup

This project uses the **Model Context Protocol (MCP)** to enhance Playwright testing with AI-powered capabilities. The setup follows Microsoft's standard MCP implementation for Playwright testing.

## 🚀 What is MCP?

The Model Context Protocol is a standardized way for AI tools to interact with external systems and data sources. In this project, MCP enables AI assistants (like GitHub Copilot) to:

- Generate Playwright test cases automatically
- Analyze test results and provide insights  
- Run tests with specific configurations
- Provide debugging assistance for failing tests

## 📁 MCP Configuration Files

### Core Files
- **`.vscode/mcp.json`** - VS Code MCP client configuration
- **`static-web-app/mcp-server.ts`** - Custom MCP server implementation
- **`package.json`** - Contains `mcp:server` script for starting the MCP server

### VS Code Integration
- **`.vscode/extensions.json`** - Includes MCP client extension recommendation
- **`.vscode/settings.json`** - VS Code workspace settings (no MCP-specific config needed)

## 🔧 Setup Instructions

### 1. Install Dependencies
The MCP dependencies are already included in `package.json`:
```bash
npm install
```

### 2. VS Code Extensions
Install the recommended MCP client extension:
- `modelcontextprotocol.mcp-client`

### 3. Verify MCP Configuration
The MCP server is configured to start automatically when needed. You can test it manually:
```bash
npm run mcp:server
```

## 🎯 MCP Tools Available

### `run_playwright_test`
Run Playwright tests with various configurations:
```json
{
  "testPath": "e2e/home.spec.ts",
  "config": "playwright.config.ts",
  "headed": false,
  "project": "chromium"
}
```

### `generate_playwright_test`
Generate new Playwright test code:
```json
{
  "url": "http://localhost:3000/about",
  "testName": "About page accessibility test",
  "actions": ["Check heading structure", "Verify navigation", "Test form submission"]
}
```

### `analyze_test_results`
Analyze test results and provide insights:
```json
{
  "reportPath": "test-results"
}
```

## 🤖 AI Integration with GitHub Copilot

### Copilot Chat Integration
You can ask Copilot to help with testing using natural language:

- "Generate an E2E test for the contact form"
- "Analyze the latest test results"
- "Run the full test suite in headed mode"
- "Debug the failing navigation test"

### Copilot Coding Agent
The MCP server integrates with GitHub Copilot's coding agent to provide:
- Automated test generation based on code changes
- Intelligent test maintenance and refactoring
- Pattern recognition for test improvements
- Debugging assistance for failing tests

## 📊 Testing Configurations

### Fast Testing (Default)
- **Configuration**: `playwright.config.ts`
- **Browsers**: Chromium only
- **Purpose**: Quick feedback during development
- **Runtime**: ~1.5 minutes

### Full Testing Suite
- **Configuration**: `playwright.config.full.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Tablet, Desktop
- **Purpose**: Comprehensive cross-browser validation
- **Runtime**: ~10+ minutes

## 🔍 Usage Examples

### Via AI Chat
```
You: "Generate an E2E test for the blog page that checks for proper MDX rendering"

AI: [Uses MCP to generate test code and provides implementation]
```

### Via VS Code Command Palette
1. Open Command Palette (`Ctrl+Shift+P`)
2. Type "MCP: Run Tool"
3. Select desired MCP tool
4. Configure parameters

### Via Terminal
```bash
# Start MCP server manually
npm run mcp:server

# Run tests via MCP (through AI integration)
# This is typically done through AI chat or VS Code commands
```

## 🛠️ Troubleshooting

### MCP Server Not Starting
1. Ensure all dependencies are installed: `npm install`
2. Check that TypeScript files compile: `npm run type-check`
3. Verify tsx is installed: `npm list tsx`

### VS Code MCP Client Issues
1. Install the MCP client extension
2. Reload VS Code window
3. Check `.vscode/mcp.json` configuration
4. Verify server starts with `npm run mcp:server`

### AI Integration Not Working
1. Ensure GitHub Copilot extension is active
2. Check that MCP client extension is installed
3. Restart VS Code
4. Verify MCP server responds to tool calls

## 📚 MCP vs Previous Custom Setup

### ✅ Standard MCP Benefits
- **Official Protocol**: Uses Microsoft's standard MCP implementation
- **Better Integration**: Seamless VS Code and Copilot integration
- **Maintainable**: Less custom code to maintain
- **Extensible**: Easy to add new tools and capabilities
- **Reliable**: Based on proven MCP patterns

### 🗂️ Removed Custom Files
The following custom MCP files were replaced with standard implementation:
- `mcp-server-config.json` → Replaced with `mcp-server.ts`
- `playwright-mcp.config.ts` → Integrated into main server
- `types/mcp-types.ts` → Uses standard MCP SDK types
- `lib/mcp-test-generator.ts` → Functionality moved to MCP server
- `lib/mcp-test-maintainer.ts` → Functionality moved to MCP server
- `.vscode/mcp-settings.json` → Replaced with `.vscode/mcp.json`

## 🎉 Getting Started

1. **Open VS Code** in this workspace
2. **Install recommended extensions** when prompted
3. **Start developing** - MCP integration is automatic
4. **Use AI chat** to generate tests or get assistance
5. **Run tests** through AI commands or VS Code tasks

The MCP setup enhances your testing workflow by providing AI-powered assistance while maintaining the reliability and performance of your Playwright test suite.
