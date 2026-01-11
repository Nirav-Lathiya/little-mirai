"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  selectedSize: string
  selectedColor: string
  quantity: number
  isSale: boolean
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: number; size: string; color: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; size: string; color: string; quantity: number } }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  isOpen: false
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { quantity = 1, ...item } = action.payload
      const existingIndex = state.items.findIndex(
        i => i.id === item.id && i.selectedSize === item.selectedSize && i.selectedColor === item.selectedColor
      )

      if (existingIndex >= 0) {
        const updatedItems = [...state.items]
        updatedItems[existingIndex].quantity += quantity
        return { ...state, items: updatedItems, isOpen: true }
      }

      return {
        ...state,
        items: [...state.items, { ...item, quantity }],
        isOpen: true
      }
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.id === action.payload.id && item.selectedSize === action.payload.size && item.selectedColor === action.payload.color)
        )
      }
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id && item.selectedSize === action.payload.size && item.selectedColor === action.payload.color
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      }
    }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'CLEAR_CART':
      return { ...state, items: [], isOpen: false }
    default:
      return state
  }
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}