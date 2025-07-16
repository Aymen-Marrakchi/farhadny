export interface AdminStats {
  id: number;
  email: string;
  role: string; 
  //totalTicketsSold: number;
  totalRevenue: number;
  percentage: number | null; 
}