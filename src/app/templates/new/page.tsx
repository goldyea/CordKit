"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function NewTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "other" as "minecraft" | "discord" | "other",
    github_repo_url: "",
    preview_image_url: "",
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("templates")
        .insert({
          name: formData.name,
          description: formData.description || null,
          category: formData.category,
          github_repo_url: formData.github_repo_url,
          preview_image_url: formData.preview_image_url || null,
        })
        .select()
        .single();

      if (error) throw error;

      router.push("/templates");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create template",
      );
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
                  className="nav-item active px-4 py-3 flex items-center gap-3 text-white"
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
                  Pages / Templates / New
                </p>
                <h1 className="text-white text-xl font-bold">
                  Add New Template
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
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      Create New Template
                    </h2>
                    <p className="text-vision-muted">
                      Add a new template to your library
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Template Name */}
                  <div className="space-y-2">
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
                      placeholder="Describe this template..."
                      rows={3}
                      className="input-glass"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
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
                      <SelectTrigger className="input-glass">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minecraft">Minecraft</SelectItem>
                        <SelectItem value="discord">Discord</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* GitHub Repository URL */}
                  <div className="space-y-2">
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
                      className="input-glass"
                    />
                  </div>

                  {/* Preview Image URL */}
                  <div className="space-y-2">
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
                      disabled={loading}
                      className="flex-1 btn-primary-gradient"
                    >
                      {loading ? "Creating..." : "Create Template"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/templates")}
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
