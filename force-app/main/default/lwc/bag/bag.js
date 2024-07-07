import { LightningElement,api } from 'lwc';

export default class Bag extends LightningElement {
    @api bagCount=0;
    @api searchKey;
    handleSearch(event){
        this.dispatchEvent(new CustomEvent('search',{detail:{key:event.target.value}}));
    }
    hadleCartOpen(){
        this.dispatchEvent(new CustomEvent('cart'));
    }
}