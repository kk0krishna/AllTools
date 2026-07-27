import { addDays, differenceInDays, format, isValid, parseISO, subDays } from "date-fns";

export interface DatingResult {
  edd: Date;
  conceptionDate: Date;
  lmpEquivalent: Date;
  currentGAWeeks: number;
  currentGADays: number;
  totalDaysElapsed: number;
  daysRemaining: number;
  progressPercentage: number;
  trimester: "1st Trimester" | "2nd Trimester" | "3rd Trimester" | "Post-Term";
  viabilityDate: Date; // 24w0d
  termDate: Date; // 37w0d
  postTermDate: Date; // 42w0d
  currentMonth: number;
  timeline: { week: number; date: Date; label: string; isPast: boolean; isCurrent: boolean }[];
}

/**
 * Core Obstetrics Calculation Engine
 * Implements standard ACOG / RCOG gestational age and due date mathematics.
 */
export class ObstetricsDatingEngine {
  /**
   * Calculate complete pregnancy profile from Last Menstrual Period (LMP)
   */
  static calculateByLMP(lmpDateStr: string, cycleLength = 28, referenceDateStr?: string): DatingResult | null {
    const lmp = this.parseDate(lmpDateStr);
    if (!lmp) return null;

    const cycleAdjustment = cycleLength - 28;
    const edd = addDays(lmp, 280 + cycleAdjustment);
    const conceptionDate = addDays(lmp, 14 + cycleAdjustment);
    const lmpEquivalent = lmp;

    return this.buildDatingResult(lmpEquivalent, edd, conceptionDate, referenceDateStr);
  }

  /**
   * Calculate complete pregnancy profile from Ultrasound Scan Date & GA at Scan
   */
  static calculateByUltrasound(
    scanDateStr: string,
    gaWeeks: number,
    gaDays: number,
    referenceDateStr?: string
  ): DatingResult | null {
    const scanDate = this.parseDate(scanDateStr);
    if (!scanDate || gaWeeks < 0 || gaDays < 0 || gaDays > 6) return null;

    const totalScanDays = gaWeeks * 7 + gaDays;
    const lmpEquivalent = subDays(scanDate, totalScanDays);
    const edd = addDays(lmpEquivalent, 280);
    const conceptionDate = addDays(lmpEquivalent, 14);

    return this.buildDatingResult(lmpEquivalent, edd, conceptionDate, referenceDateStr);
  }

  /**
   * Calculate complete pregnancy profile from IVF Transfer Date
   * @param embryoAgeDays 3 for Day 3 cleavage stage embryo, 5 for Day 5 blastocyst
   */
  static calculateByIVF(
    transferDateStr: string,
    embryoAgeDays: 3 | 5 | 6 = 5,
    referenceDateStr?: string
  ): DatingResult | null {
    const transferDate = this.parseDate(transferDateStr);
    if (!transferDate) return null;

    // Day 3 embryo: EDD = transfer + 263 days; LMP equivalent = transfer - 17 days
    // Day 5 embryo: EDD = transfer + 261 days; LMP equivalent = transfer - 19 days
    // Day 6 embryo: EDD = transfer + 260 days; LMP equivalent = transfer - 20 days
    let eddOffset = 261;
    let lmpOffset = 19;
    if (embryoAgeDays === 3) {
      eddOffset = 263;
      lmpOffset = 17;
    } else if (embryoAgeDays === 6) {
      eddOffset = 260;
      lmpOffset = 20;
    }

    const edd = addDays(transferDate, eddOffset);
    const lmpEquivalent = subDays(transferDate, lmpOffset);
    const conceptionDate = subDays(transferDate, embryoAgeDays);

    return this.buildDatingResult(lmpEquivalent, edd, conceptionDate, referenceDateStr);
  }

  /**
   * Calculate complete pregnancy profile from Conception / Ovulation / IUI Date
   */
  static calculateByConception(conceptionDateStr: string, referenceDateStr?: string): DatingResult | null {
    const conceptionDate = this.parseDate(conceptionDateStr);
    if (!conceptionDate) return null;

    const edd = addDays(conceptionDate, 266);
    const lmpEquivalent = subDays(conceptionDate, 14);

    return this.buildDatingResult(lmpEquivalent, edd, conceptionDate, referenceDateStr);
  }

