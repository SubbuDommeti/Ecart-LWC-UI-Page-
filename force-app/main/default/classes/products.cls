public with sharing class products {
    @AuraEnabled(cacheable=true)
    public static List<product__c> getProducts()
    {
        List<product__c> prods= [SELECT Id,Name,image__c,price__c,discount__c,category__c,size__c FROM product__c];
         return prods;
    }
}