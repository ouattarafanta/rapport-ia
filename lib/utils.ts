export { cn } from "cn";

export function formatIdentifiant(identifiant: string) {
  return identifiant.replace(".local.reportflow", "");
}
