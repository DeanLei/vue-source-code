// 把data中的数据 都使用Object.defineProperty重新定义 es5
// Object.defineProperty 不能兼容ie8及以下 vue2无法兼容ie8版本
import {
  isObject,
  def
} from "../util/index"
import {arrayMethods} from './array.js';
class Observer {
  constructor(value) {
    // vue如果数据的层次过多，需要递归的去解析对象中的属性，依次增加 set和get方法
    // proxy不需要递归，也不需要增加set和get，所以vue3使用这个
    
    // 给每一个监控过的对象都增加一个__ob__属性
    def(value, '__ob__', this);
    if(Array.isArray(value)) {
      // 如果是数组的话并不会对索引进行观测 因为会导致性能问题
      // 前端开发中很少去操作索引
      value.__proto__ = arrayMethods;
      // 如果数组里放的是对象，我再监控
      this.observeArray(value);
    } else {
      this.walk(value)
    }
  }
  observeArray(value) {
    for(let i = 0; i < value.length; i++) {
      observe(value[i])
    }
  }
  walk(data) {
    let keys = Object.keys(data);
    keys.forEach(key => {
      defineReactive(data, key, data[key]); //定义响应式数据
    })
  }
}

function defineReactive(data, key, value) {
  observe(value);// 递归实现深度检测
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newVal) {
      console.log("更新数据")
      if(newVal === value) return;
      observe(newVal); // 继续劫持用户设置，因为有可能用户设置的值是一个对象
      value = newVal;
    }
  })
}

export function observe(data) {
  let isObj = isObject(data);
  if(!isObj) return;

  return new Observer(data); // 用来观测数据
}