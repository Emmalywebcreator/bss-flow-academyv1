/**
 * In-memory stand-in for the Supabase client used by route handlers.
 *
 * Usage in a test file (vi.mock is hoisted, so the factory imports the
 * shared instance rather than closing over a local variable):
 *
 *   import { supabaseMock } from "@/tests/mocks/supabase";
 *   vi.mock("@/lib/supabase/server", async () =>
 *     (await import("@/tests/mocks/supabase")).supabaseServerModule
 *   );
 *   beforeEach(() => supabaseMock.reset());
 *
 *   supabaseMock.respond("registrations", { data: { id: "..." }, error: null });
 *   // ...call the route...
 *   expect(supabaseMock.calls("registrations")).toContainEqual(["insert", {...}]);
 *
 * Each awaited query on a table consumes the next queued response for
 * that table, in order. With nothing queued it resolves to
 * `{ data: null, error: null }`.
 */

export interface MockResponse {
  data: unknown;
  error: unknown;
}

type Call = [method: string, ...args: unknown[]];

const CHAIN_METHODS = [
  "select",
  "insert",
  "update",
  "upsert",
  "delete",
  "eq",
  "neq",
  "ilike",
  "in",
  "order",
  "limit",
] as const;

export function createSupabaseMock() {
  const queues = new Map<string, MockResponse[]>();
  const log = new Map<string, Call[]>();

  function next(table: string): MockResponse {
    return queues.get(table)?.shift() ?? { data: null, error: null };
  }

  function record(table: string, call: Call) {
    if (!log.has(table)) log.set(table, []);
    log.get(table)!.push(call);
  }

  function from(table: string) {
    const builder: Record<string, unknown> = {};

    for (const method of CHAIN_METHODS) {
      builder[method] = (...args: unknown[]) => {
        record(table, [method, ...args]);
        return builder;
      };
    }

    builder.single = () => {
      record(table, ["single"]);
      return Promise.resolve(next(table));
    };
    builder.maybeSingle = () => {
      record(table, ["maybeSingle"]);
      return Promise.resolve(next(table));
    };
    // Awaiting the builder directly (e.g. `await supabase.from(t).insert(...)`).
    builder.then = (
      resolve: (value: MockResponse) => unknown,
      reject?: (reason: unknown) => unknown
    ) => Promise.resolve(next(table)).then(resolve, reject);

    return builder;
  }

  function rpc(fn: string, args?: unknown) {
    record(`rpc:${fn}`, ["rpc", args]);
    return Promise.resolve(next(`rpc:${fn}`));
  }

  return {
    client: { from, rpc },

    /** Queue one or more responses for a table (or `rpc:<name>`). */
    respond(table: string, ...responses: MockResponse[]) {
      if (!queues.has(table)) queues.set(table, []);
      queues.get(table)!.push(...responses);
    },

    /** Every chained call made against a table, in order. */
    calls(table: string): Call[] {
      return log.get(table) ?? [];
    },

    reset() {
      queues.clear();
      log.clear();
    },
  };
}

export type SupabaseMock = ReturnType<typeof createSupabaseMock>;

/** Shared instance, so a test file and its vi.mock factory see the same mock. */
export const supabaseMock = createSupabaseMock();

/** Drop-in replacement for the `@/lib/supabase/server` module. */
export const supabaseServerModule = {
  getSupabaseServerClient: () => supabaseMock.client,
};
