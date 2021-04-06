import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { get, set, findIndex, map, find } from 'lodash';
import Swal from 'sweetalert2';
import dataProducts from '../products.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any = dataProducts;
  shoppingCart: any = [];
  cartItens = 0;
  orderValue = 0;
  itenQuantity = 1;

  constructor(){
    let purchasedOrder = JSON.parse(localStorage.getItem('purchased-items')!);
    let change = JSON.parse(localStorage.getItem('products')!);
    let cart = JSON.parse(localStorage.getItem('bucket')!);
    if(change !== null) this.products = change;
    if(cart !== null) {
      this.shoppingCart = cart;
      this.cartItens = this.shoppingCart.length;
      map(this.shoppingCart, (values) => {
        this.orderValue += values.price;
      })
    }
    if(purchasedOrder){
      map(purchasedOrder, (values) => {
        let index = findIndex(this.products, ['id', values.id])
        set(this.products, `[${index}].quantity`, get(this.products, `[${index}].quantity`) - values.total)
      })
      localStorage.setItem('products', JSON.stringify(this.products));
    }
  }

  ngOnInit(): void {}

  addProduct = (id: number) => {
    let product = find(this.products, ['id', id]);
    let shopping_item = {
      id: id,
      name: get(product, 'name', ''),
      total: this.itenQuantity,
      price: get(product, 'value', ''),
      platform: get(product, 'platform', ''),
      image: get(product, 'cover', '')
    }
    let alreadyInCart = find(this.shoppingCart, ['id', id]);
    let stockLimit = get(alreadyInCart, 'total', '') === get(product, 'quantity', '') || this.itenQuantity > get(product, 'quantity', ''); 
    if(stockLimit) return;
    if(alreadyInCart){
      let index = findIndex(this.shoppingCart, ['id', id])
      set(this.shoppingCart, `[${index}].total`, get(this.shoppingCart, `[${index}].total`) + this.itenQuantity);
      this.orderValue += shopping_item.price;
      localStorage.setItem('bucket', JSON.stringify(this.shoppingCart));
      this.buyAlert();
      return;
    }
    this.shoppingCart.push(shopping_item);
    this.orderValue += shopping_item.price;
    this.cartItens = this.shoppingCart.length;
    localStorage.setItem('bucket', JSON.stringify(this.shoppingCart));
    this.buyAlert();
  }

  goToBuyPage = () => {
    localStorage.setItem('bucket', JSON.stringify(this.shoppingCart));
    window.location.href = "/buy"
  }

  buy = () => {
    map(this.shoppingCart, (values) => {
      let product = findIndex(this.products, ['id', values.id])
      set(this.products, `[${product}].quantity`, get(this.products, `[${product}].quantity`, '') - values.total)
    })
  }

  setQuantity = (e: any) => {
    this.itenQuantity = parseInt(e.target.value);
  }

  buyAlert = () => {
    Swal.fire('','Produto adicionado ao carrinho', 'success')
  }
}
