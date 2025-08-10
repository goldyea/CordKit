"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  DollarSign,
  Home,
  Code,
  Users,
  FileText,
  Search,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import PasswordGate from "@/components/password-gate";
import { createClient } from "../../../../supabase/client";
import { Database } from "@/types/supabase";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  templates: { name: string; description: string | null } | null;
};

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      setLoading(true);

      // Fetch client details
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);

      // Fetch client's projects
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          *,
          templates(name, description)
        `,
        )
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch client data",
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in_progress":
        return "secondary";
      case "revisions":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "partial":
        return "secondary";
      case "unpaid":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </PasswordGate>
    );
  }

  if (error || !client) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p className="text-muted-foreground mb-4">
                {error || "Client not found"}
              </p>
              <Link href="/clients">
                <Button>Back to Clients</Button>
              </Link>
            </div>
          </div>
        </div>
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
      <div className="min-h-screen flex font-poppins">
        {/* Vision UI Sidebar */}
        <aside className="w-64 vision-sidebar flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vision-cyan to-vision-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">CORDKIT STUDIO</h1>
                <p className="text-vision-muted text-xs">Dashboard</p>
              </div>
            </div>

            <nav className="space-y-1">
              <Link
                href="/"
                className="nav-item px-4 py-3 flex items-center gap-3 text-vision-muted hover:text-white"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/templates"
                className="nav-item px-4 py-3 flex items-center gap-3 text-vision-muted hover:text-white"
              >
                <Code className="w-4 h-4" />
                <span className="font-medium">Templates</span>
              </Link>
              <Link
                href="/clients"
                className="nav-item active px-4 py-3 flex items-center gap-3 text-white"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Clients</span>
              </Link>
              <Link
                href="/projects"
                className="nav-item px-4 py-3 flex items-center gap-3 text-vision-muted hover:text-white"
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Projects</span>
              </Link>
            </nav>

            <div className="mt-8">
              <p className="text-vision-muted text-xs font-semibold uppercase tracking-wider mb-4">
                QUICK ACTIONS
              </p>
              <nav className="space-y-1">
                <Link
                  href="/clients/new"
                  className="nav-item px-4 py-3 flex items-center gap-3 text-vision-muted hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">New Client</span>
                </Link>
                <Link
                  href="/projects/new"
                  className="nav-item px-4 py-3 flex items-center gap-3 text-vision-muted hover:text-white"
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">New Project</span>
                </Link>
                <Link
                  href="/templates/new"
                  className="nav-item px-4 py-3 flex items-center gap-3 text-vision-muted hover:text-white"
                >
                  <Code className="w-4 h-4" />
                  <span className="font-medium">New Template</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="p-6 flex items-center justify-between glass-header">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-vision-muted text-sm">
                  Pages / Clients / {client.name}
                </p>
                <h1 className="text-white text-xl font-bold">{client.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vision-muted w-4 h-4" />
                <Input
                  placeholder="Type here..."
                  className="pl-10 w-64 bg-white/10 border-white/20 text-white placeholder:text-vision-muted"
                />
              </div>
              <Button
                size="sm"
                className="text-vision-muted hover:text-white"
                onClick={() => {
                  const signOutElement =
                    document.getElementById("signout-handler");
                  if (signOutElement) {
                    signOutElement.click();
                  }
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 px-6 pb-6">
            {/* Client Info */}
            <div className="vision-chart-container p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-vision-cyan to-vision-blue rounded-full flex items-center justify-center text-white font-semibold text-xl">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      {client.name}
                    </h2>
                    <p className="text-vision-muted">Client Profile</p>
                  </div>
                </div>
                <Link href={`/clients/${client.id}/edit`}>
                  <Button className="btn-primary-gradient">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Client
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-vision-muted mb-1">
                    Email
                  </p>
                  <p className="text-white font-medium">{client.email}</p>
                </div>
                {client.phone && (
                  <div>
                    <p className="text-sm font-medium text-vision-muted mb-1">
                      Phone
                    </p>
                    <p className="text-white font-medium">{client.phone}</p>
                  </div>
                )}
                {client.company && (
                  <div>
                    <p className="text-sm font-medium text-vision-muted mb-1">
                      Company
                    </p>
                    <p className="text-white font-medium">{client.company}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-vision-muted mb-1">
                    Client Since
                  </p>
                  <p className="text-white font-medium">
                    {new Date(client.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {client.notes && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-vision-muted mb-2">
                    Notes
                  </p>
                  <p className="text-white">{client.notes}</p>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Projects</h2>
                <p className="text-muted-foreground">
                  {projects.length} project{projects.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Link href={`/projects/new?client=${client.id}`}>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </Link>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6">
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-xl font-semibold mb-2">
                      No projects yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Create the first project for {client.name}
                    </p>
                    <Link href={`/projects/new?client=${client.id}`}>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card
                    key={project.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {project.name}
                            </h3>
                            <Badge variant={getStatusColor(project.status)}>
                              {project.status.replace("_", " ")}
                            </Badge>
                            <Badge
                              variant={getPaymentStatusColor(
                                project.payment_status,
                              )}
                            >
                              {project.payment_status}
                            </Badge>
                          </div>

                          {project.description && (
                            <p className="text-muted-foreground mb-3">
                              {project.description}
                            </p>
                          )}

                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                            <span>
                              Template: {project.templates?.name || "Unknown"}
                            </span>
                            {project.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Due:{" "}
                                {new Date(
                                  project.due_date,
                                ).toLocaleDateString()}
                              </div>
                            )}
                            {project.price_quoted && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />$
                                {project.price_quoted}
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground">
                            Created:{" "}
                            {new Date(project.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/projects/${project.id}`}>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProject(project.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </PasswordGate>
  );
}
