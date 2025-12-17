"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

type Project = {
  name: string;
  url: string;
};

export function ProjectsInput({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}) {
  const addProject = () => {
    onChange([...projects, { name: "", url: "" }]);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (
    index: number,
    field: "name" | "url",
    value: string,
  ) => {
    const updated = [...projects];
    const currentProject = updated[index];
    if (!currentProject) return;

    updated[index] = {
      name: field === "name" ? value : currentProject.name,
      url: field === "url" ? value : currentProject.url,
    };
    onChange(updated);
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label>Notable Projects (max 2)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addProject}
          className="h-8"
          disabled={projects.length >= 2}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Project
        </Button>
      </div>
      {projects.length === 0 && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          No projects added yet
        </p>
      )}
      {projects.length >= 2 && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Maximum of 2 projects allowed
        </p>
      )}
      {projects.map((project, index) => (
        <div key={index} className="flex gap-2">
          <Input
            placeholder="Project name"
            value={project.name}
            onChange={(e) => updateProject(index, "name", e.target.value)}
            className="flex-1"
          />
          <Input
            type="url"
            placeholder="https://example.com"
            value={project.url}
            onChange={(e) => updateProject(index, "url", e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => removeProject(index)}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
