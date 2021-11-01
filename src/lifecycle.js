import {Watcher} from "./observer/watcher";
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vnode) {

  }
}

export function mountComponent(vm, el) {
  const options = vm.$options; // render
  vm.$el = el; // 真实的dom元素

  // Watcher 就是用来渲染的
  // vm._render 通过解析的render方法 渲染出虚拟dom
  // vm._update 通过虚拟dom 创建真实的dom
  // 渲染页面
  let updateComponent = () => { // 无论是渲染还是更新，都会调用此方法
    // _render: 返回的是虚拟dom _update: 虚拟dom生成真实dom
    vm._update(vm._render());
  }
  // 渲染watcher 每个组件都有一个watcher
  // 实例，渲染函数，回调， true 表示他是一个渲染watcher
  new Watcher(vm, updateComponent, () => {}, true); 
}