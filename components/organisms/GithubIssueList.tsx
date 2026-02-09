"use client";

import { ExternalLink, MessageCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { GithubIssue } from "@/features/github/types/github-issue.type";

interface Props {
  issues: GithubIssue[];
  isLoading: boolean;
}

export function GithubIssueList({ issues, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Chargement des issues...
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Aucune issue trouvée.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Repo</TableHead>
          <TableHead>Issue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue, index) => (
          <TableRow
            key={issue.id}
            className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}
          >
            <TableCell className="py-2 text-xs text-muted-foreground">
              {issue.repositoryFullName.split("/")[1]}
            </TableCell>
            <TableCell className="py-2">
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 text-sm hover:text-primary"
              >
                <span className="line-clamp-1">{issue.title}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100" />
                <span className="shrink-0 text-xs text-muted-foreground">
                  #{issue.number}
                </span>
                <span className="flex shrink-0 items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 text-xs font-medium">
                  <MessageCircle className="h-3 w-3" />
                  {issue.comments}
                </span>
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
