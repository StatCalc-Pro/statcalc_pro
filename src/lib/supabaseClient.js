import { createClient } from '@supabase/supabase-js'

// Support both Vite-style env vars (VITE_) and Next-style (NEXT_PUBLIC_)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
	// eslint-disable-next-line no-console
	console.warn('Supabase URL or ANON KEY not found in environment variables. Auth will fail until configured.');
}

// If env vars are present, create the real client. Otherwise provide a
// safe mock object with the minimal auth API used by the app so the
// runtime doesn't throw (createClient throws if URL is missing).
let supabaseClient = null

if (SUPABASE_URL && SUPABASE_KEY) {
	supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)
} else {
	// Minimal mock implementation for development when env vars missing.
	// Methods return objects shaped similarly to supabase responses.
	const noop = async () => ({ data: null, error: new Error('Supabase not configured') })
	supabaseClient = {
		auth: {
			getUser: async () => ({ data: { user: null } }),
			signUp: async (..._args) => ({ data: null, error: new Error('Supabase not configured') }),
			signInWithPassword: async (..._args) => ({ data: null, error: new Error('Supabase not configured') }),
			signOut: async () => ({ data: null, error: new Error('Supabase not configured') }),
			onAuthStateChange: (_cb) => ({ subscription: { unsubscribe: () => {} } }),
		},
		// Also expose a basic from/table API that rejects if used.
		from: () => ({ select: noop, insert: noop, update: noop, delete: noop }),
	}
}

export const supabase = supabaseClient
