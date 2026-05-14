# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure (Non-Obvious)

- **Monorepo with separate backend/frontend** - Each has its own dependencies and must be run from its directory
- **Backend runs on port 8080, frontend on 5173** - Both must run simultaneously for full functionality
- **MCP server mounted at `/mcp`** - FastMCP tools are separate from REST endpoints but share same business logic

## Critical Commands

### Backend (from `booking_system_backend/`)
```bash
# Run single test file
pytest tests/test_services.py -v

# Run specific test
pytest tests/test_services.py::TestBookingService::test_book_flight_success -v

# Run with coverage
pytest --cov=services --cov-report=term-missing
```

### Frontend (from `booking_system_frontend/`)
```bash
# No test framework configured - only build validation
npm run build  # TypeScript compilation check
```

## Non-Obvious Patterns

### Backend
- **MCP server MUST be created before FastAPI app** (line 16 in server.py) - Required for proper lifespan combination
- **Service functions return `Union[SuccessType, ErrorResponse]`** - Always check with `isinstance(result, ErrorResponse)` before using
- **Database seeding runs on every server start** - Clears and repopulates data (see seed.py)
- **Test fixtures use in-memory SQLite with StaticPool** - Required for thread safety in tests
- **Manual sys.path manipulation in tests** - `sys.path.insert(0, str(Path(__file__).parent.parent))` needed for imports

### Frontend
- **User stored in localStorage with key `galaxium_user`** - Persists across sessions, no backend auth
- **API base URL from `VITE_API_URL` env var** - Falls back to `http://localhost:8080` if not set
- **Custom axios interceptor transforms backend errors** - Wraps network errors in ErrorResponse format
- **Type guard `isErrorResponse()` required** - Check API responses before accessing success data
- **Tailwind custom colors in theme** - `cosmic-purple`, `nebula-pink`, `space-dark`, etc. (see tailwind.config.js)

## Code Style (Project-Specific)

### Backend
- **Use `from_attributes = True` in Pydantic schemas** - Required for SQLAlchemy model conversion (not `orm_mode`)
- **Import services as modules, not functions** - `from services import booking` then `booking.book_flight()`, not `from services.booking import book_flight`
- **UTC timestamps as ISO strings** - `datetime.utcnow().isoformat()` for consistency

### Frontend
- **Type imports use `type` keyword** - `import type { User } from '../types'` for type-only imports
- **Barrel exports in common components** - `src/components/common/index.ts` re-exports all common components
- **"Made with Bob" comment at end of files** - Project convention for attribution

## Testing Gotchas

- **Backend tests require parent directory in path** - Tests won't import without `sys.path.insert(0, ...)`
- **Test fixtures use `monkeypatch` to override SessionLocal** - Both in `db` module and `server` module
- **Seed function disabled in tests** - `monkeypatch.setattr(server, "seed", lambda: None)` prevents data pollution
- **Frontend has no test suite** - Only TypeScript compilation via `npm run build`