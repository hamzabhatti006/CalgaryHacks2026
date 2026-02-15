/**
 * Types aligned with shared/schema/analysisSchema.json.
 * Used by popup components and (when implemented) analysisStore / analyzeClient.
 */

export interface Perspective {
  label: string;
  body: string;
  coreFraming?: string;
  stakeholderImpact?: string;
  assumption?: string;
}

export interface AnalysisResult {
  perspectives: Perspective[];
  bias?: { indicators?: string[]; [key: string]: unknown };
  reflection?: string;
}

export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AnalysisState {
  status: AnalysisStatus;
  result: AnalysisResult | null;
  error: string | null;
}
