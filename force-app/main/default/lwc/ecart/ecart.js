import { LightningElement,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class Ecart extends LightningElement {
    bagCount=0;
    showCart=false;
    @track searchFilter={
        minVal:10,
        maxVal:undefined,
        categoryVal:'',
        sizeVal:''
    };
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Price', fieldName: 'price__c'},
        { label: 'Image', fieldName: 'image__c',},
    ];
    // isCheckOutDone=false;
    rewardPoints=0;

    @track cartProducts=[];
    get categoryOptions()
    {
        return [
            { label: 'Men', value: 'Men' },
            { label: 'Women', value: 'Women' },
            { label: 'Kids', value: 'Kids' },
        ];
    }
    get sizeOptions()
    {
        return [
            { label: 'L', value: 'L' },
            { label: 'M', value: 'M' },
            { label: 'S', value: 'S' },
        ];
    }
    addToBag(event)
    {
        try{
            this.cartProducts.push(event.detail.selectedProduct);   
            this.bagCount++;  
            const evt = new ShowToastEvent({
                title: 'Product Status',
                message: 'Product is Successfully Added in Your Cart',
                variant: 'success',
            });
            this.dispatchEvent(evt);      
        }   
        catch(err)
        {
            console.log(err);
        }
        
    }
    filterProducts(event)
    {   
        this.searchFilter.minVal=this.template.querySelector('lightning-slider[data-id="minValue"]').value;
        this.searchFilter.maxVal=this.template.querySelector('lightning-slider[data-id="maxValue"]').value;
        this.searchFilter.categoryVal=this.template.querySelector('lightning-combobox[data-id="categoryValue"]').value;
        this.searchFilter.sizeVal=this.template.querySelector('lightning-combobox[data-id="sizeValue"]').value;
        this.searchFilter.key=event.detail.key;
        this.template.querySelector('c-products').filterProducts(this.searchFilter);
                    
    }
    resetChanges(event)
    {
        this.searchFilter.minVal=10;
        this.searchFilter.maxVal=undefined;
        this.searchFilter.categoryVal=undefined;
        this.searchFilter.sizeVal=undefined;
        this.searchFilter.key=this.searchFilter.key;
        this.template.querySelector('c-products').filterProducts(this.searchFilter); 
    }
    openCart(event)
    {
        this.showCart=true;
    }
    handlcloseModal(event)
    {
        this.showCart=false;
    }
    closeCheckoutModal(event)
    {
        this.isCheckOutDone=false;
    }
    get cartProductsTotalPrice()
    {
        try
        {
            let sum=0;
        this.cartProducts.forEach(item=>{
            sum+=item.price__c;
        })
        return sum;
        }
        catch(err)
        {
            console.log(err);
        }

    }
    get isCheckoutVisible()
    {
       return  this.cartProductsTotalPrice ==0 ? true : false;
    }
    handleCheckOut(event)
    {
        try{
            this.showCart=false;
            this.rewardPoints+=this.cartProductsTotalPrice/10;
            // this.isCheckOutDone=true;
            let message = this.cartProducts.length>=2 ? 'Congratualations! You have purchased a sustainable products. Check your Reward Points Section. Thank you' : 'Congratualations! You have purchased a sustainable product. <br/> Check your Reward Points Section. Thank you';
            const evt = new ShowToastEvent({
                title: 'Check Out Status',
                message: message,
                variant: 'success',
                mode:'sticky',
            });
            this.dispatchEvent(evt); 
            this.cartProducts.splice(0, this.cartProducts.length);
            this.bagCount=this.cartProducts.length;
        }
        catch(err){
            console.log(err);
        }
        
    }   
    removeFromBag(event)
    {
        try{
                let prodId=event.target.dataset.id;
                
                const objWithIdIndex = this.cartProducts.findIndex((obj) => obj.Id === prodId);
                alert(objWithIdIndex);

                if (objWithIdIndex > -1) {
                    this.cartProducts.splice(objWithIdIndex, 1);
                }
                if(this.bagCount>=1){
                    this.bagCount-=1;
                }
        }
        catch(err){
            console.log(err);
        }
        
    }
}