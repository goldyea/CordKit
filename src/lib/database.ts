import { createClient } from "../../supabase/server";
import { Database } from "@/types/supabase";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];

type Project = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

type Template = Database["public"]["Tables"]["templates"]["Row"];
type TemplateInsert = Database["public"]["Tables"]["templates"]["Insert"];
type TemplateUpdate = Database["public"]["Tables"]["templates"]["Update"];

type ProjectFile = Database["public"]["Tables"]["project_files"]["Row"];
type ProjectFileInsert =
  Database["public"]["Tables"]["project_files"]["Insert"];
type ProjectFileUpdate =
  Database["public"]["Tables"]["project_files"]["Update"];

// Client operations
export async function getClients() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getClientById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createClient(client: ClientInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .insert(client)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, updates: ClientUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("clients").delete().eq("id", id);

  if (error) throw error;
}

// Project operations
export async function getProjects() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      clients(name, email),
      templates(name, description)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectsByClientId(clientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      templates(name, description, github_repo_url)
    `,
    )
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      clients(name, email, company),
      templates(name, description, github_repo_url)
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProject(project: ProjectInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProject(id: string, updates: ProjectUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;
}

// Template operations
export async function getTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getTemplateById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createTemplate(template: TemplateInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .insert(template)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTemplate(id: string, updates: TemplateUpdate) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("templates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("templates").delete().eq("id", id);

  if (error) throw error;
}

// Project files operations
export async function getProjectFiles(projectId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_files")
    .select("*")
    .eq("project_id", projectId)
    .order("file_path");

  if (error) throw error;
  return data;
}

export async function saveProjectFile(projectFile: ProjectFileInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_files")
    .upsert(projectFile, {
      onConflict: "project_id,file_path",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProjectFile(projectId: string, filePath: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("project_files")
    .delete()
    .eq("project_id", projectId)
    .eq("file_path", filePath);

  if (error) throw error;
}

// Search and filter functions
export async function searchClients(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function searchProjects(query: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      clients(name, email),
      templates(name, description)
    `,
    )
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getProjectStats() {
  const supabase = await createClient();

  const [inProgressResult, completedResult, revisionsResult] =
    await Promise.all([
      supabase
        .from("projects")
        .select("id", { count: "exact" })
        .eq("status", "in_progress"),
      supabase
        .from("projects")
        .select("id", { count: "exact" })
        .eq("status", "completed"),
      supabase
        .from("projects")
        .select("id", { count: "exact" })
        .eq("status", "revisions"),
    ]);

  return {
    inProgress: inProgressResult.count || 0,
    completed: completedResult.count || 0,
    revisions: revisionsResult.count || 0,
  };
}
