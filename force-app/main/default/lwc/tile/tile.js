import { LightningElement,api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class Tile extends LightningElement {
   @api singleProduct;
   showModal=false;   
   addToBag(event)
   {
      try{
            this.dispatchEvent(new CustomEvent('productclick',{
            detail:{
               productId:event.target.dataset.prodid,
            }
         }));
         console.log(event.target.dataset.prodid)  ;
         //this.template.querySelector('[data-prodid="'+event.target.dataset.prodid+'"]').style='background:green';
         this.showModal=false;
      }
      catch(err)
      {
         console.log(err);
      }
      
   }
   openProductDetail(event)
   {
      this.showModal=true;
   }
   handlcloseModal(event)
   {
      this.showModal=false;
   }
}