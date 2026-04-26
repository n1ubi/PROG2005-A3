import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { ApiService, Item } from '../services/api';
import { ThemeService } from '../services/theme.service';


@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    IonicModule 
  ]
})
export class Tab3Page {
  item_name = '';
  category = '';
  quantity = 0;
  price = 0;
  supplier_name = '';
  isDarkMode = false;

  localItemList: Item[] = [];
  searchResults: Item[] = [];

  constructor(private api: ApiService, private themeService: ThemeService, private alertController: AlertController) {
    this.isDarkMode = this.themeService.getIsDarkMode();
    // 页面进入就加载全部真实API数据到本地
    this.api.getAll().subscribe(res => {
      this.localItemList = res;
      console.log('本地拿到全部物品：', this.localItemList);
    });
  }

  load() {
    const keyword = this.item_name.trim();
    if (!keyword) {
      alert('Please enter name');
      return;
    }

    console.log('Loading item with name:', keyword);
    
    // 先尝试从本地数据中模糊匹配
    const item = this.localItemList.find(i =>
      i.item_name.toLowerCase().includes(keyword.toLowerCase())
    );

    if (item) {
      console.log('Found item in local data:', item);
      // 自动填充全部数据
      this.item_name = item.item_name; // 同步回真实原名
      this.category = item.category;
      this.quantity = item.quantity;
      this.price = item.price;
      this.supplier_name = item.supplier_name;
      console.log('Form fields updated:', {
        item_name: this.item_name,
        category: this.category,
        quantity: this.quantity,
        price: this.price,
        supplier_name: this.supplier_name
      });
    } else {
      // 如果本地没有找到，尝试调用API
      console.log('Item not found in local data, trying API');
      this.api.getByName(keyword).subscribe(
        (item) => {
          console.log('API returned item:', item);
          // 自动填充全部数据
          this.item_name = item.item_name; // 同步回真实原名
          this.category = item.category;
          this.quantity = item.quantity;
          this.price = item.price;
          this.supplier_name = item.supplier_name;
          console.log('Form fields updated:', {
            item_name: this.item_name,
            category: this.category,
            quantity: this.quantity,
            price: this.price,
            supplier_name: this.supplier_name
          });
        },
        (error) => {
          console.error('Error loading item:', error);
          alert('Item not found');
        }
      );
    }
  }

  update() {
    const itemName = this.item_name.trim();
    if (!itemName) {
      alert('Please load an item first');
      return;
    }

    const updatedItem = {
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      supplier_name: this.supplier_name,
      stock_status: this.quantity > 0 ? 'In stock' : 'Out of stock'
    };

    this.api.update(itemName, updatedItem).subscribe(
      () => {
        alert('Update success!');
      },
      (error) => {
        alert('Update failed: ' + error.message);
      }
    );
  }

  delete() {
    const itemName = this.item_name.trim();
    if (!itemName) {
      alert('Please load an item first');
      return;
    }

    if (itemName.toLowerCase().includes('laptop')) {
      alert('Cannot delete Laptop!');
      return;
    }

    this.api.delete(itemName).subscribe(
      () => {
        alert('Delete success!');
        // 清空表单
        this.item_name = '';
        this.category = '';
        this.quantity = 0;
        this.price = 0;
        this.supplier_name = '';
      },
      (error) => {
        alert('Delete failed: ' + error.message);
      }
    );
  }

  async showHelp() {
    const alert = await this.alertController.create({
      header: 'Edit & Delete Help',
      message: '<b>Search:</b> Enter item name to search<br><br><b>Update:</b> Modify item details and click Update<br><br><b>Delete:</b> Click Delete button (Laptops cannot be deleted)<br><br><b>Tip:</b> Click on search results to auto-fill the form',
      cssClass: 'custom-alert',
      buttons: ['OK']
    });
    await alert.present();
  }

  // 实时搜索物品
  searchItems() {
    const keyword = this.item_name.trim().toLowerCase();
    if (!keyword) {
      this.searchResults = [];
      return;
    }
    
    // 从本地数据中模糊匹配
    this.searchResults = this.localItemList.filter(item =>
      item.item_name.toLowerCase().includes(keyword)
    );
  }

  // 选择搜索结果中的物品
  selectItem(item: Item) {
    this.item_name = item.item_name;
    this.category = item.category;
    this.quantity = item.quantity;
    this.price = item.price;
    this.supplier_name = item.supplier_name;
    this.searchResults = []; // 清空搜索结果
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
    this.isDarkMode = this.themeService.getIsDarkMode();
  }
}
