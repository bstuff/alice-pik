export type Env = {
  USERS: KVNamespace;
};

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: number;
};

export type SendgridContact = {
  address_line_1: string;
  address_line_2: string;
  alternate_emails: string[];
  city: string;
  country: string;
  email: string;
  first_name: string;
  id: string;
  last_name: string;
  list_ids: string[];
  segment_ids: string[];
  postal_code: string;
  state_province_region: string;
  phone_number: string;
  whatsapp: string;
  line: string;
  facebook: string;
  unique_name: string;
  // custom_fields: {};
  created_at: string;
  updated_at: string;
};

export type { ServerData as RootLoaderData } from './root';
