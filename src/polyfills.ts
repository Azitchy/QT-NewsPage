// src/polyfills.ts
// MUST be imported before any other dependency that might expect node globals.

(0 as any) // ensure file is treated as a module

// map global to globalThis
;(window as any).global = (window as any).globalThis || window

// minimal process polyfill (some libs expect process.env)
;(window as any).process = (window as any).process || { env: {} }

// Buffer polyfill
import { Buffer } from 'buffer'
;(window as any).Buffer = (window as any).Buffer || Buffer
