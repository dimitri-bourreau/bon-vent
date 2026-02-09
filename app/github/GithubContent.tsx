"use client";

import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/molecules/PageHeader";
import { StatsCard } from "@/components/molecules/StatsCard";
import { GithubIssueList } from "@/components/organisms/GithubIssueList";
import { useGithubRepos } from "@/hooks/use-github-repos.hook";
import { useAddGithubRepo } from "@/hooks/use-add-github-repo.hook";
import { useRemoveGithubRepo } from "@/hooks/use-remove-github-repo.hook";
import { useGithubIssues } from "@/hooks/use-github-issues.hook";
import {
  useGithubToken,
  useSetGithubToken,
} from "@/hooks/use-github-token.hook";

export function GithubContent() {
  const [goodFirstIssueOnly, setGoodFirstIssueOnly] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  const { data: repos = [] } = useGithubRepos();
  const { data: token } = useGithubToken();
  const addRepo = useAddGithubRepo();
  const removeRepo = useRemoveGithubRepo();
  const setToken = useSetGithubToken();
  const { data: issuesResult, isLoading: issuesLoading } = useGithubIssues(
    repos,
    token ?? null,
    goodFirstIssueOnly,
  );

  const issues = issuesResult?.issues ?? [];
  const apiError = issuesResult?.error ?? null;

  const handleAddRepo = (event: React.FormEvent) => {
    event.preventDefault();
    if (!repoUrl.trim()) return;
    setAddError(null);
    addRepo.mutate(
      { url: repoUrl.trim() },
      {
        onSuccess: () => setRepoUrl(""),
        onError: (error) => setAddError(error.message),
      },
    );
  };

  const handleSaveToken = () => {
    setToken.mutate(tokenInput);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageHeader
        title="GitHub Issues"
        subtitle="Issues des projets open source auxquels contribuer"
      />

      <div className="grid min-h-0 flex-1 gap-6 px-8 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <StatsCard
              title="Repos suivis"
              value={repos.length}
              variant="primary"
            />
            <StatsCard title="Issues" value={issues.length} variant="default" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="github-token" className="text-sm">
              Token GitHub (optionnel)
            </Label>
            <div className="flex gap-2">
              <Input
                id="github-token"
                type="password"
                placeholder={token ? "••••••••" : "ghp_..."}
                value={tokenInput}
                onChange={(event) => setTokenInput(event.target.value)}
                className="bg-white"
              />
              <Button
                size="sm"
                onClick={handleSaveToken}
                disabled={!tokenInput.trim() || setToken.isPending}
              >
                {setToken.isPending ? "..." : "Sauver"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {token ? "Token configuré. " : ""}
              Augmente la limite API de 60 à 5000 req/h.{" "}
              <a
                href="https://github.com/settings/tokens/new?scopes=public_repo&description=Bon%20Vent"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Créer un token
              </a>
            </p>
          </div>
        </aside>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto">
          <div className="flex flex-wrap items-center gap-3">
            <form onSubmit={handleAddRepo} className="flex gap-2">
              <Input
                type="text"
                placeholder="https://github.com/owner/repo"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                className="w-64 bg-white"
              />
              <Button
                type="submit"
                size="sm"
                disabled={addRepo.isPending || !repoUrl.trim()}
              >
                {addRepo.isPending ? "..." : "Ajouter"}
              </Button>
            </form>

            {repos.map((repo) => (
              <Badge
                key={repo.id}
                variant="secondary"
                className="flex items-center gap-1 py-1"
              >
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {repo.fullName}
                </a>
                <button
                  onClick={() => removeRepo.mutate(repo.id)}
                  className="ml-1 rounded hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

          {addError && <p className="text-sm text-destructive">{addError}</p>}

          {apiError && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {apiError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Checkbox
              id="good-first-issue"
              checked={goodFirstIssueOnly}
              onCheckedChange={(checked) =>
                setGoodFirstIssueOnly(checked === true)
              }
            />
            <Label
              htmlFor="good-first-issue"
              className="cursor-pointer text-sm"
            >
              Afficher uniquement les &quot;good first issue&quot;
            </Label>
          </div>

          <GithubIssueList issues={issues} isLoading={issuesLoading} />
        </div>
      </div>
    </div>
  );
}
