import type mongoose from 'mongoose';

declare global {
  interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  }

  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Add environment variables type declaration
declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    NEXT_PUBLIC_MONGODB_URI?: string;
  }
}

export {};