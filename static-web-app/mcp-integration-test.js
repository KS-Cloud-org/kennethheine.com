/**
 * MCP Integration Test - Simple Version
 * Tests the Model Context Protocol server configuration and files
 * Author: Kenneth Heine
 * Created: June 2025
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Test MCP Configuration and Files
 */
async function testMCPConfiguration() {
  console.log('🔍 Testing MCP Configuration...\n');

  let allTestsPassed = true;
  const results = {
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: VS Code MCP Configuration
  console.log('1️⃣ Testing VS Code MCP Configuration...');
  try {
    const mcpConfigPath = path.join(__dirname, '../.vscode/mcp.json');
    const mcpConfig = await fs.readFile(mcpConfigPath, 'utf8');
    const configData = JSON.parse(mcpConfig);
    
    if (configData.mcpServers && configData.mcpServers.playwright) {
      console.log('✅ VS Code MCP configuration is valid');
      console.log('   Server command:', configData.mcpServers.playwright.command);
      console.log('   Server args:', configData.mcpServers.playwright.args.join(' '));
      results.tests.push({ name: 'VS Code MCP Config', status: 'PASS' });
    } else {
      console.log('❌ Invalid MCP configuration structure');
      allTestsPassed = false;
      results.tests.push({ name: 'VS Code MCP Config', status: 'FAIL', error: 'Invalid structure' });
    }
  } catch (error) {
    console.log('❌ Error reading MCP configuration:', error.message);
    allTestsPassed = false;
    results.tests.push({ name: 'VS Code MCP Config', status: 'FAIL', error: error.message });
  }

  // Test 2: MCP Server Implementation
  console.log('\n2️⃣ Testing MCP Server Implementation...');
  try {
    const serverContent = await fs.readFile(path.join(__dirname, 'mcp-server.ts'), 'utf8');
    
    // Check for required imports and implementations
    const checks = {
      'MCP SDK Import': serverContent.includes('@modelcontextprotocol/sdk'),
      'Playwright Import': serverContent.includes('@playwright/test'),
      'Server Class': serverContent.includes('class PlaywrightMCPServer'),
      'Run Tool': serverContent.includes('run_playwright_test'),
      'Generate Tool': serverContent.includes('generate_playwright_test'),
      'Analyze Tool': serverContent.includes('analyze_test_results'),
      'Error Handling': serverContent.includes('try') && serverContent.includes('catch'),
      'TypeScript Types': serverContent.includes('interface') || serverContent.includes('type')
    };
    
    console.log('✅ MCP Server file exists');
    let serverTestPassed = true;
    
    Object.entries(checks).forEach(([check, passed]) => {
      console.log(`   ${check}:`, passed ? '✅' : '❌');
      if (!passed) serverTestPassed = false;
    });
    
    if (serverTestPassed) {
      results.tests.push({ name: 'MCP Server Implementation', status: 'PASS' });
    } else {
      allTestsPassed = false;
      results.tests.push({ name: 'MCP Server Implementation', status: 'FAIL', error: 'Missing components' });
    }
    
  } catch (error) {
    console.log('❌ Error reading MCP server file:', error.message);
    allTestsPassed = false;
    results.tests.push({ name: 'MCP Server Implementation', status: 'FAIL', error: error.message });
  }

  // Test 3: Package Dependencies
  console.log('\n3️⃣ Testing Dependencies...');
  try {
    const packageJson = await fs.readFile(path.join(__dirname, 'package.json'), 'utf8');
    const packageData = JSON.parse(packageJson);
    
    const requiredDeps = [
      '@modelcontextprotocol/sdk',
      '@playwright/mcp',
      '@playwright/test',
      'tsx'
    ];
    
    const allDeps = { ...packageData.dependencies, ...packageData.devDependencies };
    let depsTestPassed = true;
    
    console.log('📦 Dependencies check:');
    requiredDeps.forEach(dep => {
      const installed = !!allDeps[dep];
      console.log(`   ${dep}:`, installed ? '✅' : '❌');
      if (!installed) depsTestPassed = false;
    });
    
    if (depsTestPassed) {
      results.tests.push({ name: 'Dependencies', status: 'PASS' });
    } else {
      allTestsPassed = false;
      results.tests.push({ name: 'Dependencies', status: 'FAIL', error: 'Missing dependencies' });
    }
    
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    allTestsPassed = false;
    results.tests.push({ name: 'Dependencies', status: 'FAIL', error: error.message });
  }

  // Test 4: Playwright Configuration
  console.log('\n4️⃣ Testing Playwright Configuration...');
  try {
    const playwrightConfig = await fs.readFile(path.join(__dirname, 'playwright.config.ts'), 'utf8');
    
    const configChecks = {
      'Test Directory': playwrightConfig.includes('testDir'),
      'Web Server': playwrightConfig.includes('webServer'),
      'Reporter Config': playwrightConfig.includes('reporter'),
      'Browser Projects': playwrightConfig.includes('projects')
    };
    
    console.log('🎭 Playwright configuration:');
    let playwrightTestPassed = true;
    
    Object.entries(configChecks).forEach(([check, passed]) => {
      console.log(`   ${check}:`, passed ? '✅' : '❌');
      if (!passed) playwrightTestPassed = false;
    });
    
    if (playwrightTestPassed) {
      results.tests.push({ name: 'Playwright Configuration', status: 'PASS' });
    } else {
      allTestsPassed = false;
      results.tests.push({ name: 'Playwright Configuration', status: 'FAIL', error: 'Missing config options' });
    }
    
  } catch (error) {
    console.log('❌ Error reading Playwright configuration:', error.message);
    allTestsPassed = false;
    results.tests.push({ name: 'Playwright Configuration', status: 'FAIL', error: error.message });
  }

  // Test 5: VS Code Extensions Configuration
  console.log('\n5️⃣ Testing VS Code Extensions...');
  try {
    const extensionsPath = path.join(__dirname, '../.vscode/extensions.json');
    const extensionsConfig = await fs.readFile(extensionsPath, 'utf8');
    const extensionsData = JSON.parse(extensionsConfig);
    
    const hasMCPExtension = extensionsData.recommendations?.includes('modelcontextprotocol.mcp-client');
    
    console.log('🔌 VS Code Extensions:');
    console.log('   MCP Client Extension:', hasMCPExtension ? '✅' : '❌');
    
    if (hasMCPExtension) {
      results.tests.push({ name: 'VS Code Extensions', status: 'PASS' });
    } else {
      allTestsPassed = false;
      results.tests.push({ name: 'VS Code Extensions', status: 'FAIL', error: 'MCP extension not recommended' });
    }
    
  } catch (error) {
    console.log('❌ Error reading VS Code extensions config:', error.message);
    allTestsPassed = false;
    results.tests.push({ name: 'VS Code Extensions', status: 'FAIL', error: error.message });
  }

  // Generate summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 MCP Integration Test Summary');
  console.log('='.repeat(50));
  
  const passCount = results.tests.filter(t => t.status === 'PASS').length;
  const totalCount = results.tests.length;
  
  console.log(`✅ Passed: ${passCount}/${totalCount} tests`);
  
  if (allTestsPassed) {
    console.log('🎉 All MCP integration tests passed!');
    console.log('\n🚀 MCP is ready for use with:');
    console.log('   • GitHub Copilot AI-enhanced testing');
    console.log('   • VS Code MCP integration');
    console.log('   • Playwright test automation');
    console.log('\n📖 To use MCP:');
    console.log('   1. Start MCP server: npm run mcp:server');
    console.log('   2. Use Copilot commands with @playwright context');
    console.log('   3. Access AI-powered test generation and analysis');
    results.overall = 'PASS';
  } else {
    console.log('❌ Some tests failed - check configuration');
    console.log('\n🔧 Next steps:');
    console.log('   1. Review failed tests above');
    console.log('   2. Check MCP setup documentation');
    console.log('   3. Verify all dependencies are installed');
    results.overall = 'FAIL';
  }

  // Save results
  await fs.writeFile(
    path.join(__dirname, 'mcp-test-results.json'), 
    JSON.stringify(results, null, 2)
  );
  
  console.log(`\n📄 Results saved to: mcp-test-results.json`);
  
  return allTestsPassed;
}

// Run the test
if (require.main === module) {
  testMCPConfiguration()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test runner error:', error);
      process.exit(1);
    });
}

module.exports = { testMCPConfiguration };
