/**
 * Comprehensive TypeScript type definitions for Puter.js
 * Based on Puter.js v2 API documentation
 *
 * Note: This package requires DOM types. Either:
 * 1. Add "DOM" to your tsconfig.json lib array: "lib": ["ES2020", "DOM", "DOM.Iterable"]
 * 2. Or install @types/node for server-side usage with appropriate DOM polyfills
 */

// ============================================================================
// AI MODULE TYPES
// ============================================================================

export type PuterAIModel =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "o1"
  | "o1-mini"
  | "o1-pro"
  | "o3"
  | "o3-mini"
  | "o4-mini"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4.5-preview"
  | "claude-sonnet-4"
  | "claude-opus-4"
  | "claude-3-7-sonnet"
  | "claude-3-5-sonnet"
  | "deepseek-chat"
  | "deepseek-reasoner"
  | "gemini-2.0-flash"
  | "gemini-1.5-flash"
  | "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"
  | "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo"
  | "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo"
  | "mistral-large-latest"
  | "pixtral-large-latest"
  | "codestral-latest"
  | "google/gemma-2-27b-it"
  | "grok-beta";

export interface PuterAIFunctionTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>; // JSON Schema
    strict?: boolean;
  };
}

export interface PuterAIChatOptions {
  model?: PuterAIModel;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  tools?: PuterAIFunctionTool[];
}

export interface PuterAIToolCall {
  id: string;
  function: {
    name: string;
    arguments: string; // JSON string
  };
}

export interface PuterAIChatResponse {
  message: {
    tool_calls?: PuterAIToolCall[];
    content?: string;
  };
  // When not using function calling, response is typically a string
  [key: string]: unknown;
}

export interface PuterAIStreamChunk {
  text?: string;
}

export type PuterAIMessageRole =
  | "system"
  | "assistant"
  | "user"
  | "function"
  | "tool";

export interface PuterAITextContent {
  type: "text";
  text: string;
}

export interface PuterAIFileContent {
  type: "file";
  puter_path: string;
}

export type PuterAIMessageContent =
  | string
  | (PuterAITextContent | PuterAIFileContent)[];

export interface PuterAIMessage {
  role: PuterAIMessageRole;
  content: PuterAIMessageContent;
  tool_call_id?: string; // Required for 'tool' role messages
}

// Text-to-Speech Types
export type PuterAISpeechLanguage =
  | "ar-AE"
  | "ca-ES"
  | "yue-CN"
  | "cmn-CN"
  | "da-DK"
  | "nl-BE"
  | "nl-NL"
  | "en-AU"
  | "en-GB"
  | "en-IN"
  | "en-NZ"
  | "en-ZA"
  | "en-US"
  | "en-GB-WLS"
  | "fi-FI"
  | "fr-FR"
  | "fr-BE"
  | "fr-CA"
  | "de-DE"
  | "de-AT"
  | "hi-IN"
  | "is-IS"
  | "it-IT"
  | "ja-JP"
  | "ko-KR"
  | "nb-NO"
  | "pl-PL"
  | "pt-BR"
  | "pt-PT"
  | "ro-RO"
  | "ru-RU"
  | "es-ES"
  | "es-MX"
  | "es-US"
  | "sv-SE"
  | "tr-TR"
  | "cy-GB";

export type PuterAISpeechEngine = "standard" | "neural" | "generative";

export interface PuterAISpeechOptions {
  language?: PuterAISpeechLanguage;
  voice?: string;
  engine?: PuterAISpeechEngine;
}

// ============================================================================
// AUTH MODULE TYPES
// ============================================================================

export interface PuterUser {
  uuid: string;
  username: string;
  email_confirmed: boolean;
}

// ============================================================================
// KEY-VALUE STORE TYPES
// ============================================================================

export type PuterKVValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[];

export interface PuterKVListItem {
  key: string;
  value: PuterKVValue;
}

// ============================================================================
// FILESYSTEM TYPES
// ============================================================================

export interface PuterFSOptions {
  overwrite?: boolean;
  dedupeName?: boolean;
  createMissingParents?: boolean;
}

