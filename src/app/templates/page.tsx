"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Code,
  Home,
  Users,
  FileText,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PasswordGate from "@/components/password-gate";
import { createClient } from "../../../supabase/client";
import { Database } from "@/types/supabase";

type Template = Database["public"]["Tables"]["templates"]["Row"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch templates",
      );
    } finally {
      setLoading(false);
    }
  };

  const searchTemplates = async (query: string, category: string) => {
    try {
      setLoading(true);
      let queryBuilder = supabase.from("templates").select("*");

      if (query.trim()) {
        queryBuilder = queryBuilder.or(
          `name.ilike.%${query}%,description.ilike.%${query}%`,
        );
      }

      if (category !== "all") {
        queryBuilder = queryBuilder.eq("category", category);
      }

      const { data, error } = await queryBuilder.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setTemplates(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search templates",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchTemplates(searchQuery, selectedCategory);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    searchTemplates(searchQuery, category);
  };

  const deleteTemplate = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this template? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("templates").delete().eq("id", id);

      if (error) throw error;
      setTemplates(templates.filter((template) => template.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete template",
      );
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "minecraft":
        return "bg-green-100 text-green-800";
      case "discord":
        return "bg-blue-100 text-blue-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <header className="p-6 flex items-center justify-between glass-header">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-vision-muted text-sm">Pages / Templates</p>
                <h1 className="text-white text-xl font-bold">Templates</h1>
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
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 px-6 pb-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white text-2xl font-bold">
                  Template Library
                </h2>
                <p className="text-vision-muted">
                  Browse and manage your template library
                </p>
              </div>
              <Link href="/templates/new">
                <Button className="btn-primary-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Template
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vision-muted w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 input-glass"
                  />
                </div>
              </form>

              {/* Category Filter */}
              <div className="flex gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "minecraft", label: "Minecraft" },
                  { key: "discord", label: "Discord" },
                  { key: "other", label: "Other" },
                ].map((category) => (
                  <Button
                    key={category.key}
                    className={
                      selectedCategory === category.key
                        ? "btn-primary-gradient"
                        : "btn-secondary-neon"
                    }
                    size="sm"
                    onClick={() => handleCategoryChange(category.key)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 glass-card border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.length === 0 ? (
                <div className="col-span-full">
                  <div className="vision-chart-container p-12 text-center">
                    <Code className="w-16 h-16 text-vision-muted mx-auto mb-4" />
                    <h3 className="text-white text-xl font-semibold mb-2">
                      No templates found
                    </h3>
                    <p className="text-vision-muted mb-4">
                      {searchQuery || selectedCategory !== "all"
                        ? "No templates match your search criteria."
                        : "Get started by adding your first template."}
                    </p>
                    {!searchQuery && selectedCategory === "all" && (
                      <Link href="/templates/new">
                        <Button className="btn-primary-gradient">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Template
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="vision-chart-container overflow-hidden hover-glow"
                  >
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                      {template.preview_image_url ? (
                        <img
                          src={template.preview_image_url}
                          alt={template.name}
                          className="w-full h-full object-cover opacity-80"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code className="w-12 h-12 text-white opacity-60" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          {template.name}
                        </h3>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      {template.description && (
                        <p className="text-sm text-vision-muted">
                          {template.description}
                        </p>
                      )}
                    </div>
                    <div className="p-6 pt-0">
                      <div className="flex gap-2">
                        <Link
                          href={`/projects/new?template=${template.id}`}
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            className="w-full btn-primary-gradient"
                          >
                            Use Template
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="btn-secondary-neon"
                          asChild
                        >
                          <a
                            href={template.github_repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        <Link href={`/templates/${template.id}/edit`}>
                          <Button size="sm" className="btn-secondary-neon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTemplate(template.id)}
                          className="text-red-400 hover:text-red-300 border-red-400/30 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </PasswordGate>
  );
}
