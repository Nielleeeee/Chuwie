// Generated by Xata Codegen 0.29.3. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "Post",
    columns: [
      { name: "author_username", type: "string" },
      { name: "content", type: "text" },
      { name: "author_fullname", type: "string" },
      { name: "media", type: "json" },
      { name: "user_id", type: "string" },
    ],
  },
  {
    name: "Comment",
    columns: [
      { name: "post_id", type: "string" },
      { name: "content", type: "string" },
      { name: "user_id", type: "string" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Post = InferredTypes["Post"];
export type PostRecord = Post & XataRecord;

export type Comment = InferredTypes["Comment"];
export type CommentRecord = Comment & XataRecord;

export type DatabaseSchema = {
  Post: PostRecord;
  Comment: CommentRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Jan-Danielle-Plaza-s-workspace-oti195.us-east-1.xata.sh/db/chuwie",
  branch: "main",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
