import { Component, OnInit } from '@angular/core';
import { ApiService, Item } from '../services/api';
import { ThemeService } from '../services/theme.service';
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
export class Tab2Page implements OnInit {
  item_name = '';
  category = 'Electronics';
  quantity = 0;
  price = 0;
  supplier_name = '';
  featured_item = 0;
  special_note = '';
  featuredItems: Item[] = [];
  isDarkMode = false;

  constructor(private api: ApiService, private themeService: ThemeService) {
    this.isDarkMode = this.themeService.getIsDarkMode();
  }

  ngOnInit() {
    this.loadFeaturedItems();
  }

  loadFeaturedItems() {
    this.api.getAll().subscribe(
      (items) => {
        this.featuredItems = items.filter(item => item.featured_item === 1);
      },
      (error) => {
        console.error('Failed to load featured items:', error);
      }
    );
  }

  add() {
    // 表单验证
    if (!this.item_name.trim()) {
      alert('Please enter item name');
      return;
    }

    if (!this.category) {
      alert('Please select category');
      return;
    }

    if (this.quantity < 0) {
      alert('Quantity cannot be negative');
      return;
    }

    if (this.price < 0) {
      alert('Price cannot be negative');
      return;
    }

    if (!this.supplier_name.trim()) {
      alert('Please enter supplier name');
      return;
    }

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

    this.api.add(item).subscribe(
      () => {
        alert('✅ Item added successfully!');
        // 添加成功清空表单
        this.item_name = '';
        this.category = 'Electronics';
        this.quantity = 0;
        this.price = 0;
        this.supplier_name = '';
        this.featured_item = 0;
        this.special_note = '';
        // 重新加载特色项目列表
        this.loadFeaturedItems();
      },
      (error) => {
        alert('Add failed: ' + error.message);
      }
    );
  }

  showHelp() {
    alert('Help:\nFill all fields to add a new item.');
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
    this.isDarkMode = this.themeService.getIsDarkMode();
  }
}
