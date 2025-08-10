"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Mail,
  Building,
  Home,
  Code,
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

type Client = Database["public"]["Tables"]["clients"]["Row"];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  const searchClients = async (query: string) => {
    if (!query.trim()) {
      fetchClients();
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .or(
          `name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search clients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchClients(searchQuery);
  };

  const deleteClient = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this client? This will also delete all their projects.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);

      if (error) throw error;
      setClients(clients.filter((client) => client.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete client");
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
                <p className="text-vision-muted text-sm">Pages / Clients</p>
                <h1 className="text-white text-xl font-bold">Clients</h1>
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
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-white text-2xl font-bold">
                  Client Management
                </h2>
                <p className="text-vision-muted">
                  Manage your clients and their information
                </p>
              </div>
              <Link href="/clients/new">
                <Button className="btn-primary-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </Link>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vision-muted w-4 h-4" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-glass"
                />
              </div>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 glass-card border-red-500/30 text-red-400">
                {error}
              </div>
            )}

            {/* Clients Grid */}
            <div className="grid gap-6">
              {clients.length === 0 ? (
                <div className="vision-chart-container p-12 text-center">
                  <Users className="w-16 h-16 text-vision-muted mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">
                    No clients found
                  </h3>
                  <p className="text-vision-muted mb-4">
                    {searchQuery
                      ? "No clients match your search criteria."
                      : "Get started by adding your first client."}
                  </p>
                  {!searchQuery && (
                    <Link href="/clients/new">
                      <Button className="btn-primary-gradient">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Client
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                clients.map((client) => (
                  <div
                    key={client.id}
                    className="vision-chart-container p-6 hover-glow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-vision-cyan to-vision-blue rounded-full flex items-center justify-center text-white font-semibold">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-white">
                            {client.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-vision-muted">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {client.email}
                            </div>
                            {client.company && (
                              <div className="flex items-center gap-1">
                                <Building className="w-4 h-4" />
                                {client.company}
                              </div>
                            )}
                          </div>
                          {client.notes && (
                            <p className="text-sm text-vision-muted mt-1">
                              {client.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/clients/${client.id}`}>
                          <Button size="sm" className="btn-secondary-neon">
                            View Projects
                          </Button>
                        </Link>
                        <Link href={`/clients/${client.id}/edit`}>
                          <Button size="sm" className="btn-secondary-neon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteClient(client.id)}
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
