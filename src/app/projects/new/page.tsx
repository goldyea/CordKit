"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Home,
  Code,
  Users,
  FileText,
  LogOut,
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
import PasswordGate from "@/components/password-gate";
import { createClient } from "../../../../supabase/client";
import { Database } from "@/types/supabase";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Template = Database["public"]["Tables"]["templates"]["Row"];

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClientId = searchParams.get("client");
  const preselectedTemplateId = searchParams.get("template");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client_id: preselectedClientId || "",
    template_id: preselectedTemplateId || "",
    project_type: "static" as "static" | "nextjs" | "vite",
    price_quoted: "",
    due_date: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchClientsAndTemplates();
  }, []);

  const fetchClientsAndTemplates = async () => {
    try {
      const [clientsResult, templatesResult] = await Promise.all([
        supabase.from("clients").select("*").order("name"),
        supabase.from("templates").select("*").order("name"),
      ]);

      if (clientsResult.error) throw clientsResult.error;
      if (templatesResult.error) throw templatesResult.error;

      setClients(clientsResult.data || []);
      setTemplates(templatesResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: formData.name,
          description: formData.description || null,
          client_id: formData.client_id,
          template_id: formData.template_id,
          project_type: formData.project_type,
          price_quoted: formData.price_quoted
            ? parseFloat(formData.price_quoted)
            : null,
          due_date: formData.due_date || null,
          status: "in_progress",
          payment_status: "unpaid",
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/projects/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
                  className="nav-item active px-4 py-3 flex items-center gap-3 text-white"
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
                  Pages / Projects / New
                </p>
                <h1 className="text-white text-xl font-bold">
                  Create New Project
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
            <div className="max-w-2xl mx-auto">
              <div className="vision-chart-container p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-vision-cyan to-vision-blue flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      Create New Project
                    </h2>
                    <p className="text-vision-muted">
                      Set up a new client project
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project Name */}
                  <div className="space-y-2">
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
                      className="input-glass"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
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
                      rows={3}
                      className="input-glass"
                    />
                  </div>

                  {/* Client Selection */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="client_id"
                      className="text-white font-medium"
                    >
                      Client *
                    </Label>
                    <Select
                      value={formData.client_id}
                      onValueChange={(value) =>
                        handleInputChange("client_id", value)
                      }
                    >
                      <SelectTrigger className="input-glass">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name} ({client.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="template_id"
                      className="text-white font-medium"
                    >
                      Template *
                    </Label>
                    <Select
                      value={formData.template_id}
                      onValueChange={(value) =>
                        handleInputChange("template_id", value)
                      }
                    >
                      <SelectTrigger className="input-glass">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name} ({template.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="project_type"
                      className="text-white font-medium"
                    >
                      Project Type *
                    </Label>
                    <Select
                      value={formData.project_type}
                      onValueChange={(value) =>
                        handleInputChange("project_type", value)
                      }
                    >
                      <SelectTrigger className="input-glass">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="static">Static Site</SelectItem>
                        <SelectItem value="nextjs">Next.js</SelectItem>
                        <SelectItem value="vite">Vite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Quoted */}
                  <div className="space-y-2">
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
                      className="input-glass"
                    />
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
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
                      className="input-glass"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 glass-card border-red-500/30 text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={
                        loading || !formData.client_id || !formData.template_id
                      }
                      className="flex-1 btn-primary-gradient"
                    >
                      {loading ? "Creating..." : "Create Project"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/")}
                      disabled={loading}
                      className="btn-secondary-neon"
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
