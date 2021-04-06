import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { find, map, get, findIndex, set } from 'lodash';
import Swal from 'sweetalert2';
import dataProducts from '../products.json';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: any =  dataProducts;
  shoppingCart: any = [];
  id = 0;
  cartItens = 0;
  itenQuantity = 1;
  orderValue = 0;

  constructor(private route: ActivatedRoute) {
    let change = JSON.parse(localStorage.getItem('products')!);
    if(change !== null) this.product = change;
    this.route.params.subscribe(params => {
      this.id = parseInt(params['id']);
    })
    let cart = JSON.parse(localStorage.getItem('bucket')!); 
    if(cart !== null) {
      this.shoppingCart = cart;
      this.cartItens = this.shoppingCart.length;
    }
    this.product = find(this.product, {id: this.id});
    map(this.shoppingCart, (values) => {
      this.orderValue += values.price;
    })
  }

  ngOnInit(): void {
  }

  goToBuyPage = () => {
    localStorage.setItem('bucket', JSON.stringify(this.shoppingCart));
    window.location.href = "/buy"
  }

  buy = () => {
    let shopping_item = {
      id: this.id,
      name: get(this.product, 'name', ''),
      total: this.itenQuantity,
      price: get(this.product, 'value', ''),
      platform: get(this.product, 'platform', ''),
      image: get(this.product, 'cover', '')
    }
    let alreadyInCart = find(this.shoppingCart, ['id', this.id]);
    let stock = get(alreadyInCart, 'total', '') === get(this.product, 'quantity', '') || this.itenQuantity > get(this.product, 'quantity', ''); 
    if(stock) return;
    if(alreadyInCart){
      let index = findIndex(this.shoppingCart, ['id', this.id])
      set(this.shoppingCart, `[${index}].total`, get(this.shoppingCart, `[${index}].total`)+this.itenQuantity);
      this.orderValue += shopping_item.price;
      localStorage.setItem('bucket', JSON.stringify(this.shoppingCart));
      this.buyAlert();
      return;
    }
    this.shoppingCart.push(shopping_item);
    this.cartItens = this.shoppingCart.length;
    this.orderValue += shopping_item.price;
    localStorage.setItem('bucket', JSON.stringify(this.shoppingCart));
    this.buyAlert();
  }

  setQuantity = (e: any) => {
    this.itenQuantity = parseInt(e.target.value);
  }

  buyAlert = () => {
    Swal.fire('Produto adicionado ao carrinho')
  }
}
