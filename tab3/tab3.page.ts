import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiService, Item } from '../services/api';


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


  localItemList: Item[] = [];

  constructor(private api: ApiService) {
    // 页面进入就加载全部真实API数据到本地
    this.api.getAll().subscribe(res => {
      this.localItemList = res;
      console.log('本地拿到全部物品：', this.localItemList);
    });
  }

  load() {
    const keyword = this.item_name.trim().toLowerCase();
    if (!keyword) {
      alert('Please enter name');
      return;
    }

    // 模糊匹配：只需名字包含输入的内容
    const item = this.localItemList.find(i =>
      i.item_name.toLowerCase().includes(keyword)
    );

    if (item) {
      // 自动填充全部数据
      this.item_name = item.item_name; // 同步回真实原名
      this.category = item.category;
      this.quantity = item.quantity;
      this.price = item.price;
      this.supplier_name = item.supplier_name;
    } else {
      alert('Item not found');
    }
  }

  update() {
    const keyword = this.item_name.trim().toLowerCase();
    const index = this.localItemList.findIndex(i =>
      i.item_name.toLowerCase().includes(keyword)
    );

    if (index !== -1) {
      this.localItemList[index].category = this.category;
      this.localItemList[index].quantity = this.quantity;
      this.localItemList[index].price = this.price;
      this.localItemList[index].supplier_name = this.supplier_name;
      alert('Update success!');
    }
  }

  delete() {
    if (this.item_name.toLowerCase().includes('laptop')) {
      alert('Cannot delete Laptop!');
      return;
    }

    const keyword = this.item_name.trim().toLowerCase();
    this.localItemList = this.localItemList.filter(i =>
      !i.item_name.toLowerCase().includes(keyword)
    );
    alert('Delete success!');
  }

  showHelp() {
    alert('Help:\nLoad, update or delete items. Laptop cannot be deleted.');
  }
}
