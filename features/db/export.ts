import { getDB } from "./indexeddb";

const DB_VERSION = 3;

export async function exportAllData(): Promise<string> {
  const db = await getDB();
  const settings = await db.getAll("settings");
  const githubToken = settings.find((s) => s.key === "github-token")?.value;

  const data = {
    companies: await db.getAll("companies"),
    zones: await db.getAll("zones"),
    domains: await db.getAll("domains"),
    objectives: await db.getAll("objectives"),
    interactions: await db.getAll("interactions"),
    githubRepos: await db.getAll("github-repos"),
    githubToken,
    exportedAt: new Date().toISOString(),
    version: DB_VERSION,
  };
  return JSON.stringify(data, null, 2);
}

export async function importAllData(jsonString: string): Promise<void> {
  const data = JSON.parse(jsonString);
  const db = await getDB();

  const tx = db.transaction(
    [
      "companies",
      "zones",
      "domains",
      "objectives",
      "interactions",
      "github-repos",
      "settings",
    ],
    "readwrite",
  );

  await Promise.all([
    tx.objectStore("companies").clear(),
    tx.objectStore("zones").clear(),
    tx.objectStore("domains").clear(),
    tx.objectStore("objectives").clear(),
    tx.objectStore("interactions").clear(),
    tx.objectStore("github-repos").clear(),
  ]);

  for (const company of data.companies || []) {
    await tx.objectStore("companies").put(company);
  }
  for (const zone of data.zones || []) {
    await tx.objectStore("zones").put(zone);
  }
  for (const domain of data.domains || []) {
    await tx.objectStore("domains").put(domain);
  }
  for (const objective of data.objectives || []) {
    await tx.objectStore("objectives").put(objective);
  }
  for (const interaction of data.interactions || []) {
    await tx.objectStore("interactions").put(interaction);
  }
  for (const repo of data.githubRepos || []) {
    await tx.objectStore("github-repos").put(repo);
  }
  if (data.githubToken) {
    await tx
      .objectStore("settings")
      .put({ key: "github-token", value: data.githubToken });
  }

  await tx.done;
}
