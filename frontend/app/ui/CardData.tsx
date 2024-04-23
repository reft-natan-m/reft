export interface CardData {
  id: number;
  state: string;
  city: string;
  street: string;
  zip: string;
  value: number;
  tokens: number;
  tokenForSale: number;
  tokenPrice: number;
  image: string;
}

export interface PropertyData {
  id: number;
  state: string;
  city: string;
  street1: string;
  street2: string;
  zip: string;
  year: number;
  value: number;
  tokens: number;
  tokenToList: number;
  tokenPrice: number;
  propType: string;
  propSubtype: string;
  size: number;
  income: number;
  expense: number;
  image: string;
  sizeValue: number;
}

export interface BuySellData {
  sellTotal: number;
  buyTotal: number;
}
