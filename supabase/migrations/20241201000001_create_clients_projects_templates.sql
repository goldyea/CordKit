-- Create enums for better type safety
CREATE TYPE template_category_enum AS ENUM ('minecraft', 'discord', 'other');
CREATE TYPE project_status_enum AS ENUM ('in_progress', 'completed', 'revisions');
CREATE TYPE project_type_enum AS ENUM ('static', 'nextjs', 'vite');
CREATE TYPE payment_status_enum AS ENUM ('unpaid', 'partial', 'paid');

-- Templates table
CREATE TABLE IF NOT EXISTS public.templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    category template_category_enum DEFAULT 'other',
    github_repo_url text NOT NULL,
    preview_image_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    phone text,
    company text,
    notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    template_id uuid NOT NULL REFERENCES public.templates(id) ON DELETE RESTRICT,
    name text NOT NULL,
    description text,
    github_repo_url text,
    preview_url text,
    status project_status_enum DEFAULT 'in_progress',
    project_type project_type_enum DEFAULT 'static',
    payment_status payment_status_enum DEFAULT 'unpaid',
    price_quoted decimal(10,2),
    price_paid decimal(10,2) DEFAULT 0,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Project files table for storing modified code
CREATE TABLE IF NOT EXISTS public.project_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    file_path text NOT NULL,
    file_content text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    UNIQUE(project_id, file_path)
);

-- Insert some sample templates
INSERT INTO public.templates (name, description, category, github_repo_url, preview_image_url) VALUES
('Minecraft Server Hub', 'Modern server website with voting system and player stats', 'minecraft', 'https://github.com/example/minecraft-server-template', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80'),
('Discord Bot Landing', 'Clean bot showcase with invite button and feature list', 'discord', 'https://github.com/example/discord-bot-template', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&q=80'),
('Gaming Community', 'Esports team website with tournament info and member profiles', 'other', 'https://github.com/example/gaming-community-template', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80'),
('Portfolio Template', 'Professional portfolio for developers with project showcase', 'other', 'https://github.com/example/portfolio-template', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80');

-- Insert some sample clients
INSERT INTO public.clients (name, email, company, notes) VALUES
('Acme Gaming Server', 'admin@acmegaming.com', 'Acme Gaming LLC', 'Large Minecraft server network with 1000+ daily players'),
('Discord Community Hub', 'owner@discordhub.com', 'Community Hub Inc', 'Discord bot development and community management'),
('Esports Team Alpha', 'manager@teamalpha.gg', 'Team Alpha Esports', 'Professional esports organization');

-- Enable realtime for all tables
alter publication supabase_realtime add table templates;
alter publication supabase_realtime add table clients;
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table project_files;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON public.projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_template_id ON public.projects(template_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON public.templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_files_updated_at BEFORE UPDATE ON public.project_files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
