import { Component } from '@angular/core';
import { ApiService, Item } from '../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class Tab1Page {
  // 完整原始数据
  fullItems: Item[] = [];
  // 页面显示的数据
  items: Item[] = [];
  keyword = '';

  constructor(private api: ApiService) { }

  ionViewWillEnter() {
    this.loadAll();
  }

  loadAll() {
    this.api.getAll().subscribe(res => {
      this.fullItems = res;
      this.items = res;
    });
  }

  // 本地搜索
  search() {
    const term = this.keyword.toLowerCase().trim();

    if (!term) {
      this.items = [...this.fullItems];
      return;
    }

    // 在已有数据里过滤匹配名称
    this.items = this.fullItems.filter(item =>
      item.item_name.toLowerCase().includes(term)
    );
  }

  showHelp() {
    alert('Help:\nSearch items by name or view all.');
  }
}