export interface PuterFSCopyOptions extends PuterFSOptions {
  newName?: string;
}

export interface PuterFSDeleteOptions {
  recursive?: boolean;
  descendantsOnly?: boolean;
}

export interface PuterFSItem {
  name: string;
  path: string;
  size?: number;
  type?: "file" | "directory";
  created?: string;
  modified?: string;
  [key: string]: unknown; // Allow for additional properties
}

// ============================================================================
// MAIN PUTER INTERFACE
// ============================================================================

export interface PuterAI {
  // Chat method overloads - returns string for simple cases, structured response for function calling
  chat(prompt: string): Promise<string>;
  chat(
    prompt: string,
    options: PuterAIChatOptions
  ): Promise<string | PuterAIChatResponse>;
  chat(
    prompt: string,
    testMode: boolean,
    options?: PuterAIChatOptions
  ): Promise<string | PuterAIChatResponse>;
  chat(
    prompt: string,
    imageURL: string,
    testMode?: boolean,
    options?: PuterAIChatOptions
  ): Promise<string | PuterAIChatResponse>;
  chat(
    prompt: string,
    imageURLArray: string[],
    testMode?: boolean,
    options?: PuterAIChatOptions
  ): Promise<string | PuterAIChatResponse>;
  chat(
    messages: PuterAIMessage[],
    testMode?: boolean,
    options?: PuterAIChatOptions
  ): Promise<string | PuterAIChatResponse>;

  // Streaming version
  chat(
    prompt: string,
    options: PuterAIChatOptions & { stream: true }
  ): AsyncIterable<PuterAIStreamChunk>;
  chat(
    prompt: string,
    testMode: boolean,
    options: PuterAIChatOptions & { stream: true }
  ): AsyncIterable<PuterAIStreamChunk>;
  chat(
    prompt: string,
    imageURL: string,
    testMode: boolean,
    options: PuterAIChatOptions & { stream: true }
  ): AsyncIterable<PuterAIStreamChunk>;
  chat(
    prompt: string,
    imageURLArray: string[],
    testMode: boolean,
    options: PuterAIChatOptions & { stream: true }
  ): AsyncIterable<PuterAIStreamChunk>;
  chat(
    messages: PuterAIMessage[],
    testMode: boolean,
    options: PuterAIChatOptions & { stream: true }
  ): AsyncIterable<PuterAIStreamChunk>;

  txt2img(prompt: string, testMode?: boolean): Promise<string>; // Returns data URL

  img2txt(image: string | File | Blob, testMode?: boolean): Promise<string>;

  // Text-to-speech overloads
  txt2speech(text: string): Promise<ReadableStream>;
  txt2speech(
    text: string,
    options: PuterAISpeechOptions
  ): Promise<ReadableStream>;
  txt2speech(
    text: string,
    language: PuterAISpeechLanguage
  ): Promise<ReadableStream>;
  txt2speech(
    text: string,
    language: PuterAISpeechLanguage,
    voice: string
  ): Promise<ReadableStream>;
  txt2speech(
    text: string,
    language: PuterAISpeechLanguage,
    voice: string,
    engine: PuterAISpeechEngine
  ): Promise<ReadableStream>;
}

export interface PuterAuth {
  signIn(): Promise<boolean>;
  signOut(): void;
  isSignedIn(): boolean;
  getUser(): Promise<PuterUser>;
}

export interface PuterKV {
  set(key: string, value: PuterKVValue): Promise<boolean>;
  get(key: string): Promise<PuterKVValue | null>;
  incr(key: string, amount?: number): Promise<number>;
  decr(key: string, amount?: number): Promise<number>;
  del(key: string): Promise<boolean>;
  list(): Promise<string[]>;
  list(pattern: string): Promise<string[]>;
  list(returnValues: true): Promise<PuterKVListItem[]>;
  list(pattern: string, returnValues: true): Promise<PuterKVListItem[]>;
  flush(): Promise<boolean>;
}

