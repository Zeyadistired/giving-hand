export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  lastUpdated: string;
}

/**
 * Get cookie preferences from localStorage
 */
export const getCookiePreferences = (): CookiePreferences => {
  try {
    const saved = localStorage.getItem("cookiePreferences");
    console.log("getCookiePreferences - raw localStorage value:", saved);

    if (saved) {
      const parsed = JSON.parse(saved);
      console.log("getCookiePreferences - parsed preferences:", parsed);
      return parsed;
    }
  } catch (error) {
    console.error("Error loading cookie preferences:", error);
  }

  // Return default preferences if none saved
  const defaults = {
    necessary: true, // Always true - required for basic functionality
    analytics: true, // Default to true
    marketing: false, // Default to false
    lastUpdated: new Date().toISOString()
  };

  console.log("getCookiePreferences - returning defaults:", defaults);
  return defaults;
};

/**
 * Save cookie preferences to localStorage
 */
export const saveCookiePreferences = (preferences: Partial<CookiePreferences>): void => {
  try {
    console.log("saveCookiePreferences called with:", preferences);

    const currentPrefs = getCookiePreferences();
    console.log("Current preferences before update:", currentPrefs);

    const updatedPrefs: CookiePreferences = {
      ...currentPrefs,
      ...preferences,
      necessary: true, // Always enforce necessary cookies
      lastUpdated: new Date().toISOString()
    };

    console.log("Updated preferences to save:", updatedPrefs);

    // Save individual preferences for backward compatibility
    localStorage.setItem("cookiePreferences_necessary", JSON.stringify(updatedPrefs.necessary));
    localStorage.setItem("cookiePreferences_analytics", JSON.stringify(updatedPrefs.analytics));
    localStorage.setItem("cookiePreferences_marketing", JSON.stringify(updatedPrefs.marketing));
    localStorage.setItem("cookiePreferences_lastUpdated", updatedPrefs.lastUpdated);

    // Save complete preferences object
    localStorage.setItem("cookiePreferences", JSON.stringify(updatedPrefs));

    // Verify what was actually saved
    const verifyAnalytics = localStorage.getItem("cookiePreferences_analytics");
    const verifyComplete = localStorage.getItem("cookiePreferences");
    console.log("Verification - analytics in localStorage:", verifyAnalytics);
    console.log("Verification - complete preferences in localStorage:", verifyComplete);

    console.log("Cookie preferences saved successfully:", updatedPrefs);
  } catch (error) {
    console.error("Error saving cookie preferences:", error);
  }
};

/**
 * Check if user has given consent for a specific cookie type
 */
export const hasConsentFor = (cookieType: keyof Omit<CookiePreferences, 'lastUpdated'>): boolean => {
  const preferences = getCookiePreferences();
  return preferences[cookieType];
};

/**
 * Reset cookie preferences to defaults
 */
export const resetCookiePreferences = (): void => {
  try {
    localStorage.removeItem("cookiePreferences");
    localStorage.removeItem("cookiePreferences_necessary");
    localStorage.removeItem("cookiePreferences_analytics");
    localStorage.removeItem("cookiePreferences_marketing");
    localStorage.removeItem("cookiePreferences_lastUpdated");

    console.log("Cookie preferences reset to defaults");
  } catch (error) {
    console.error("Error resetting cookie preferences:", error);
  }
};

/**
 * Check if cookie preferences have been set by the user
 */
export const hasSetCookiePreferences = (): boolean => {
  return localStorage.getItem("cookiePreferences") !== null;
};
