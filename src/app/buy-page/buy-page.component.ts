import { Component, OnInit } from '@angular/core';
import { map } from 'lodash';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buy-page',
  templateUrl: './buy-page.component.html',
  styleUrls: ['./buy-page.component.scss']
})
export class BuyPageComponent implements OnInit {
  cartProducts: any = [];
  orderValue = 0;

  constructor(){
    let products = JSON.parse(localStorage.getItem('bucket')!)
    if(products !== null){
      this.cartProducts = products;
      map(this.cartProducts, (values) => {
        this.orderValue += values.price;
      })
    }
  }

  ngOnInit(): void {}

  buy = () => {
    this.buyAlert()
    localStorage.setItem('purchased-items',  JSON.stringify(this.cartProducts))
    localStorage.removeItem('bucket');
    this.cartProducts = [];
    this.orderValue = 0;
  }

  cancelOrder = () => {
    if(this.cartProducts.length === 0){
      window.location.href = '/';  
      return;
    }
    localStorage.removeItem('bucket');
    localStorage.removeItem('purchased-items');
    window.location.href = '/';
  }

  buyAlert = () => {
    Swal.fire('','Compra realizada com sucesso', 'success')
  }
}
