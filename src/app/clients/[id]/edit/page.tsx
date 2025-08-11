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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordGate from "@/components/password-gate";
import { createClient } from "../../../../../supabase/client";
import { Database } from "@/types/supabase";

type Client = Database["public"]["Tables"]["clients"]["Row"];

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const fetchClient = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

      if (error) throw error;

      setClient(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        company: data.company || "",
        notes: data.notes || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch client");
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
        .from("clients")
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clientId)
        .select()
        .single();

      if (error) throw error;

      router.push(`/clients/${clientId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update client");
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
        <div className="min-h-screen flex font-poppins">
          <aside className="w-64 vision-sidebar flex flex-col">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vision-cyan to-vision-blue flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">
                    CORDKIT STUDIO
                  </h1>
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
            </div>
          </aside>
          <div className="flex-1 flex flex-col">
            <header className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-vision-muted text-sm">
                    Pages / Clients / Edit
                  </p>
                  <h1 className="text-white text-xl font-bold">Edit Client</h1>
                </div>
              </div>
            </header>
            <main className="flex-1 px-6 pb-6 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vision-cyan"></div>
            </main>
          </div>
        </div>
      </PasswordGate>
    );
  }

  if (error && !client) {
    return (
      <PasswordGate>
        <div className="min-h-screen flex font-poppins">
          <aside className="w-64 vision-sidebar flex flex-col">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vision-cyan to-vision-blue flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg">
                    CORDKIT STUDIO
                  </h1>
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
            </div>
          </aside>
          <div className="flex-1 flex flex-col">
            <header className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-vision-muted text-sm">
                    Pages / Clients / Edit
                  </p>
                  <h1 className="text-white text-xl font-bold">Edit Client</h1>
                </div>
              </div>
            </header>
            <main className="flex-1 px-6 pb-6">
              <div className="vision-chart-container p-8 text-center">
                <h2 className="text-white text-2xl font-bold mb-4">Error</h2>
                <p className="text-vision-muted mb-6">{error}</p>
                <Link href="/clients">
                  <Button className="btn-primary-gradient">
                    Back to Clients
                  </Button>
                </Link>
              </div>
            </main>
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
          <header className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-vision-muted text-sm">
                  Pages / Clients / Edit
                </p>
                <h1 className="text-white text-xl font-bold">Edit Client</h1>
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

          {/* Main Content */}
          <main className="flex-1 px-6 pb-6">
            <div className="max-w-4xl mx-auto">
              {/* Back Navigation */}
              <div className="mb-6">
                <Link
                  href={`/clients/${clientId}`}
                  className="inline-flex items-center gap-2 text-vision-muted hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Client Details
                </Link>
              </div>

              {/* Edit Form */}
              <div className="vision-chart-container p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-vision-cyan/20 to-vision-blue/20 flex items-center justify-center">
                    <Edit className="w-6 h-6 text-vision-cyan" />
                  </div>
                  <div>
                    <h2 className="text-white text-2xl font-bold">
                      Edit Client Information
                    </h2>
                    <p className="text-vision-muted">
                      Update client details and contact information
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="Enter client's full name"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-vision-muted focus:border-vision-cyan"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="client@example.com"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-vision-muted focus:border-vision-cyan"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="(555) 123-4567"
                        className="bg-white/10 border-white/20 text-white placeholder:text-vision-muted focus:border-vision-cyan"
                      />
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-white font-medium"
                      >
                        Company
                      </Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        placeholder="Company name"
                        className="bg-white/10 border-white/20 text-white placeholder:text-vision-muted focus:border-vision-cyan"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white font-medium">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Additional notes about this client..."
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-vision-muted focus:border-vision-cyan resize-none"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      {error}
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="btn-primary-gradient px-8 py-3 flex-1 md:flex-none"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Client
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/clients/${clientId}`)}
                      disabled={loading}
                      className="px-8 py-3 bg-white/10 border-white/20 text-white hover:bg-white/20"
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
