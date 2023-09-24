export interface ActionData {
  success: boolean;
  status: number;
  message?: string;
  errors?: unknown[];
  data?: any;
  id?: string;
}
