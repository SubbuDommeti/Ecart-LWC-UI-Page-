import { LightningElement,wire,api,track } from 'lwc';
import getProducts from '@salesforce/apex/products.getProducts'

const pageSize = 10;
export default class Products extends LightningElement {
    @track products;
    @track availableProducts;
    @track visibleProducts;
    error;
    totalRecountCount;
    totalPage;
    startingRecord=0;
    endingRecord;
    currPage = 1;
    firstCall=true;
    
    @wire(getProducts) getProducts({error,data}){
        if(data)
        {
            this.products=data;
            this.availableProducts=data;
            this.error=undefined;
            this.updateRecords(this.currPage);
        }
        else if(error)
        {
            this.error=error;
        }
    }
    
    ProductClick(event){
        try{
            let prodId=event.detail.productId
            let selectedProduct=this.visibleProducts.filter( r => !prodId || r.Id=== prodId)
            this.dispatchEvent(new CustomEvent('addtobag',{
                detail:{
                    selectedProduct:selectedProduct[0],
                }
            }));

            
        }
        catch(err)
        {
            console.log(err);
        }
    }
    get paginationLabel(){
        return this.currPage +' of ' + this.totalPage;
    }
    get disblePrevious()
    {
        return this.currPage<=1;
    }
    get disableNext()
    {
        return this.currPage>=this.totalPage;
    }

    @api filterProducts(searchFilter){
        if(searchFilter.minVal || searchFilter.maxVal || searchFilter.categoryVal || searchFilter.sizeVal || searchFilter.key){
            
            var searchKay;
            if(searchFilter.key)
                this.searchKey=String(searchFilter.key).toLowerCase(); 

            try{
                this.availableProducts = this.products
                .filter( r => !searchFilter.key || String(r.Name).toLowerCase().includes(this.searchKey))
                .filter( r => !searchFilter.minVal || r.price__c >= searchFilter.minVal)
                .filter( r => !searchFilter.maxVal || r.price__c<= searchFilter.maxVal)
                .filter( r => !searchFilter.categoryVal || r.category__c == searchFilter.categoryVal)
                .filter(r => !searchFilter.sizeVal || r.size__c == searchFilter.sizeVal);
                this.updateRecords(1);
            }
            catch(err){
                alert("Error "+err.message);
            }
            // if(searchFilter.sizeValue)
            // {
            //     for(let rec of  this.availableProducts)
            //     {
            //         let valuesArray=Object.entries(rec);
            //         if(rec.category__c==searchFilter.sizeValue)
            //         {
            //             recs.push(rec);
            //         }

            //     }
            // }
            // recs=[...new Set(recs)];
            // users= this.availableProducts.filter(function(prod) {
            //     if (var minValue,maxValue,categoryValue,sizeValue in searchFilter) {
            //       if (item[key] === undefined || item[key] != filter[key])
            //         return false;
            //     }
            //     return true;
            //   });         
            
        }
        else{
                this.availableProducts=this.products;
                this.updateRecords(1);
        }
    }
    
    // paginationHandler(event){
    //     alert(event.detail.records);
    // }

    previousHandler(event){
        if (this.currPage > 1) {
            this.currPage = this.currPage - 1; //decrease page by 1
            this.updateRecords(this.currPage);
        }
    }
    nextHandler(event){
        if((this.currPage<this.totalPage) && this.currPage !== this.totalPage){
            this.currPage = this.currPage + 1; //increase page by 1
            this.updateRecords(this.currPage);            
        }
    }

    updateRecords(page)
    {   
        try{
            if(this.availableProducts){
                this.currPage=page;
                this.totalRecountCount = this.availableProducts.length;
                this.totalPage=Math.ceil(this.totalRecountCount / pageSize);
                if(this.firstCall){            
                    this.visibleProducts = this.availableProducts.slice(this.startingRecord,pageSize); 
                    this.endingRecord = pageSize;
                    this.firstCall=false;
                }
                else{
                    this.startingRecord = ((this.currPage -1) * pageSize) ;
                    this.endingRecord = (pageSize * this.currPage);
        
                    this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                                        ? this.totalRecountCount : this.endingRecord; 
        
                    this.visibleProducts = this.availableProducts.slice(this.startingRecord, this.endingRecord);
        
                    this.startingRecord = this.startingRecord + 1;
                }
            }
        }
        catch(err){
            alert("Error "+err.message);
        }
    }
}