export interface PuterFSUploadOptions {
  overwrite?: boolean;
  dedupeName?: boolean;
  createMissingParents?: boolean;
  [key: string]: unknown; // Allow for additional upload-specific options
}

export interface PuterFS {
  write(path: string): Promise<PuterFSItem>;
  write(path: string, data: string | File | Blob): Promise<PuterFSItem>;
  write(
    path: string,
    data: string | File | Blob,
    options: PuterFSOptions
  ): Promise<PuterFSItem>;

  read(path: string): Promise<Blob>;

  mkdir(path: string): Promise<PuterFSItem>;
  mkdir(path: string, options: PuterFSOptions): Promise<PuterFSItem>;

  readdir(path: string): Promise<PuterFSItem[]>;

  rename(path: string, newName: string): Promise<PuterFSItem>;

  copy(source: string, destination: string): Promise<PuterFSItem>;
  copy(
    source: string,
    destination: string,
    options: PuterFSCopyOptions
  ): Promise<PuterFSItem>;

  move(source: string, destination: string): Promise<PuterFSItem>;
  move(
    source: string,
    destination: string,
    options: PuterFSOptions
  ): Promise<PuterFSItem>;

  stat(path: string): Promise<PuterFSItem>;

  delete(path: string): Promise<void>;
  delete(path: string, options: PuterFSDeleteOptions): Promise<void>;

  upload(items: FileList | File[] | Blob[]): Promise<PuterFSItem[]>;
  upload(
    items: FileList | File[] | Blob[],
    dirPath?: string
  ): Promise<PuterFSItem[]>;
  upload(
    items: FileList | File[] | Blob[],
    dirPath?: string,
    options?: PuterFSUploadOptions
  ): Promise<PuterFSItem[]>;
}

export interface Puter {
  ai: PuterAI;
  auth: PuterAuth;
  kv: PuterKV;
  fs: PuterFS;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Checks if the Puter.js script is loaded in the current document
 * @returns true if the script is found, false otherwise
 */
export function isPuterScriptLoaded(): boolean {
  if (typeof document === "undefined") {
    console.warn(
      "isPuterScriptLoaded() can only be used in browser environments"
    );
    return false;
  }

  const scripts = document.querySelectorAll("script[src]");
  return Array.from(scripts).some((script) => {
    const src = script.getAttribute("src");
    return (
      src === "https://js.puter.com/v2/" ||
      src === "https://js.puter.com/v2/index.js"
    );
  });
}

/**
 * Gets the puter object from the global scope with proper typing
 * @returns The puter object if available, null otherwise
 */
export function getPuter(): Puter {
  if (typeof window === "undefined") {
    throw new Error("getPuter() can only be used in browser environments");
  }

  if (!isPuterScriptLoaded()) {
    throw new Error(
      'Puter.js script not found. Make sure to include: <script src="https://js.puter.com/v{latest_version}/"></script>'
    );
  }

  if ("puter" in window) {
    return (window as typeof window & { puter: Puter }).puter;
  }

  throw new Error(
    "No puter object in window, puterjs can only be called in client side"
  );
}

/**
 * Utility function to safely access puter with error handling
 * @param callback Function to execute with the puter object
 * @returns Promise that resolves with the callback result or rejects if puter is not available
 */
export async function withPuter<T>(
  callback: (puter: Puter) => Promise<T>
): Promise<T> {
  const puter = getPuter();
  if (!puter) {
    throw new Error(
      "Puter.js is not available. Make sure the script is loaded."
    );
  }
  return callback(puter);
}

/**
 * Type guard to check if a chat response contains tool calls
 * @param response The chat response to check
 * @returns true if response has tool calls
 */
export function hasToolCalls(
  response: string | PuterAIChatResponse
): response is PuterAIChatResponse & {
  message: { tool_calls: PuterAIToolCall[] };
} {
  return (
    typeof response !== "string" &&
    response.message?.tool_calls !== undefined &&
    Array.isArray(response.message.tool_calls) &&
    response.message.tool_calls.length > 0
  );
}

// Global declaration for environments where puter is available globally
declare global {
  interface Window {
    puter: Puter;
  }
}

export default Puter;
