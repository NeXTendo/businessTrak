export function slugifyVehicle(make: string, model: string, year: number | string, id: string): string {
  return [make, model, year].join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') + '-' + id.slice(0, 8);
}