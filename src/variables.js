const idGenerator = (type, index) => {  
  return type + '-'+ index + '_'  + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export  {idGenerator} 