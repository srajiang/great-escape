import Platform from "./Platform";

function PlatformQueue() {
  this.items = [];
  
}

PlatformQueue.prototype.enQ = function (ele){
  this.items.push(ele);
  return this.items;
}

PlatformQueue.prototype.deQ = function() {
  let dqed = this.items[0];
  this.items = this.items.slice(1);
  return dqed;
};

PlatformQueue.prototype.curr = function() {
  return this.items[0];
};

PlatformQueue.prototype.next = function() {
  return this.items[1];
}

PlatformQueue.prototype.last = function() {
  return this.items[this.items.length -1];
}

PlatformQueue.prototype.isEmpty = function() {
  return this.items.length === 0;
}


export default PlatformQueue;