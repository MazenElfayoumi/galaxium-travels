# Deep Agents MCP Server Investigation

## Date
2026-05-14

## Objective
Investigate whether Deep Agents has an official MCP server for documentation access.

## Investigation Steps

1. **Checked MCP Configuration** (`.bob/mcp.json`)
   - Only contains `langchain-docs` server
   - No Deep Agents server configured

2. **Searched Official MCP Registry**
   - Visited https://github.com/modelcontextprotocol/servers
   - Browsed the MCP Registry at the official site
   - Searched for "deep" - no matches found
   - Reviewed available servers including:
     - Teamwork.com MCP
     - EduBase MCP
     - Shared2k/honey
     - Ethora MCP
     - Guardvibe
     - Kadam
     - Ainote
     - Warp-agent MCP
     - SWIPA bot

3. **Conclusion**
   - **Deep Agents does NOT have an official MCP server** in the registry
   - No MCP server exists for accessing Deep Agents documentation
   - The user's `.bob/mcp.json` only has LangChain docs, not Deep Agents

## Recommendations

1. **Use browser_action** to access https://docs.deep-agents.com directly
2. **Use fetch tool** if available to retrieve web content
3. **Rely on built-in knowledge** of Deep Agents framework
4. **Consider creating a custom MCP server** for Deep Agents if needed

## Alternative Approaches

- LangChain docs server might have some related information since both are agent frameworks
- Could use the `fetch` MCP server from the registry to retrieve Deep Agents docs if it supports web fetching