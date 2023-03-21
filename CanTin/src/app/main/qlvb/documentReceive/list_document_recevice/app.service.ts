import { Injectable } from '@angular/core';

export class Product {
    ID: string;
    name: string;
    expanded?: boolean;
    categoryId?: string;

    price?: number;
}

var products: Product[] = [
    {
        ID: "1",
        name: "Văn bản đến ",
        expanded: true
    }, {
        ID: "1_1",
        categoryId: "1",
        name: "Có 1 văn bản đã đến trong ngày ",
        expanded: true
    }, {
        ID: "1_1_1",
        categoryId: "1",
        name: "Có 11 văn bản sắp hết hạn của cơ quan"
    }, {
        ID: "1_1_1_1",
        categoryId: "1",
        name: "Có 13 văn bản chờ xử lý",
        
        price: 220
    }, {
        ID: "1_1_1_2",
        categoryId: "1_1_1_1",
        name: " - 0 văn bản quá hạn",
        
        price: 270
    }, {
        ID: "1_1_1_3",
        categoryId: "1_1_1_1",
        name: " - 0 văn bản không quá hạn",
      
        price: 270
    }, 
    {
        ID: "1_1_1_4",
        categoryId: "1_1_1_1",
        name: " - 0 văn bản không quá hạn",
      
        price: 270
    },
];

@Injectable()
export class Service {
    getProducts(): Product[] {
        return products;
    }
}
