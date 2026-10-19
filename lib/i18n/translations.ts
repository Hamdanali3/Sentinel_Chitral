export type Language = "en" | "ur" | "kw";

export interface Translations {
  appName: string;
  tagline: string;
  heroSub: string;
  navLiveMap: string;
  navGlacierInfo: string;
  navGetAlerts: string;
  navAdmin: string;
  btnSubscribe: string;
  btnLearnMore: string;
  statValleysMonitored: string;
  statGlaciersTracked: string;
  statActiveWarnings: string;
  statSubscribers: string;
  liveStatusTitle: string;
  lastSatelliteSync: string;
  routeCheckerTitle: string;
  routeCheckerDesc: string;
  routeCheckerPlaceholder: string;
  routeCheckerBtn: string;
  routeStatusSafe: string;
  routeStatusCaution: string;
  routeStatusDanger: string;
  riskLevels: {
    Low: string;
    Watch: string;
    Warning: string;
    Danger: string;
  };
  details: {
    lakeTelemetry: string;
    elevationRelief: string;
    historicalEvents: string;
    waterSurfaceArea: string;
    recentTrend: string;
    emergencyContacts: string;
    emergencyDesc: string;
    pdmaHotline: string;
    rescue1122: string;
    districtLevies: string;
    viewRouteDetails: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Sentinel Chitral",
    tagline: "Glacial Flood Early Warning System",
    heroSub:
      "AI-powered early warning system for Glacial Lake Outburst Floods (GLOFs), landslides, and severe weather across Chitral's valleys.",
    navLiveMap: "Live Map",
    navGlacierInfo: "Glacier Info",
    navGetAlerts: "Get Alerts",
    navAdmin: "Admin",
    btnSubscribe: "Subscribe for Alerts",
    btnLearnMore: "Learn About GLOFs",
    statValleysMonitored: "Valleys Monitored",
    statGlaciersTracked: "Glaciers Tracked",
    statActiveWarnings: "Active Warnings",
    statSubscribers: "Subscribers Alerted",
    liveStatusTitle: "Live District Status",
    lastSatelliteSync: "Last satellite sync:",
    routeCheckerTitle: "Valley & Route Safety Checker",
    routeCheckerDesc: "Planning to travel? Check the real-time glacial flood and route safety status of any Chitral valley.",
    routeCheckerPlaceholder: "Select destination valley...",
    routeCheckerBtn: "Check Safety",
    routeStatusSafe: "Safe for travel. Normal mountain road conditions.",
    routeStatusCaution: "Proceed with caution. Elevated runoff or watch status.",
    routeStatusDanger: "Hazard alert! Non-essential travel strictly discouraged.",
    riskLevels: {
      Low: "Low Risk",
      Watch: "Watch",
      Warning: "Warning",
      Danger: "Danger",
    },
    details: {
      lakeTelemetry: "Glacial Lake & Water Telemetry",
      elevationRelief: "Elevation Relief",
      historicalEvents: "Documented Past Floods",
      waterSurfaceArea: "Monitored Lake Area",
      recentTrend: "30-Day Water & Risk Trend",
      emergencyContacts: "Emergency Numbers & Contacts",
      emergencyDesc: "In case of emergency, flash flood sighting, or roadblock, contact local authorities immediately:",
      pdmaHotline: "PDMA KP Disaster Control Room: 1700",
      rescue1122: "Rescue 1122 Chitral: 1122 / 0943-412952",
      districtLevies: "Chitral Levies / Police Emergency: 15 / 0943-412122",
      viewRouteDetails: "View Valley Advisory →",
    },
  },
  ur: {
    appName: "سینٹینل چترال",
    tagline: "گلیشیر فلڈ ارلی وارننگ سسٹم",
    heroSub:
      "چترال کی وادیوں کے لیے گلیشیر جھیلوں کے پھٹنے (GLOF)، لینڈ سلائیڈنگ اور شدید موسم سے پیشگی خبردار کرنے والا خودکار نظام۔",
    navLiveMap: "لائیو نقشہ",
    navGlacierInfo: "گلیشیئرز معلومات",
    navGetAlerts: "الرٹس حاصل کریں",
    navAdmin: "ایڈمن",
    btnSubscribe: "الرٹس کے لیے رجسٹر ہوں",
    btnLearnMore: "سیلاب کے خطرات جانیے",
    statValleysMonitored: "زیر نگرانی وادیاں",
    statGlaciersTracked: "گلیشیئرز",
    statActiveWarnings: "فعال انتباہات",
    statSubscribers: "موصول کنندگان",
    liveStatusTitle: "ضلع چترال کی تازہ ترین صورتحال",
    lastSatelliteSync: "آخری سیٹلائٹ اپڈیٹ:",
    routeCheckerTitle: "راستہ اور وادی سیفٹی چیکر",
    routeCheckerDesc: "کیا آپ سفر کی تیاری کر رہے ہیں؟ کسی بھی وادی کا تازہ ترین سیلابی اور سفری خطرہ معلوم کریں۔",
    routeCheckerPlaceholder: "وادی کا انتخاب کریں...",
    routeCheckerBtn: "حفاظت چیک کریں",
    routeStatusSafe: "سفر کے لیے محفوظ۔ عام موسمی حالات۔",
    routeStatusCaution: "احتیاط برتیں۔ ندی نالوں میں پانی کے بہاؤ پر نظر رکھیں۔",
    routeStatusDanger: "انتہائی خطرہ! غیر ضروری سفر سے مکمل گریز کریں۔",
    riskLevels: {
      Low: "محفوظ",
      Watch: "نگرانی",
      Warning: "انتباہ",
      Danger: "خطرہ",
    },
    details: {
      lakeTelemetry: "گلیشیر جھیل اور آبی پیمائش",
      elevationRelief: "بلندی کا فرق",
      historicalEvents: "ماضی کے سیلاب واقعات",
      waterSurfaceArea: "جھیل کا رقبہ",
      recentTrend: "30 روزہ آبی اور خطرے کا رجحان",
      emergencyContacts: "ہنگامی نمبرز اور رابطے",
      emergencyDesc: "سیلابی ریلے یا راستے کی بندش کی صورت میں فوری طور پر انتظامیہ سے رابطہ کریں:",
      pdmaHotline: "پی ڈی ایم اے کنٹرول روم: 1700",
      rescue1122: "ریسکیو 1122 چترال: 1122 / 0943-412952",
      districtLevies: "لیویز و پولیس کنٹرول: 15 / 0943-412122",
      viewRouteDetails: "تفصیلی وادی رپورٹ دیکھیں ←",
    },
  },
  kw: {
    appName: "سینٹینل چترال",
    tagline: "چھترار گلیشیرو یوش ارلی وارننگ",
    heroSub:
      "چھترارو وادیان موژی گلیشیر یوش (GLOF) اوچے شدید بوڈیکو خطراتو بارا پیشگی آگاہی نظام۔",
    navLiveMap: "نقشہ",
    navGlacierInfo: "گلیشیرو معلومات",
    navGetAlerts: "الرٹس گنور",
    navAdmin: "ایڈمن",
    btnSubscribe: "الرٹس سبسکرائب کورور",
    btnLearnMore: "سیلابو بارا معلومات",
    statValleysMonitored: "نگرانی وادیان",
    statGlaciersTracked: "گلیشیر",
    statActiveWarnings: "فعال وارننگ",
    statSubscribers: "سبسکرائبرز",
    liveStatusTitle: "چھترارو تروزا صورتحال",
    lastSatelliteSync: "سیٹلائٹ اپڈیٹ:",
    routeCheckerTitle: "راہ اوچے وادی سیفٹی چیکر",
    routeCheckerDesc: "سفرو ارادہ شیرا؟ کھین وادیو موسمی اوچے یوشو خطرہ معلوم کورور۔",
    routeCheckerPlaceholder: "وادی ژانو...",
    routeCheckerBtn: "حفاظت چیک کورور",
    routeStatusSafe: "سفرو بچین محفوظ۔ راستا صاف۔",
    routeStatusCaution: "احتیاط کورور۔ اوغو رفتار زیادہ شیک۔",
    routeStatusDanger: "سخت خطرہ! سفر مو کورور۔",
    riskLevels: {
      Low: "محفوظ",
      Watch: "نگرانی",
      Warning: "وارننگ",
      Danger: "خطرہ",
    },
    details: {
      lakeTelemetry: "گلیشیر ڈنڈو اوغو پیمائش",
      elevationRelief: "پونڈو بلندی",
      historicalEvents: "پرانہ یوشو ریکارڈ",
      waterSurfaceArea: "ڈنڈو رقبہ",
      recentTrend: "30 روچو خطرو رجحان",
      emergencyContacts: "ہنگامی نمبرز",
      emergencyDesc: "ہنگامی حالات موژی فوری طورا رابطہ کورور:",
      pdmaHotline: "پی ڈی ایم اے کنٹرول روم: 1700",
      rescue1122: "ریسکیو 1122 چھترار: 1122",
      districtLevies: "لیویز کنٹرول روم: 15",
      viewRouteDetails: "وادیو مکمل رپورٹ لوٹس ←",
    },
  },
};
