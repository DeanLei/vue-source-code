// 需要重写数组的哪些方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化
let oldArrayMethods = Array.prototype;
// 先查找我重写的，重写的没有会继续向上查找
export const arrayMethods = Object.create(oldArrayMethods);

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    console.log('用户调用了push方法')
    // AOP 切片编程
    const result = oldArrayMethods[method].apply(this, args); // 调用原生的数组方法
    // push unshift添加的元素可能还是一个对象
    let inserted;// 当前用户插入的元素
    let ob = this.__ob__;
    switch(method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice': // splice有删除 新增 修改功能 新增：arr.splice(0,1,{name: 1})
        inserted = args.splice(2);
      default:
        break
    }
    if(inserted) {
      ob.observeArray(inserted); // 将新增属性继续观测
    }
    return result;
  }
})