drop extension if exists "pg_net";


  create table "public"."examples" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "sample_input" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."examples" enable row level security;


  create table "public"."project_history" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "title" text,
    "description" text,
    "data" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."project_history" enable row level security;


  create table "public"."prompt_logs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "input_type" text,
    "input_length" integer,
    "output_length" integer,
    "tool_used" text,
    "tokens_used" integer,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."prompt_logs" enable row level security;


  create table "public"."prompts" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "input_text" text,
    "detected_type" text,
    "output_json_schema" text,
    "output_smpl" text,
    "output_dsl" text,
    "output_expanded" text,
    "output_exports" text,
    "token_usage" integer,
    "ai_builder_used" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."prompts" enable row level security;

alter table "public"."user_profiles" add column "theme" text default 'dark'::text;

CREATE INDEX examples_created_at_idx ON public.examples USING btree (created_at);

CREATE UNIQUE INDEX examples_pkey ON public.examples USING btree (id);

CREATE UNIQUE INDEX project_history_pkey ON public.project_history USING btree (id);

CREATE INDEX project_history_user_id_idx ON public.project_history USING btree (user_id);

CREATE INDEX prompt_logs_created_at_idx ON public.prompt_logs USING btree (created_at);

CREATE UNIQUE INDEX prompt_logs_pkey ON public.prompt_logs USING btree (id);

CREATE INDEX prompt_logs_user_id_idx ON public.prompt_logs USING btree (user_id);

CREATE INDEX prompts_created_at_idx ON public.prompts USING btree (created_at);

CREATE UNIQUE INDEX prompts_pkey ON public.prompts USING btree (id);

CREATE INDEX prompts_user_id_idx ON public.prompts USING btree (user_id);

CREATE INDEX user_profiles_id_idx ON public.user_profiles USING btree (id);

alter table "public"."examples" add constraint "examples_pkey" PRIMARY KEY using index "examples_pkey";

alter table "public"."project_history" add constraint "project_history_pkey" PRIMARY KEY using index "project_history_pkey";

alter table "public"."prompt_logs" add constraint "prompt_logs_pkey" PRIMARY KEY using index "prompt_logs_pkey";

alter table "public"."prompts" add constraint "prompts_pkey" PRIMARY KEY using index "prompts_pkey";

alter table "public"."project_history" add constraint "project_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."project_history" validate constraint "project_history_user_id_fkey";

alter table "public"."prompt_logs" add constraint "prompt_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."prompt_logs" validate constraint "prompt_logs_user_id_fkey";

alter table "public"."prompts" add constraint "prompts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."prompts" validate constraint "prompts_user_id_fkey";

grant delete on table "public"."examples" to "anon";

grant insert on table "public"."examples" to "anon";

grant references on table "public"."examples" to "anon";

grant select on table "public"."examples" to "anon";

grant trigger on table "public"."examples" to "anon";

grant truncate on table "public"."examples" to "anon";

grant update on table "public"."examples" to "anon";

grant delete on table "public"."examples" to "authenticated";

grant insert on table "public"."examples" to "authenticated";

grant references on table "public"."examples" to "authenticated";

grant select on table "public"."examples" to "authenticated";

grant trigger on table "public"."examples" to "authenticated";

grant truncate on table "public"."examples" to "authenticated";

grant update on table "public"."examples" to "authenticated";

grant delete on table "public"."examples" to "service_role";

grant insert on table "public"."examples" to "service_role";

grant references on table "public"."examples" to "service_role";

grant select on table "public"."examples" to "service_role";

grant trigger on table "public"."examples" to "service_role";

grant truncate on table "public"."examples" to "service_role";

grant update on table "public"."examples" to "service_role";

grant delete on table "public"."project_history" to "anon";

grant insert on table "public"."project_history" to "anon";

grant references on table "public"."project_history" to "anon";

grant select on table "public"."project_history" to "anon";

grant trigger on table "public"."project_history" to "anon";

grant truncate on table "public"."project_history" to "anon";

