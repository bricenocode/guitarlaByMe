import { useState, useEffect } from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import Guitar from './components/Guitar'
import { db } from './data/db'


function App() {

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart');
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db);
  //useEffect(()=>{setData(db)},[]);//Forma recomendada para consumir api's.
  const [cart, setCart] = useState(initialCart);

  const MAX_ITEMS = 5;
  const MIN_ITEMS = 0;

  useEffect(() => (//Sincronizar el local storage con la asincronía de useState.
    localStorage.setItem('cart', JSON.stringify(cart))
  ),[cart])

  function addToCart(item){
    
    const itemExists = cart.findIndex((guitar) => guitar.id === item.id) 
    if(itemExists >= 0){
      if(cart[itemExists].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity++
      setCart(updatedCart)
    }else{
      item.quantity = 1
      setCart([...cart, item])
    }
  }

  function removeFromCart(id){
    setCart((prevCart) => prevCart.filter(guitar => guitar.id !== id))
  }

  function incrementQuantity(id){

    const cartUpdated = cart.map((item)=>{

      if(item.id === id && item.quantity < 5){
        return{
          ...item, quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(cartUpdated)
  }

  function decrementQuantity(id){
    const cartUpdated = cart.map((item)=>{   
      if(item.id === id && item.quantity > 1){
        return{
          ...item, quantity: item.quantity - 1
        }
      }
      return item  
    })
    setCart(cartUpdated)
  }

  function clearCart(){
    setCart([])
  }



  return (
    <>
    <Header
      cart = {cart}
      removeFromCart = {removeFromCart}
      incrementQuantity = {incrementQuantity}
      decrementQuantity = {decrementQuantity}
      clearCart = {clearCart}
    />
    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitarra) => (
              <Guitar
              key = {guitarra.id}
              guitar = {guitarra}
              addToCart = {addToCart}
              />
              )
            )
          }
          
        </div>
    </main>
    <Footer/>
    </>
  )
}

export default App
