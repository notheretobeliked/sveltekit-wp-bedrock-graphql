// Handle both SvelteKit's $env and regular process.env
export const getEnvVar = (key: string): string => {
    try {
      // Try to import from $env first
      const env = import.meta.env[key] || process.env[key]
      if (!env) throw new Error(`Missing environment variable: ${key}`)
      return env
    } catch {
      // Fallback to process.env
      const env = process.env[key]
      if (!env) throw new Error(`Missing environment variable: ${key}`)
      return env
    }
  }