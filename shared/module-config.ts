/**
 * Module Configuration - Maximum Raw Points
 * 
 * This configuration defines the maximum possible raw points for each meeting
 * in each module, according to the curriculum standards.
 */

export interface MeetingMaxPoints {
  meeting1: number;
  meeting2: number;
  meeting3: number;
  meeting4: number;
}

export interface ModuleConfiguration {
  totalMaxPoints: number;
  meetings: MeetingMaxPoints;
}

/**
 * MODULE_CONFIG defines max raw points for each module and meeting
 * 
 * Score Calculation Formula:
 * 1. Meeting Score (0-100 scale) = (User_Raw_Points / Max_Points_For_That_Meeting) * 100
 * 2. Module Score (Final Grade) = Average of all Meeting Scores in that module
 * 
 * KKM Standards:
 * - Meeting KKM: 75 (Passed if >= 75, else Remedial)
 * - Module KKM: 80 (Completed only if Final Grade >= 80)
 */
export const MODULE_CONFIG: Record<number, ModuleConfiguration> = {
  // Module 1: Pengenalan Uang & Berhitung (Total: 25 points)
  1: {
    totalMaxPoints: 25,
    meetings: {
      meeting1: 5,  // Mengenal Uang Koin dan Kertas
      meeting2: 5,  // Berhitung Uang
      meeting3: 5,  // Menukar Uang
      meeting4: 10, // Simulasi Belanja
    }
  },
  
  // Module 2: Keterampilan Bertahan Hidup (Total: 24 points)
  2: {
    totalMaxPoints: 24,
    meetings: {
      meeting1: 4,  // Bahaya di Rumah
      meeting2: 5,  // Keselamatan di Luar
      meeting3: 5,  // Tanggap Darurat
      meeting4: 10, // Simulasi Situasi Darurat
    }
  },
  
  // Module 3: Kesehatan & Kebersihan (Total: 20 points)
  3: {
    totalMaxPoints: 20,
    meetings: {
      meeting1: 5,  // Mencuci Tangan
      meeting2: 5,  // Menjaga Kebersihan Diri
      meeting3: 5,  // Makanan Sehat
      meeting4: 5,  // Olahraga & Istirahat
    }
  },
  
  // Module 4: Bahasa Indonesia & Literasi (Total: 30 points)
  4: {
    totalMaxPoints: 30,
    meetings: {
      meeting1: 5,  // Huruf (Alphabet Race)
      meeting2: 5,  // Kata Sederhana dan Gambar
      meeting3: 10, // Membaca Kalimat
      meeting4: 10, // Memahami Cerita
    }
  }
};

/**
 * KKM (Kriteria Ketuntasan Minimal) Constants
 */
export const KKM_STANDARDS = {
  MEETING: 75,  // Meeting passing grade
  MODULE: 80,   // Module completion grade
};

/**
 * Get max points for a specific meeting in a module
 */
export function getMeetingMaxPoints(moduleId: number, meetingOrder: number): number {
  const config = MODULE_CONFIG[moduleId];
  if (!config) {
    console.warn(`⚠️ Module ${moduleId} not found in MODULE_CONFIG, using default`);
    return 5; // Default fallback
  }
  
  const meetingKey = `meeting${meetingOrder}` as keyof MeetingMaxPoints;
  return config.meetings[meetingKey] || 5;
}

/**
 * Calculate meeting score (0-100 scale)
 */
export function calculateMeetingScore(rawPoints: number, moduleId: number, meetingOrder: number): number {
  const maxPoints = getMeetingMaxPoints(moduleId, meetingOrder);
  const score = Math.round((rawPoints / maxPoints) * 100);
  return Math.min(100, Math.max(0, score)); // Clamp between 0-100
}

/**
 * Calculate module final grade (average of all meeting scores)
 */
export function calculateModuleFinalGrade(meetingScores: number[]): number {
  if (meetingScores.length === 0) return 0;
  const sum = meetingScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / meetingScores.length);
}

/**
 * Check if meeting passed KKM
 */
export function isMeetingPassed(score: number): boolean {
  return score >= KKM_STANDARDS.MEETING;
}

/**
 * Check if module completed (passed KKM)
 */
export function isModuleCompleted(finalGrade: number): boolean {
  return finalGrade >= KKM_STANDARDS.MODULE;
}

/**
 * Get score color class for UI display
 */
export function getScoreColorClass(score: number, isForModule: boolean = false): string {
  const threshold = isForModule ? KKM_STANDARDS.MODULE : KKM_STANDARDS.MEETING;
  
  if (score >= threshold) {
    return "text-green-600 bg-green-50";
  } else {
    return "text-red-600 bg-red-50";
  }
}

/**
 * Get score status label
 */
export function getScoreStatus(score: number, isForModule: boolean = false): string {
  const threshold = isForModule ? KKM_STANDARDS.MODULE : KKM_STANDARDS.MEETING;
  
  if (score >= threshold) {
    return isForModule ? "Completed" : "Passed";
  } else {
    return isForModule ? "Not Completed" : "Remedial";
  }
}
