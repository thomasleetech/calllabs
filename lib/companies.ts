const COMPANY_PHONES: Record<string, string> = {
  'spectrum': '+18003086135',
  'comcast': '+18009346489',
  'xfinity': '+18009346489',
  'at&t': '+18002882020',
  'verizon': '+18009220204',
};

export function getCompanyPhone(company: string): string {
  const normalized = company.toLowerCase().trim();
  return COMPANY_PHONES[normalized] || '+18005551234';
}