grant update on table "public"."project_history" to "anon";

grant delete on table "public"."project_history" to "authenticated";

grant insert on table "public"."project_history" to "authenticated";

grant references on table "public"."project_history" to "authenticated";

grant select on table "public"."project_history" to "authenticated";

grant trigger on table "public"."project_history" to "authenticated";

grant truncate on table "public"."project_history" to "authenticated";

grant update on table "public"."project_history" to "authenticated";

grant delete on table "public"."project_history" to "service_role";

grant insert on table "public"."project_history" to "service_role";

grant references on table "public"."project_history" to "service_role";

grant select on table "public"."project_history" to "service_role";

grant trigger on table "public"."project_history" to "service_role";

grant truncate on table "public"."project_history" to "service_role";

grant update on table "public"."project_history" to "service_role";

grant delete on table "public"."prompt_logs" to "anon";

grant insert on table "public"."prompt_logs" to "anon";

grant references on table "public"."prompt_logs" to "anon";

grant select on table "public"."prompt_logs" to "anon";

grant trigger on table "public"."prompt_logs" to "anon";

grant truncate on table "public"."prompt_logs" to "anon";

grant update on table "public"."prompt_logs" to "anon";

grant delete on table "public"."prompt_logs" to "authenticated";

grant insert on table "public"."prompt_logs" to "authenticated";

grant references on table "public"."prompt_logs" to "authenticated";

grant select on table "public"."prompt_logs" to "authenticated";

grant trigger on table "public"."prompt_logs" to "authenticated";

grant truncate on table "public"."prompt_logs" to "authenticated";

grant update on table "public"."prompt_logs" to "authenticated";

grant delete on table "public"."prompt_logs" to "service_role";

grant insert on table "public"."prompt_logs" to "service_role";

grant references on table "public"."prompt_logs" to "service_role";

grant select on table "public"."prompt_logs" to "service_role";

grant trigger on table "public"."prompt_logs" to "service_role";

grant truncate on table "public"."prompt_logs" to "service_role";

grant update on table "public"."prompt_logs" to "service_role";

grant delete on table "public"."prompts" to "anon";

grant insert on table "public"."prompts" to "anon";

grant references on table "public"."prompts" to "anon";

grant select on table "public"."prompts" to "anon";

grant trigger on table "public"."prompts" to "anon";

grant truncate on table "public"."prompts" to "anon";

grant update on table "public"."prompts" to "anon";

grant delete on table "public"."prompts" to "authenticated";

grant insert on table "public"."prompts" to "authenticated";

grant references on table "public"."prompts" to "authenticated";

grant select on table "public"."prompts" to "authenticated";

grant trigger on table "public"."prompts" to "authenticated";

grant truncate on table "public"."prompts" to "authenticated";

grant update on table "public"."prompts" to "authenticated";

grant delete on table "public"."prompts" to "service_role";

grant insert on table "public"."prompts" to "service_role";

grant references on table "public"."prompts" to "service_role";

grant select on table "public"."prompts" to "service_role";

grant trigger on table "public"."prompts" to "service_role";

grant truncate on table "public"."prompts" to "service_role";

grant update on table "public"."prompts" to "service_role";


  create policy "Anyone can read examples"
  on "public"."examples"
  as permissive
  for select
  to public
using (true);



  create policy "Only service_role can modify examples"
  on "public"."examples"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text));



  create policy "Users manage their project history"
  on "public"."project_history"
  as permissive
  for all
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert logs"
  on "public"."prompt_logs"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can view their logs"
  on "public"."prompt_logs"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can delete their prompts"
  on "public"."prompts"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert prompts"
  on "public"."prompts"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can select their prompts"
  on "public"."prompts"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



  create policy "Users can update their prompts"
  on "public"."prompts"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can insert their own profile"
  on "public"."user_profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."user_profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can view their own profile"
  on "public"."user_profiles"
  as permissive
  for select
  to public
using ((auth.uid() = id));



