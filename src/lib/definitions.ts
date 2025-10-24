export type User = {
  name: string
  email: string
  // This role is no longer managed by our app, but by Auth0
  role?: 'admin' | 'maintainer' | 'standard' | 'outsider'
}

export type Card = {
  id: string
  name: string
  issuer: string
  last4: string
  balance: number
  creditLimit: number
  apr: number
  paymentDueDate: string
  color: string
}

export type Transaction = {
  id: string;
  cardId: string;
  amount: number;
  outlet: string;
  categoryId: string;
  date: string;
};


export type Goal = {
  id: string
  cardId: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
}

export type Reminder = {
  id: string
  cardId: string
  title: string
  dueDate: string
}
