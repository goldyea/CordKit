"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PasswordGate from "@/components/password-gate";
import {
  Search,
  Bell,
  Settings,
  User,
  DollarSign,
  Users,
  Plus,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Home,
  Table,
  CreditCard,
  Edit,
  LogOut,
  Code,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createClient } from "../../supabase/client";
import { Database } from "@/types/supabase";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  clients: { name: string; email: string } | null;
  templates: { name: string; description: string | null } | null;
};
type Template = Database["public"]["Tables"]["templates"]["Row"];

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    revisions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent clients
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch recent projects with client and template info
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(
          `
          *,
          clients(name, email),
          templates(name, description)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(10);

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Fetch templates
      const { data: templatesData, error: templatesError } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (templatesError) throw templatesError;
      setTemplates(templatesData || []);

      // Fetch project stats
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

      setStats({
        inProgress: inProgressResult.count || 0,
        completed: completedResult.count || 0,
        revisions: revisionsResult.count || 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data",
      );
    } finally {
      setLoading(false);
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
                className="nav-item active px-4 py-3 flex items-center gap-3 text-white"
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
          <header className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-vision-muted text-sm">Pages / Dashboard</p>
                <h1 className="text-white text-xl font-bold">Dashboard</h1>
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
            {error && (
              <div className="mb-6 p-4 glass-card border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* Top Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Clients */}
              <div className="vision-metric-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full icon-bg-users flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-vision-muted text-sm mb-1">
                    Total Clients
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-2xl font-bold">
                      {clients.length}
                    </span>
                    <div className="flex items-center text-green-400 text-sm">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* In Progress Projects */}
              <div className="vision-metric-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full icon-bg-clients flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-vision-muted text-sm mb-1">In Progress</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-2xl font-bold">
                      {stats.inProgress}
                    </span>
                    <div className="flex items-center text-blue-400 text-sm">
                      <Clock className="w-3 h-3 mr-1" />
                      Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Completed Projects */}
              <div className="vision-metric-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full icon-bg-money flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-vision-muted text-sm mb-1">Completed</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-2xl font-bold">
                      {stats.completed}
                    </span>
                    <div className="flex items-center text-green-400 text-sm">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Done
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Templates */}
              <div className="vision-metric-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full icon-bg-sales flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-vision-muted text-sm mb-1">Templates</p>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-2xl font-bold">
                      {templates.length}
                    </span>
                    <div className="flex items-center text-cyan-400 text-sm">
                      <Code className="w-3 h-3 mr-1" />
                      Ready
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Welcome Card */}
              <div className="lg:col-span-2">
                <div className="vision-chart-container p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-vision-blue/20 via-vision-cyan/20 to-vision-purple/20 opacity-50"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-white text-lg font-semibold mb-2">
                          Welcome to CordKit Studio
                        </h3>
                        <h2 className="text-white text-3xl font-bold mb-2">
                          Dashboard Overview
                        </h2>
                        <p className="text-vision-muted mb-1">
                          Manage your templates, clients, and projects
                        </p>
                        <p className="text-vision-muted">
                          Everything you need in one place.
                        </p>
                      </div>
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-vision-cyan/30 to-vision-blue/30 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-vision-cyan to-vision-blue opacity-80"></div>
                      </div>
                    </div>
                    <Link href="/projects/new">
                      <Button className="btn-primary-gradient px-6 py-2">
                        Create New Project →
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Project Completion Rate */}
              <div className="vision-chart-container p-6">
                <div className="text-center">
                  <h4 className="text-white font-semibold mb-2">
                    Completion Rate
                  </h4>
                  <p className="text-vision-muted text-sm mb-6">
                    From all projects
                  </p>
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg
                      className="w-32 h-32 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        className="text-gray-700"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-vision-cyan"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${stats.completed + stats.inProgress + stats.revisions > 0 ? Math.round((stats.completed / (stats.completed + stats.inProgress + stats.revisions)) * 100) : 0}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        style={{
                          filter: "drop-shadow(0 0 6px rgba(0, 225, 255, 0.6))",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white text-2xl font-bold">
                          {stats.completed +
                            stats.inProgress +
                            stats.revisions >
                          0
                            ? Math.round(
                                (stats.completed /
                                  (stats.completed +
                                    stats.inProgress +
                                    stats.revisions)) *
                                  100,
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-vision-muted text-xs">
                          Projects done
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Projects and Orders Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Projects Table */}
              <div className="vision-chart-container p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      Projects
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-green-400 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>30 done this month</span>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-vision-muted" />
                </div>
                <div className="space-y-4">
                  {projects.slice(0, 6).map((project, index) => {
                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case "completed":
                          return "text-green-400";
                        case "in_progress":
                          return "text-blue-400";
                        case "revisions":
                          return "text-orange-400";
                        default:
                          return "text-gray-400";
                      }
                    };

                    const getCompletionPercentage = (status: string) => {
                      switch (status) {
                        case "completed":
                          return 100;
                        case "in_progress":
                          return 60;
                        case "revisions":
                          return 80;
                        default:
                          return 0;
                      }
                    };

                    return (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="flex items-center justify-between py-3 hover:bg-white/5 rounded-lg px-2 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vision-cyan/20 to-vision-blue/20 flex items-center justify-center">
                              <span className="text-vision-cyan text-xs font-bold">
                                {project.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium text-sm">
                                {project.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span
                                  className={`text-xs ${getStatusColor(project.status)}`}
                                >
                                  {project.status.replace("_", " ")}
                                </span>
                                <span className="text-vision-muted text-xs">
                                  • {project.clients?.name || "Unknown Client"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white text-sm font-medium mb-1">
                              {project.price_quoted
                                ? `${project.price_quoted}`
                                : "Not set"}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1 bg-gray-700 rounded-full">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-vision-cyan to-vision-blue"
                                  style={{
                                    width: `${getCompletionPercentage(project.status)}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-vision-muted text-xs">
                                {getCompletionPercentage(project.status)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {projects.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-vision-muted">No projects yet</p>
                      <Link href="/projects/new">
                        <Button className="btn-primary-gradient mt-2 text-sm">
                          Create First Project
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Orders Overview */}
              <div className="vision-chart-container p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      Orders overview
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-green-400 mt-1">
                      <ArrowUp className="w-3 h-3" />
                      <span>+30% this month</span>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-vision-muted" />
                </div>
                <div className="space-y-4">
                  {clients.slice(0, 6).map((client, index) => {
                    const getIconColor = (index: number) => {
                      const colors = [
                        "text-green-400",
                        "text-blue-400",
                        "text-purple-400",
                        "text-orange-400",
                        "text-pink-400",
                        "text-cyan-400",
                      ];
                      return colors[index % colors.length];
                    };

                    return (
                      <Link key={client.id} href={`/clients/${client.id}`}>
                        <div className="flex items-center gap-3 py-2 hover:bg-white/5 rounded-lg px-2 transition-colors">
                          <div
                            className={`p-2 rounded-lg bg-white/5 ${getIconColor(index)}`}
                          >
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white text-sm font-medium">
                              New client: {client.name}
                            </h4>
                            <p className="text-vision-muted text-xs">
                              {new Date(client.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {templates.slice(0, 2).map((template, index) => (
                    <Link key={template.id} href={`/templates`}>
                      <div className="flex items-center gap-3 py-2 hover:bg-white/5 rounded-lg px-2 transition-colors">
                        <div className="p-2 rounded-lg bg-white/5 text-cyan-400">
                          <Code className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-medium">
                            Template added: {template.name}
                          </h4>
                          <p className="text-vision-muted text-xs">
                            {new Date(template.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {clients.length === 0 && templates.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-vision-muted">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PasswordGate>
  );
}
