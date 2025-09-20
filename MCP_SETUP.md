# Supabase MCP (Model Context Protocol) Setup

This project is configured with Supabase MCP for enhanced AI-powered database interactions.

## Security & Git Configuration

### Files Intentionally Ignored by Git:
- `.cursor/` - Contains sensitive MCP configuration
- `.env` - Contains access tokens and credentials
- `mcp.json` - If created in project root

### Template Files (Safe to Commit):
- `mcp.json.template` - Template for MCP configuration
- `.env.example` - Template for environment variables
- `MCP_SETUP.md` - This documentation

## Setup Instructions

1. **Create Access Token:**
   - Go to Supabase Dashboard → Settings → Access Tokens
   - Create token named "Cursor MCP"
   - Copy the token securely

2. **Configure Environment:**
   - Copy `mcp.json.template` to `.cursor/mcp.json`
   - Replace `YOUR_PROJECT_REF_HERE` with your project reference
   - Replace `YOUR_ACCESS_TOKEN_HERE` with your actual token
   - Update `.env` with all required credentials

3. **Verify Security:**
   - Check `git status --ignored` to confirm files are ignored
   - Never commit actual tokens or project references

## MCP Features Enabled

- ✅ **Read-only mode**: Prevents accidental data modification
- ✅ **Project scoping**: Locked to specific project
- ✅ **Database queries**: Natural language database interactions
- ✅ **Schema inspection**: AI can understand your database structure
- ✅ **Project management**: Access to Supabase project settings

## Usage Examples

Once configured, you can ask the AI:
- "Show me the structure of my users table"
- "List all tables in my database"
- "What's the current database schema?"
- "Describe my Supabase project configuration"

## Troubleshooting

- **Connection failed**: Check access token and project ref
- **Command not found**: Ensure pnpm is in PATH
- **Permission denied**: Verify token permissions in Supabase dashboard