"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Home,
  Users,
  FileText,
  Code,
  Plus,
  LogOut,
  Bell,
  Settings,
  Search,
  Save,
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

type Template = Database["public"]["Tables"]["templates"]["Row"];

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other" as "minecraft" | "discord" | "other",
    github_repo_url: "",
    preview_image_url: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (error) throw error;

      setTemplate(data);
      setFormData({
        name: data.name,
        description: data.description || "",
        category: data.category,
        github_repo_url: data.github_repo_url,
        preview_image_url: data.preview_image_url || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch template");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("templates")
        .update({
          name: formData.name,
          description: formData.description || null,
          category: formData.category,
          github_repo_url: formData.github_repo_url,
          preview_image_url: formData.preview_image_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", templateId)
        .select()
        .single();

      if (error) throw error;

      router.push("/templates");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update template",
      );
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

  if (error && !template) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Error</h1>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Link href="/templates">
                <Button>Back to Templates</Button>
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
                <p className="text-vision-muted text-xs">Edit Template</p>
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
                className="nav-item active px-4 py-3 flex items-center gap-3 text-white"
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
                <p className="text-vision-muted text-sm">
                  Pages / Templates / Edit Template
                </p>
                <h1 className="text-white text-xl font-bold">Edit Template</h1>
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
                      Edit Template
                    </h2>
                    <p className="text-vision-muted">
                      Update template information and settings
                    </p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Template Name */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-white font-medium">
                      Template Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter template name"
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
                      placeholder="Describe this template..."
                      rows={4}
                      className="input-glass text-white resize-none"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="category"
                      className="text-white font-medium"
                    >
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                    >
                      <SelectTrigger className="input-glass text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem
                          value="minecraft"
                          className="text-white hover:bg-gray-800"
                        >
                          Minecraft
                        </SelectItem>
                        <SelectItem
                          value="discord"
                          className="text-white hover:bg-gray-800"
                        >
                          Discord
                        </SelectItem>
                        <SelectItem
                          value="other"
                          className="text-white hover:bg-gray-800"
                        >
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* GitHub Repository URL */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="github_repo_url"
                      className="text-white font-medium"
                    >
                      GitHub Repository URL *
                    </Label>
                    <Input
                      id="github_repo_url"
                      type="url"
                      value={formData.github_repo_url}
                      onChange={(e) =>
                        handleInputChange("github_repo_url", e.target.value)
                      }
                      placeholder="https://github.com/username/repo"
                      required
                      className="input-glass text-white"
                    />
                  </div>

                  {/* Preview Image URL */}
                  <div className="space-y-3">
                    <Label
                      htmlFor="preview_image_url"
                      className="text-white font-medium"
                    >
                      Preview Image URL
                    </Label>
                    <Input
                      id="preview_image_url"
                      type="url"
                      value={formData.preview_image_url}
                      onChange={(e) =>
                        handleInputChange("preview_image_url", e.target.value)
                      }
                      placeholder="https://example.com/preview.jpg"
                      className="input-glass text-white"
                    />
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
                          Update Template
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => router.push("/templates")}
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