  /**
   * Reverse Calculator: Calculate conception, LMP, and IVF transfer dates from target EDD
   */
  static calculateReverseFromEDD(eddStr: string): {
    edd: Date;
    lmpEquivalent: Date;
    conceptionDate: Date;
    ivfDay3Transfer: Date;
    ivfDay5Transfer: Date;
    viabilityDate: Date;
    termDate: Date;
  } | null {
    const edd = this.parseDate(eddStr);
    if (!edd) return null;

    const lmpEquivalent = subDays(edd, 280);
    const conceptionDate = subDays(edd, 266);
    const ivfDay3Transfer = subDays(edd, 263);
    const ivfDay5Transfer = subDays(edd, 261);
    const viabilityDate = addDays(lmpEquivalent, 168); // 24 weeks
    const termDate = addDays(lmpEquivalent, 259); // 37 weeks

    return {
      edd,
      lmpEquivalent,
      conceptionDate,
      ivfDay3Transfer,
      ivfDay5Transfer,
      viabilityDate,
      termDate,
    };
  }

  /**
   * Helper to format any date into clean clinical display strings
   */
  static formatDate(date: Date, formatStr = "MMM dd, yyyy"): string {
    if (!date || !isValid(date)) return "Invalid Date";
    return format(date, formatStr);
  }

  /**
   * Helper to format gestational age as "XXw YYd"
   */
  static formatGA(weeks: number, days: number): string {
    if (weeks < 0) return "Not pregnant yet";
    return `${weeks}w ${days}d`;
  }

  /**
   * Private builder to construct unified DatingResult
   */
  private static buildDatingResult(
    lmpEquivalent: Date,
    edd: Date,
    conceptionDate: Date,
    referenceDateStr?: string
  ): DatingResult {
    const refDate = referenceDateStr ? this.parseDate(referenceDateStr) || new Date() : new Date();
    
    // Total days elapsed since LMP equivalent
    const totalDaysElapsed = differenceInDays(refDate, lmpEquivalent);
    const currentGAWeeks = Math.floor(totalDaysElapsed / 7);
    const currentGADays = ((totalDaysElapsed % 7) + 7) % 7; // handle negative modulo cleanly if before LMP
    
    const daysRemaining = differenceInDays(edd, refDate);
    
    // Progress percentage (0 to 40 weeks = 280 days)
    let progressPercentage = Math.round((totalDaysElapsed / 280) * 100);
    if (progressPercentage < 0) progressPercentage = 0;
    if (progressPercentage > 105) progressPercentage = 105;

    // Determine trimester
    let trimester: DatingResult["trimester"] = "1st Trimester";
    if (currentGAWeeks >= 42) {
      trimester = "Post-Term";
    } else if (currentGAWeeks >= 28) {
      trimester = "3rd Trimester";
    } else if (currentGAWeeks >= 14) {
      trimester = "2nd Trimester";
    }

    // Key obstetric milestones
    const viabilityDate = addDays(lmpEquivalent, 168); // 24w0d
    const termDate = addDays(lmpEquivalent, 259); // 37w0d
    const postTermDate = addDays(lmpEquivalent, 294); // 42w0d

    // Approximate obstetric month (every 4.33 weeks)
    let currentMonth = Math.ceil(currentGAWeeks / 4.33);
    if (currentMonth < 1) currentMonth = 1;
    if (currentMonth > 10) currentMonth = 10;

    // Generate timeline milestones
    const milestoneWeeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 37, 40, 42];
    const timeline = milestoneWeeks.map((week) => {
      const milestoneDate = addDays(lmpEquivalent, week * 7);
      const isPast = refDate >= milestoneDate;
      const isCurrent = currentGAWeeks === week || (currentGAWeeks > week && currentGAWeeks < (milestoneWeeks[milestoneWeeks.indexOf(week) + 1] || 44));
      
      let label = `Week ${week}`;
      if (week === 12) label = "12w (First Trimester Scan)";
      if (week === 20) label = "20w (Anomaly Scan)";
      if (week === 24) label = "24w (Viability & GDM Screen)";
      if (week === 37) label = "37w (Early Term)";
      if (week === 40) label = "40w (Estimated Due Date)";
      if (week === 42) label = "42w (Post-Term)";

      return {
        week,
        date: milestoneDate,
        label,
        isPast,
        isCurrent,
      };
    });

    return {
      edd,
      conceptionDate,
      lmpEquivalent,
      currentGAWeeks,
      currentGADays,
      totalDaysElapsed,
      daysRemaining,
      progressPercentage,
      trimester,
      viabilityDate,
      termDate,
      postTermDate,
      currentMonth,
      timeline,
    };
  }

  private static parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parsed = parseISO(dateStr);
    return isValid(parsed) ? parsed : null;
  }
}
