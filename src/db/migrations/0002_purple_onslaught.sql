ALTER TABLE "income_history" ALTER COLUMN "timestamp" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "income_history" ADD COLUMN "category" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "income_history" ADD CONSTRAINT "income_history_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;