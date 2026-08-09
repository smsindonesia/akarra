/**
 * Daftar grup pengaturan dan labelnya, dipakai bersama oleh sidebar admin
 * dan halaman Pengaturan. Sumber kebenaran untuk validasi tetap di backend
 * (config('akarra.setting_groups')) — daftar ini murni untuk kebutuhan UI.
 */
export const SETTING_GROUPS = ['global', 'home', 'ecosystem', 'products', 'services', 'founders']

export const SETTING_GROUP_LABELS = {
  global: 'Global',
  home: 'Beranda',
  ecosystem: 'Ecosystem',
  products: 'Products',
  services: 'Services',
  founders: 'Founders',
}
