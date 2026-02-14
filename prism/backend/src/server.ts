/**
 * =============================================================================
 * FILE PURPOSE
 * =============================================================================
 *
 * This file is the backend entry point. It boots the HTTP server, mounts
 * routes (e.g. analyze), applies middleware (CORS, body parsing), and
 * exposes a single port for the extension and optional demo tooling.
 *
 * =============================================================================
 * OWNER ROLE
 * =============================================================================
 *
 * Backend Lead
 *
 * =============================================================================
 * RESPONSIBILITIES
 * =============================================================================
 *
 * - Create and start the HTTP server (e.g. Express or similar).
 * - Enable CORS for extension origin(s) and optional demo page.
 * - Parse JSON request bodies.
 * - Mount routes from routes/ (e.g. analyzeRoute at /api/analyze or similar).
 * - Central error handler for unhandled errors and 404.
 * - No business logic; only wiring. All analysis logic lives under
 *   routes, services, and logic.
 *
 * =============================================================================
 * INTEGRATION NOTES
 * =============================================================================
 *
 * - Imports and uses routes/analyzeRoute.ts for the analyze endpoint.
 * - Services (llmService, promptBuilder, responseValidator) are used by
 *   the route or a thin route handler, not directly by server.ts.
 * - Environment or config for port and optional API keys (e.g. LLM) should
 *   be read here or in a small config module used by server and services.
 *
 * =============================================================================
 */
