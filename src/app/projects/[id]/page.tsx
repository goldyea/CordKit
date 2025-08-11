"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Calendar,
  DollarSign,
  User,
  Code,
  Settings,
  Home,
  Users,
  FileText,
  Plus,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordGate from "@/components/password-gate";
import { createClient } from "../../../../supabase/client";
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  clients: { name: string; email: string; company: string | null } | null;
  templates: {
    name: string;
    description: string | null;
    github_repo_url: string;
  } | null;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select(
          `
          *,
          clients(name, email, company),
          templates(name, description, github_repo_url)
        `,
        )
        .eq("id", projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project");
    } finally {
      setLoading(false);
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

  if (error || !project) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p className="text-muted-foreground mb-4">
                {error || "Project not found"}
              </p>
              <Link href="/">
                <Button>Back to Dashboard</Button>
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
                <p className="text-vision-muted text-xs">Project Details</p>
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
                className="nav-item px-4 py-3 flex items-center gap-3 text-vision-muted hover:text-white"
              >
                <Users className="w-4 h-4" />
                <span className="font-medium">Clients</span>
              </Link>
              <Link
                href="/projects"
                className="nav-item active px-4 py-3 flex items-center gap-3 text-white"
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
          <header className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-vision-muted text-sm">
                  Pages / Projects / {project.name}
                </p>
                <h1 className="text-white text-xl font-bold">
                  Project Details
                </h1>
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
                className="hover:text-white"
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
              <Button size="sm" className="hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="sm" className="hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 px-6 pb-6">
            {/* Project Overview */}
            <div className="vision-chart-container p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-vision-cyan to-vision-blue rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {project.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-white text-3xl font-bold mb-2">
                      {project.name}
                    </h2>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === "completed"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : project.status === "in_progress"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                        }`}
                      >
                        {project.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.payment_status === "paid"
                            ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : project.payment_status === "partial"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}
                      >
                        {project.payment_status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href={`/projects/${projectId}/edit`}>
                    <Button className="btn-secondary-neon px-4 py-2">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </Button>
                  </Link>
                  <Link href={`/projects/${projectId}/editor`}>
                    <Button className="btn-primary-gradient px-4 py-2">
                      <Code className="w-4 h-4 mr-2" />
                      Open Editor
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="vision-metric-card p-4">
                  <p className="text-vision-muted text-sm mb-2 font-medium">
                    Client
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vision-blue to-vision-purple flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {project.clients?.name || "Unknown"}
                      </p>
                      <p className="text-vision-muted text-sm">
                        {project.clients?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="vision-metric-card p-4">
                  <p className="text-vision-muted text-sm mb-2 font-medium">
                    Template
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-vision-cyan to-vision-blue flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {project.templates?.name || "Unknown"}
                      </p>
                      <p className="text-vision-muted text-sm">
                        {project.project_type}
                      </p>
                    </div>
                  </div>
                </div>

                {project.due_date && (
                  <div className="vision-metric-card p-4">
                    <p className="text-vision-muted text-sm mb-2 font-medium">
                      Due Date
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white font-semibold">
                        {new Date(project.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {project.price_quoted && (
                  <div className="vision-metric-card p-4">
                    <p className="text-vision-muted text-sm mb-2 font-medium">
                      Price
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-white font-semibold">
                        ${project.price_quoted}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {project.description && (
                <div className="mt-8 p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                  <p className="text-vision-muted text-sm mb-3 font-medium">
                    Description
                  </p>
                  <p className="text-white">{project.description}</p>
                </div>
              )}
            </div>

            {/* Project Tabs */}
            <div className="vision-chart-container p-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white/10 p-1 rounded-xl">
                  <TabsTrigger
                    value="overview"
                    className="text-white data-[state=active]:bg-vision-cyan data-[state=active]:text-black"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="files"
                    className="text-white data-[state=active]:bg-vision-cyan data-[state=active]:text-black"
                  >
                    Files
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="text-white data-[state=active]:bg-vision-cyan data-[state=active]:text-black"
                  >
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Project Details */}
                    <div className="vision-metric-card p-6">
                      <h3 className="text-white text-lg font-semibold mb-4">
                        Project Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-vision-muted text-sm font-medium">
                            Created
                          </p>
                          <p className="text-white">
                            {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-vision-muted text-sm font-medium">
                            Last Updated
                          </p>
                          <p className="text-white">
                            {new Date(project.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        {project.completed_at && (
                          <div>
                            <p className="text-vision-muted text-sm font-medium">
                              Completed
                            </p>
                            <p className="text-white">
                              {new Date(
                                project.completed_at,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="vision-metric-card p-6">
                      <h3 className="text-white text-lg font-semibold mb-4">
                        Template Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-vision-muted text-sm font-medium">
                            Template Name
                          </p>
                          <p className="text-white">
                            {project.templates?.name || "Unknown"}
                          </p>
                        </div>
                        {project.templates?.description && (
                          <div>
                            <p className="text-vision-muted text-sm font-medium">
                              Description
                            </p>
                            <p className="text-white">
                              {project.templates.description}
                            </p>
                          </div>
                        )}
                        {project.templates?.github_repo_url && (
                          <div>
                            <p className="text-vision-muted text-sm font-medium">
                              Source Repository
                            </p>
                            <a
                              href={project.templates.github_repo_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-vision-cyan hover:text-white flex items-center gap-1 transition-colors"
                            >
                              View on GitHub
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="files">
                  <div className="vision-metric-card p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vision-cyan/20 to-vision-blue/20 flex items-center justify-center mx-auto mb-6">
                        <Code className="w-10 h-10 text-vision-cyan" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-3">
                        File Management
                      </h3>
                      <p className="text-vision-muted mb-6">
                        File management functionality will be available soon.
                      </p>
                      <Button className="btn-secondary-neon px-6 py-2">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure Files
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="vision-metric-card p-8">
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-vision-purple/20 to-vision-blue/20 flex items-center justify-center mx-auto mb-6">
                        <Settings className="w-10 h-10 text-vision-purple" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-3">
                        Project Settings
                      </h3>
                      <p className="text-vision-muted mb-6">
                        Advanced project settings will be available soon.
                      </p>
                      <Button className="btn-secondary-neon px-6 py-2">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Settings
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </PasswordGate>
  );
}
