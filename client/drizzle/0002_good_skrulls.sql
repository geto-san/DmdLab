CREATE TABLE "youtube_oauth" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "youtube_oauth_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"token_expiry" timestamp with time zone NOT NULL,
	"channel_id" text,
	"channel_title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
