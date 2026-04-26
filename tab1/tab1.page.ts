import { Component } from '@angular/core';
import { ApiService, Item } from '../services/api';
import { ThemeService } from '../services/theme.service';
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
  selectedCategory = 'All';
  categories = [
    { value: 'All', label: 'All' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Furniture', label: 'Furniture' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Tools', label: 'Tools' },
    { value: 'Miscellaneous', label: 'Misc' }
  ];
  searchHistory: string[] = [];
  showHistory = false;
  isDarkMode = false;

  constructor(private api: ApiService, private themeService: ThemeService) {
    this.isDarkMode = this.themeService.getIsDarkMode();
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  loadAll() {
    this.api.getAll().subscribe(
      (res) => {
        this.fullItems = res;
        this.items = res;
      },
      (error) => {
        alert('Failed to load items: ' + error.message);
        this.items = [];
        this.fullItems = [];
      }
    );
  }

  // 本地搜索
  search() {
    const term = this.keyword.toLowerCase().trim();

    // 根据分类过滤
    let filteredItems = this.fullItems;
    if (this.selectedCategory !== 'All') {
      filteredItems = filteredItems.filter(item => item.category === this.selectedCategory);
    }

    // 根据关键词过滤
    if (term) {
      filteredItems = filteredItems.filter(item =>
        item.item_name.toLowerCase().includes(term)
      );
      
      // 添加到搜索历史
      this.addToSearchHistory(term);
    }

    this.items = filteredItems;
    this.showHistory = false;
  }

  // 添加到搜索历史
  addToSearchHistory(term: string) {
    // 移除重复项
    this.searchHistory = this.searchHistory.filter(item => item !== term);
    // 添加到开头
    this.searchHistory.unshift(term);
    // 限制历史记录数量为5条
    if (this.searchHistory.length > 5) {
      this.searchHistory = this.searchHistory.slice(0, 5);
    }
  }

  // 从历史记录中选择
  selectFromHistory(term: string) {
    this.keyword = term;
    this.search();
  }

  // 清除搜索历史
  clearSearchHistory() {
    this.searchHistory = [];
  }

  // 切换历史记录显示
  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  // 分类变更处理
  onCategoryChange() {
    this.search();
  }

  showHelp() {
    alert('Help:\nSearch items by name or view all.');
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
    this.isDarkMode = this.themeService.getIsDarkMode();
  }
}
