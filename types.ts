
export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  image: string;
  specs: {
    weight: string;
    power: string;
    capacity: string;
  };
}

export interface LeasingPartner {
  name: string;
  logo: string;
  url: string;
  description: string;
  highlights: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
