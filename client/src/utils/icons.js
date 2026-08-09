// Allowlist of lucide icons addressable from CMS payloads by name.
// Admin content blocks set `iconName` (e.g. "sparkles"); the client maps it
// here so arbitrary component references never come from stored content.
import { Sparkles, Brain, Target, Wrench, Users, BookOpen, FlaskConical, DollarSign, FileText, Award, FlaskRound } from 'lucide-react';

export const ICON_MAP = {
  sparkles: Sparkles,
  brain: Brain,
  target: Target,
  wrench: Wrench,
  users: Users,
  bookopen: BookOpen,
  flaskconical: FlaskConical,
  flaskround: FlaskRound,
  dollarsign: DollarSign,
  filetext: FileText,
  award: Award,
};

export function resolveIcon(name, Fallback) {
  if (name && ICON_MAP[name]) return ICON_MAP[name];
  return Fallback || Sparkles;
}
