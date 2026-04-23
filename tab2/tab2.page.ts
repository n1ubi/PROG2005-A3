import { Component } from '@angular/core';
import { ApiService } from '../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule 
  ]
})
export class Tab2Page {
  item_name = '';
  category = 'Electronics';
  quantity = 0;
  price = 0;
  supplier_name = '';
  featured_item = 0;
  special_note = '';

  constructor(private api: ApiService) { }

  add() {
    const item = {
      item_name: this.item_name,
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      supplier_name: this.supplier_name,
      stock_status: this.quantity > 0 ? 'In stock' : 'Out of stock',
      featured_item: this.featured_item,
      special_note: this.special_note
    };

    this.api.add(item).subscribe(() => {
      alert('Added!');
      // 添加成功清空表单
      this.item_name = '';
      this.category = 'Electronics';
      this.quantity = 0;
      this.price = 0;
      this.supplier_name = '';
      this.featured_item = 0;
      this.special_note = '';
    });
  }

  showHelp() {
    alert('Help:\nFill all fields to add a new item.');
  }
}
