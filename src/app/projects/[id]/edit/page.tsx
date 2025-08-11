"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Save,
  Home,
  Users,
  FileText,
  Code,
  Plus,
  LogOut,
  Bell,
  Settings,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordGate from "@/components/password-gate";
import { createClient } from "../../../../../supabase/client";
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  clients: { name: string; email: string; company: string | null } | null;
  templates: {
    name: string;
    description: string | null;
    github_repo_url: string;
  } | null;
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "in_progress" as "in_progress" | "completed" | "revisions",
    payment_status: "unpaid" as "unpaid" | "partial" | "paid",
    price_quoted: "",
    price_paid: "",
    due_date: "",
    github_repo_url: "",
    preview_url: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setFetchLoading(true);
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
      setFormData({
        name: data.name,
        description: data.description || "",
        status: data.status,
        payment_status: data.payment_status,
        price_quoted: data.price_quoted?.toString() || "",
        price_paid: data.price_paid?.toString() || "",
        due_date: data.due_date || "",
        github_repo_url: data.github_repo_url || "",
        preview_url: data.preview_url || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updateData: any = {
        name: formData.name,
        description: formData.description || null,
        status: formData.status,
        payment_status: formData.payment_status,
        price_quoted: formData.price_quoted
          ? parseFloat(formData.price_quoted)
          : null,
        price_paid: formData.price_paid
          ? parseFloat(formData.price_paid)
          : null,
        due_date: formData.due_date || null,
        github_repo_url: formData.github_repo_url || null,
        preview_url: formData.preview_url || null,
        updated_at: new Date().toISOString(),
      };

      // Set completed_at if status is completed
      if (formData.status === "completed" && project?.status !== "completed") {
        updateData.completed_at = new Date().toISOString();
      } else if (formData.status !== "completed") {
        updateData.completed_at = null;
      }

      const { data, error } = await supabase
        .from("projects")
        .update(updateData)
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;

      router.push(`/projects/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (fetchLoading) {
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

  if (error && !project) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link href={`/projects/${projectId}`}>
                <Button>Back to Project</Button>
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
                <p className="text-vision-muted text-xs">Edit Project</p>
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
                  Pages / Projects / Edit Project
                </p>
                <h1 className="text-white text-xl font-bold">Edit Project</h1>
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
            <div className="max-w-4xl mx-auto">
              <div className="vision-chart-container p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vision-cyan to-vision-blue flex items-center justify-center">
                    <Edit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      Edit Project Details
                    </h2>
                    <p className="text-vision-muted">
                      Update project information and settings
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Project Name */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-white font-medium">
                      Project Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter project name"
                      required
                      className="input-glass text-white"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-white font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe this project..."
                      rows={4}
                      className="input-glass text-white resize-none"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label htmlFor="status" className="text-white font-medium">
                      Project Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="input-glass text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem
                          value="in_progress"
                          className="text-white hover:bg-gray-800"
                        >
                          In Progress
                        </SelectItem>
                        <SelectItem
                          value="completed"
                          className="text-white hover:bg-gray-800"
                        >
                          Completed
                        </SelectItem>
                        <SelectItem
                          value="revisions"
                          className="text-white hover:bg-gray-800"
                        >
                          Revisions
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Payment Status */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="payment_status"
                      className="text-white font-medium"
                    >
                      Payment Status
                    </Label>
                    <Select
                      value={formData.payment_status}
                      onValueChange={(value) =>
                        handleInputChange("payment_status", value)
                      }
                    >
                      <SelectTrigger className="input-glass text-white">
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem
                          value="unpaid"
                          className="text-white hover:bg-gray-800"
                        >
                          Unpaid
                        </SelectItem>
                        <SelectItem
                          value="partial"
                          className="text-white hover:bg-gray-800"
                        >
                          Partial
                        </SelectItem>
                        <SelectItem
                          value="paid"
                          className="text-white hover:bg-gray-800"
                        >
                          Paid
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pricing */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="price_quoted"
                        className="text-white font-medium"
                      >
                        Price Quoted ($)
                      </Label>
                      <Input
                        id="price_quoted"
                        type="number"
                        step="0.01"
                        value={formData.price_quoted}
                        onChange={(e) =>
                          handleInputChange("price_quoted", e.target.value)
                        }
                        placeholder="0.00"
                        className="input-glass text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="price_paid"
                        className="text-white font-medium"
                      >
                        Price Paid ($)
                      </Label>
                      <Input
                        id="price_paid"
                        type="number"
                        step="0.01"
                        value={formData.price_paid}
                        onChange={(e) =>
                          handleInputChange("price_paid", e.target.value)
                        }
                        placeholder="0.00"
                        className="input-glass text-white"
                      />
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="due_date"
                      className="text-white font-medium"
                    >
                      Due Date
                    </Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) =>
                        handleInputChange("due_date", e.target.value)
                      }
                      className="input-glass text-white"
                    />
                  </div>

                  {/* URLs */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label
                        htmlFor="github_repo_url"
                        className="text-white font-medium"
                      >
                        GitHub Repository URL
                      </Label>
                      <Input
                        id="github_repo_url"
                        type="url"
                        value={formData.github_repo_url}
                        onChange={(e) =>
                          handleInputChange("github_repo_url", e.target.value)
                        }
                        placeholder="https://github.com/username/repo"
                        className="input-glass text-white"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label
                        htmlFor="preview_url"
                        className="text-white font-medium"
                      >
                        Preview URL
                      </Label>
                      <Input
                        id="preview_url"
                        type="url"
                        value={formData.preview_url}
                        onChange={(e) =>
                          handleInputChange("preview_url", e.target.value)
                        }
                        placeholder="https://example.com"
                        className="input-glass text-white"
                      />
                    </div>
                  </div>

                  {/* Client and Template Info (Read-only) */}
                  <div className="grid md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div>
                      <Label className="text-vision-muted text-sm font-medium">
                        Client
                      </Label>
                      <p className="text-white font-semibold mt-1">
                        {project?.clients?.name || "Unknown"}
                      </p>
                      <p className="text-vision-muted text-sm">
                        {project?.clients?.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-vision-muted text-sm font-medium">
                        Template
                      </Label>
                      <p className="text-white font-semibold mt-1">
                        {project?.templates?.name || "Unknown"}
                      </p>
                      <p className="text-vision-muted text-sm">
                        {project?.project_type}
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-primary-gradient flex-1 py-3"
                    >
                      {loading ? (
                        <>
                          <Save className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Project
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push(`/projects/${projectId}`)}
                      disabled={loading}
                      className="btn-secondary-neon px-8 py-3"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </PasswordGate>
  );
}
