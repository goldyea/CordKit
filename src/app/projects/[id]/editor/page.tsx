"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Github,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PasswordGate from "@/components/password-gate";
import { createClient } from "../../../../../supabase/client";
import { Database } from "@/types/supabase";
import sdk from "@stackblitz/sdk";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  clients: { name: string; email: string; company: string | null } | null;
  templates: {
    name: string;
    description: string | null;
    github_repo_url: string;
  } | null;
};

export default function ProjectEditorPage() {
  const params = useParams();
  const projectId = params.id as string;
  const editorRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [editorLoading, setEditorLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stackblitzVM, setStackblitzVM] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  useEffect(() => {
    if (project && editorRef.current && !stackblitzVM) {
      initializeEditor();
    }
  }, [project, stackblitzVM]);

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

      // Track editor usage
      await trackEditorUsage(data.id, data.template_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project");
    } finally {
      setLoading(false);
    }
  };

  const trackEditorUsage = async (projectId: string, templateId: string) => {
    try {
      await supabase
        .from("projects")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", projectId);
    } catch (err) {
      console.error("Failed to track editor usage:", err);
    }
  };

  const initializeEditor = async () => {
    if (!project?.templates?.github_repo_url || !editorRef.current) return;

    try {
      setEditorLoading(true);

      // Extract GitHub repo info from URL
      const repoUrl = project.templates.github_repo_url;
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);

      if (!match) {
        throw new Error("Invalid GitHub repository URL");
      }

      const [, owner, repo] = match;
      const repoName = repo.replace(/\.git$/, "");

      // Embed StackBlitz editor
      const vm = await sdk.embedGithubProject(
        editorRef.current,
        `${owner}/${repoName}`,
        {
          height: window.innerHeight - 50,
          openFile: "README.md",
          view: "editor",
          hideNavigation: false,
          forceEmbedLayout: true,
          theme: "dark",
        },
      );

      setStackblitzVM(vm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize editor",
      );
    } finally {
      setEditorLoading(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!stackblitzVM) return;

    try {
      const files = await stackblitzVM.getFsSnapshot();
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      Object.entries(files).forEach(([path, content]) => {
        zip.file(path, content as string);
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name || "project"}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download ZIP:", err);
      alert("Failed to download project files");
    }
  };

  const handleSaveToGitHub = () => {
    if (!stackblitzVM) return;
    alert(
      "GitHub integration: This would typically open StackBlitz's built-in GitHub export functionality.",
    );
  };

  const handleDeploy = () => {
    if (!stackblitzVM) return;
    alert(
      "Deploy integration: This would integrate with Vercel/Netlify APIs for direct deployment.",
    );
  };

  if (loading) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-[#0a0f1f] editor-container">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7aa2f7]"></div>
          </div>
        </div>
      </PasswordGate>
    );
  }

  if (error || !project) {
    return (
      <PasswordGate>
        <div className="min-h-screen bg-[#0a0f1f] editor-container">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4 text-[#e5eaf5]">Error</h1>
              <p className="text-[#7aa2f7] mb-4">
                {error || "Project not found"}
              </p>
              <Link href={`/projects/${projectId}`}>
                <Button className="bg-[#7aa2f7] hover:bg-[#6b93f0] text-[#0a0f1f]">
                  Back to Project
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PasswordGate>
    );
  }

  return (
    <PasswordGate>
      <div className="h-screen bg-[#0a0f1f] editor-container flex flex-col overflow-hidden">
        {/* Slim Top Bar - Fixed 50px height */}
        <header className="h-[50px] bg-[#0d1421] editor-topbar border-b border-[#1a2332] flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Link
              href={`/projects/${projectId}`}
              className="flex items-center gap-2 text-[#7aa2f7] hover:text-[#e5eaf5] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="h-4 w-px bg-[#1a2332]" />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-[#7aa2f7] to-[#bb9af7] rounded flex items-center justify-center text-[#0a0f1f] font-semibold text-xs">
                {project.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#e5eaf5]">
                {project.name}
              </span>
              <Badge className="bg-[#1a2332] text-[#7aa2f7] border-[#1a2332] text-xs">
                {project.templates?.name || "Template"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadZip}
              disabled={!stackblitzVM}
              className="text-[#e5eaf5] hover:bg-[#1a2332] hover:text-[#7aa2f7] h-8 px-3"
            >
              <Download className="w-3 h-3 mr-1" />
              <span className="text-xs">ZIP</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveToGitHub}
              disabled={!stackblitzVM}
              className="text-[#e5eaf5] hover:bg-[#1a2332] hover:text-[#7aa2f7] h-8 px-3"
            >
              <Github className="w-3 h-3 mr-1" />
              <span className="text-xs">GitHub</span>
            </Button>
            <Button
              size="sm"
              onClick={handleDeploy}
              disabled={!stackblitzVM}
              className="bg-[#7aa2f7] hover:bg-[#6b93f0] text-[#0a0f1f] h-8 px-3"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              <span className="text-xs">Deploy</span>
            </Button>
            <div className="h-4 w-px bg-[#1a2332] mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const signOutElement =
                  document.getElementById("signout-handler");
                if (signOutElement) {
                  signOutElement.click();
                }
              }}
              className="text-[#e5eaf5] hover:bg-[#1a2332] hover:text-[#7aa2f7] h-8 px-3"
            >
              <span className="text-xs">Sign Out</span>
            </Button>
          </div>
        </header>

        {/* Editor Container - Takes remaining height */}
        <div className="flex-1 bg-[#0a0f1f] overflow-hidden">
          {editorLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#7aa2f7]" />
                <h3 className="text-lg font-semibold mb-2 text-[#e5eaf5]">
                  Loading Editor
                </h3>
                <p className="text-[#7aa2f7] text-sm">
                  Setting up StackBlitz workspace...
                </p>
              </div>
            </div>
          ) : (
            <div
              ref={editorRef}
              className="w-full h-full bg-[#0a0f1f]"
              style={{ height: "calc(100vh - 50px)" }}
            >
              {!stackblitzVM && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-[#7aa2f7] mb-4">
                      Click the button below to initialize the editor
                    </p>
                    <Button
                      onClick={initializeEditor}
                      className="bg-[#7aa2f7] hover:bg-[#6b93f0] text-[#0a0f1f]"
                    >
                      Initialize Editor
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PasswordGate>
  );
}
