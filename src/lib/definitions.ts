export type User = {
  name: string
  email: string
  role: 'admin' | 'maintainer' | 'standard' | 'outsider'
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
  id: string
  cardId: string
  amount: number
  description: string
  category: string
  date: string
}

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
